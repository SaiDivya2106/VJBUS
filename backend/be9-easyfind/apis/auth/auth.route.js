const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token with Expiry
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, user: user },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// Controller: Google Auth Callback
const handleGoogleCallback = (req, res) => {
  try {
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      hasPassword: req.user.hasPassword,
    };

    const token = generateToken(user);

    res.redirect(
      `${process.env.FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(JSON.stringify(user))}&auth=success`
    );
  } catch (error) {
    console.error("Google auth error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?auth=failed`);
  }
};

// Controller: Set Password
const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.hasPassword = true;
    await user.save();

    res.json({ message: "Password set successfully" });
  } catch (err) {
    console.error("Error setting password:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Route: Google Authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route: Google Authentication Callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
      if (!user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);

      req.user = user;
      next();
    })(req, res, next);
  },
  handleGoogleCallback
);

// Route: Set Password
router.post("/set-password", setPassword);

module.exports = router;
