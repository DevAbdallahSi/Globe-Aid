const mongoose = require('mongoose');

const User = require('./user.model'); // Adjust the path as necessary

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  duration: { type: Number },
  location: { type: String },
  rating: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String
    // Will be set automatically in the pre-save hook
  },
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
}, { timestamps: true });

serviceSchema.pre('save', async function (next) {
  if (!this.username && this.user) {
    try {
      const user = await User.findById(this.user).select('name');
      if (user) {
        this.username = user.name;
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});


module.exports = mongoose.model('Service', serviceSchema);
