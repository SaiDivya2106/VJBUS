const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middlewares/auth');

router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Token received:', req.header('Authorization'));
    console.log('User from auth middleware:', req.user);

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: user.hasPassword,
      googleId: user.googleId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error in profile route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
