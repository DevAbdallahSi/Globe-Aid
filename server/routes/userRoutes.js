const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth');

// @route   GET /api/users/me
// @desc    Get current logged-in user info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/users/me
// @desc    Update current user's profile
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// (Optional) @route   GET /api/users/
// @desc    Get all users (admin only or for search/autocomplete)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('name email');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
