const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

console.log("client id")
console.log(process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // Optional: save user to DB here if needed
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
