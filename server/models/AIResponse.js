const mongoose = require('mongoose');

const AiResponseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['cultural', 'emotional', 'timebank', 'general'],
      default: 'general',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiResponse', AiResponseSchema);
