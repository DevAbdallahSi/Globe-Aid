// routes/feedback.route.js
const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback } = require('../controllers/feedback.Controller');

router.post('/', createFeedback);     // Add feedback
router.get('/', getAllFeedback);      // Get all feedback

module.exports = router;
