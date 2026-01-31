const jwt = require("jsonwebtoken");

// Verify JWT issued by auth-server (SSO)
const verifyAppJWT = (req, res, next) => {
  // Prefer HttpOnly cookie set by auth-server
  let token = req.cookies?.userToken;

  // Fallback to Authorization header for backward compatibility
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    console.error("❌ No token provided in cookies or Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Must match auth-server JWT_SECRET
    const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);
    req.user = decoded; // { email, name, picture }
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", {
      name: error.name,
      message: error.message,
      hasSecret: !!process.env.AUTH_JWT_SECRET,
      tokenPreview: token?.substring(0, 12) + "..."
    });
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyAppJWT;
