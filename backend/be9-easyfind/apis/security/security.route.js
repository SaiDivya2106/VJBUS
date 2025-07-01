const express = require('express');
const router = express.Router();
const securityController = require('./security.controller');
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/role');

// Route to get pending items
router.get('/pending', authMiddleware.verifyToken, roleMiddleware.restrictTo('security'), securityController.getPendingItems);

// Route to verify an item
router.post('/verify', authMiddleware.verifyToken, roleMiddleware.restrictTo('security'), securityController.verifyItem);

// Route to reject an item
router.post('/reject', authMiddleware.verifyToken, roleMiddleware.restrictTo('security'), securityController.rejectItem);

module.exports = router;