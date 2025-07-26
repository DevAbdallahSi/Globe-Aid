// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// POST /api/feedback
const createFeedback = async (req, res) => {
    try {
        const { author, role, avatar, text } = req.body;

        if (!author || !text) {
            return res.status(400).json({ error: 'Author and text are required' });
        }

        const newFeedback = new Feedback({ author, role, avatar, text });
        await newFeedback.save();

        res.status(201).json(newFeedback);
    } catch (err) {
        console.error('Error creating feedback:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error('Error fetching feedback:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
};
