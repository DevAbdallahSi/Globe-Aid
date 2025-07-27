const TimeBank = require('../models/TimeBank');

const getTimeHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await TimeBank.find({ user: userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching time history:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getTimeHistory };
