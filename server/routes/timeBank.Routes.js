const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const TimeBank = require('../models/timeBankModel'); // Make sure this is the correct path

// GET /api/timebank/history
router.get('/history', protect, async (req, res) => {
    const userId = req.user._id;
    try {
        const history = await TimeBank.find({ user: userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching timebank history' });
    }
});

module.exports = router;
