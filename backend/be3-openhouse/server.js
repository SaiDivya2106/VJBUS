const express = require('express');
const cors = require('cors');
const path = require('path');
const multerConfig = require('./middlewares/multerConfig');
const projectRoutes = require('./routes/projectRoutes');

const app = express();


// Enable CORS for localhost:3000
app.use(cors({
  origin: ['http://localhost:3105', 'http://10.45.8.187:3000','http://localhost:5174', 'http://openhouse.vjstartup.com'],
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Use routes
app.use('/projects', projectRoutes);

// Serve static files for the uploaded content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "healthy",
        service: "openhouse-be", 
        timestamp: new Date().toISOString()
    });
});

// Start the server
const PORT = 6103;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

setInterval(() => {
  console.log("Server alive...");
}, 5000);
    
// curl -X POST http://localhost:3120/projects/upload-project \
// -F "title=Autonomous Vehicles" \
// -F "abstract=Developing self-driving technology for vehicles" \
// -F "team_details=Kathy White, Larry Grey" \
// -F "department=Automobile Engineering" \
// -F "tags[]=AI" \
// -F "tags[]=Autonomous Vehicles" \
// -F "domain=Transportation" \
// -F "is_software=true" \
// -F "methodology=@inputs/image.jpg" \
// -F "result=@inputs/image.jpg" \
// -F "cover_poster=@inputs/image.jpg" \
// -F "pdf_poster=@inputs/poster.pdf"


// curl -X POST http://localhost:3120/projects/upload-project \
//   -F "title=Robotics for Manufacturing" \
//   -F "abstract=Leveraging robotics to improve efficiency in manufacturing plants" \
//   -F "team_details=Grace Miller, Harry Johnson" \
//   -F "department=Industrial Engineering" \
//   -F "tags[]=Robotics" \
//   -F "tags[]=Manufacturing" \
//   -F "domain=Industry 4.0" \
//   -F "is_software=false" \
//   -F "methodology=@inputs/image.jpg" \
//   -F "result=@inputs/image.jpg" \
//   -F "cover_poster=@inputs/image.jpg" \
//   -F "pdf_poster=@inputs/poster.pdf"
  

