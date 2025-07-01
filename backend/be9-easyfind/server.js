require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./apis/auth/auth.route");
const itemsRoutes = require("./apis/items/items.route");    
const userDetails = require("./apis/users/userDetails");
const connectDB=require('./config/db')
// const securityRoutes = require("./apis/security/security.route");

const app = express();

// Database connection
connectDB()
    
// Middleware
app.use(cors());
app.use(express.json());
// app.use(passport.initialize());

// // DB Connect
// const connectDB = require("./config/db");
// connectDB();

// Routes
app.get("/" ,(req,res)=>{
    res.send("Hello world")
})
app.use("/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api", userDetails);

// app.use("/api/security", securityRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
