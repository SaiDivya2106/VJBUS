const exp = require('express');
const app = exp();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

// Enable CORS with specific origin and credentials
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5000", "https://thrive.vjstartup.com", "http://localhost:6101"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Deploy React build to this server
app.use(exp.static(path.join(__dirname, '../../frontend/fe1-complaints/build')));

app.use(exp.json());

const isExperimental = require('./utils/isExperimental');
const demoDb = require('./demo/demoDatabase');
const mc = require('mongodb').MongoClient;

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'complaintsdb';

const port = process.env.PORT || 5000;
let serverStarted = false;

function startServer() {
  if (serverStarted) return;
  serverStarted = true;
  app.listen(port, () => console.log(`Web server running on port ${port}`));
}

async function connectWithRetry(retries = 10, delayMs = 3000) {
  if (isExperimental) {
    console.log("⚠️ STARTING IN EXPERIMENTAL (DEMO) MODE ⚠️");
    console.log("No real database connection. Data is in-memory only.");

    const complaintsCollectionObj = demoDb.collection('complaintsCollection');
    const adminsCollectionObj = demoDb.collection('adminsCollection');
    const flaggedusersCollectionObj = demoDb.collection('flaggedusersCollection');
    const superAdminCollectionObj = demoDb.collection('superAdminCollection');
    const assistantsCollectionObj = demoDb.collection('assistantsCollection');

    app.set('complaintsCollectionObj', complaintsCollectionObj);
    app.set('adminsCollectionObj', adminsCollectionObj);
    app.set('flaggedusersCollectionObj', flaggedusersCollectionObj);
    app.set('superAdminCollectionObj', superAdminCollectionObj);
    app.set('assistantsCollectionObj', assistantsCollectionObj);

    console.log('✅ Demo DB initialized');

    const RESET_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
    let lastReset = Date.now();

    setInterval(() => {
      const now = Date.now();
      if (now - lastReset > RESET_INTERVAL) {
        demoDb.resetData();
        lastReset = now;
        console.log("♻️ Weekly Demo Data Reset Triggered");
      }
    }, 60 * 60 * 1000); // Check every hour

    startServer();
    return;
  }

  try {
    const client = await mc.connect(MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    const dbObj = client.db(process.env.DB_NAME || DB_NAME);
    const complaintsCollectionObj = dbObj.collection('complaintsCollection');
    const adminsCollectionObj = dbObj.collection('adminsCollection');
    const flaggedusersCollectionObj = dbObj.collection('flaggedusersCollection');
    const superAdminCollectionObj = dbObj.collection('superAdminCollection');
    const assistantsCollectionObj = dbObj.collection('assistantCollection');

    app.set('complaintsCollectionObj', complaintsCollectionObj);
    app.set('adminsCollectionObj', adminsCollectionObj);
    app.set('flaggedusersCollectionObj', flaggedusersCollectionObj);
    app.set('superAdminCollectionObj', superAdminCollectionObj);
    app.set('assistantsCollectionObj', assistantsCollectionObj);

    console.log('DB connection success');
    
    const reminderCron = require("./cron/reminderCron");
    reminderCron(complaintsCollectionObj, adminsCollectionObj);

    startServer();
  } catch (err) {
    console.log('DB connection error:', err && err.message ? err.message : err);
    if (retries > 0) {
      console.log(`Retrying Mongo connection in ${delayMs}ms (${retries} attempts left)`);
      setTimeout(() => connectWithRetry(retries - 1, delayMs), delayMs);
    } else {
      console.log('Could not connect to Mongo after retries. Exiting.');
      process.exit(1);
    }
  }
}

connectWithRetry();

const userApp = require('./APIs/user-api');
const adminApp = require('./APIs/admin-api');

app.use('/user-api', userApp);
app.use('/admin-api', adminApp);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "complaints-be",
    timestamp: new Date().toISOString()
  });
});

// ✅ React SPA fallback (only for non-API GET requests)
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/user-api') && !req.originalUrl.startsWith('/admin-api')) {
    res.sendFile(path.join(__dirname, '../../frontend/fe1-complaints/build/index.html'));
  } else {
    res.status(404).send({ message: "API route not found" });
  }
});

// Express error handler
app.use((err, req, res, next) => {
  res.send({ message: "error", payload: err.message });
  console.log(err);
});
