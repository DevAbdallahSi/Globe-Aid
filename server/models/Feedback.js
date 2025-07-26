const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
