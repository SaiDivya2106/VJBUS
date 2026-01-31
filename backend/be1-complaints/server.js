const exp = require('express');
const app = exp();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(exp.static(path.join(__dirname, '../../frontend/fe1-complaints/build')));
app.use(exp.json());

const mc = require('mongodb').MongoClient;

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'complaintsdb';

const reminderCron = require("./cron/reminderCron");

let serverStarted = false;
const port = process.env.PORT || 5000;

function startServer() {
  if (serverStarted) return;
  serverStarted = true;
  app.listen(port, () =>
    console.log(`Web server running on port ${port}`)
  );
}

// MongoDB connection with retry
async function connectWithRetry(retries = 10, delayMs = 3000) {
  try {
    const client = await mc.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000
    });

    const dbObj = client.db(DB_NAME);

    const complaintsCollectionObj = dbObj.collection('complaintsCollection');
    const adminsCollectionObj = dbObj.collection('adminsCollection');
    const flaggedusersCollectionObj = dbObj.collection('flaggedusersCollection');
    const superAdminCollectionObj = dbObj.collection('superAdminCollection');

    app.set('complaintsCollectionObj', complaintsCollectionObj);
    app.set('adminsCollectionObj', adminsCollectionObj);
    app.set('flaggedusersCollectionObj', flaggedusersCollectionObj);
    app.set('superAdminCollectionObj', superAdminCollectionObj);

    console.log('DB connection success');

    // ✅ Start cron only after DB is ready
    reminderCron(
      complaintsCollectionObj,
      adminsCollectionObj
    );

    // ✅ Start server only once DB is ready
    startServer();

  } catch (err) {
    console.log('DB connection error:', err?.message || err);
    if (retries > 0) {
      console.log(`Retrying Mongo connection in ${delayMs}ms (${retries} attempts left)`);
      setTimeout(() => connectWithRetry(retries - 1, delayMs), delayMs);
    } else {
      console.error('Could not connect to Mongo after retries. Exiting.');
      process.exit(1);
    }
  }
}

// Start DB connection attempts
connectWithRetry();

// APIs
const userApp = require('./APIs/user-api');
const adminApp = require('./APIs/admin-api');

app.use('/user-api', userApp);
app.use('/admin-api', adminApp);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "complaints-be",
    timestamp: new Date().toISOString()
  });
});

// React SPA fallback
app.get('*', (req, res) => {
  if (
    !req.originalUrl.startsWith('/user-api') &&
    !req.originalUrl.startsWith('/admin-api')
  ) {
    res.sendFile(
      path.join(__dirname, '../../frontend/fe1-complaints/build/index.html')
    );
  } else {
    res.status(404).send({ message: "API route not found" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "error", payload: err.message });
});

