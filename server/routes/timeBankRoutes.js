const express = require('express');
const router = express.Router();
const TimeBank = require('../models/TimeBankOffer');
const User = require('../models/user.model'); // assuming a User model exists
const authMiddleware = require('../middlewares/auth'); // protect routes

// @route   POST /api/timebank/donate
// @desc    Donate time to the bank or a user
router.post('/donate', authMiddleware, async (req, res) => {
    const { hours, recipientId, description } = req.body;
    const donorId = req.user.id;

    try {
        const donation = new TimeBank({
            donor: donorId,
            recipient: recipientId || null,
            hours,
            description,
            type: 'donation'
        });

        await donation.save();

        res.status(201).json({ message: 'Time donated successfully', donation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while donating time' });
    }
});

// @route   POST /api/timebank/request
// @desc    Request time for a service
router.post('/request', authMiddleware, async (req, res) => {
    const { hours, description } = req.body;
    const requesterId = req.user.id;

    try {
        const request = new TimeBank({
            requester: requesterId,
            hours,
            description,
            type: 'request'
        });

        await request.save();

        res.status(201).json({ message: 'Time requested successfully', request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while requesting time' });
    }
});

// @route   GET /api/timebank/history
// @desc    Get time donation/request history for a user
router.get('/history', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await TimeBank.find({
            $or: [
                { donor: userId },
                { recipient: userId },
                { requester: userId }
            ]
        }).populate('donor recipient requester', 'name email');

        res.status(200).json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while retrieving history' });
    }
});

module.exports = router;
