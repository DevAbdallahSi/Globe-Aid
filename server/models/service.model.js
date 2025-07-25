const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  duration: { type: Number }, // e.g. 1.5 hours
  location: { type: String },
  rating: { type: Number, default: 0 },
  requests: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });


module.exports = mongoose.model('Service', serviceSchema);
