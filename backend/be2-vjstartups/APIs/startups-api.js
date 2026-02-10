const express = require('express');
const router = express.Router();


router.use(express.json());

// Example route for testing
router.get('/', (req, res) => {
    res.json({ message: 'Startups API is working' });
});

module.exports = router;
