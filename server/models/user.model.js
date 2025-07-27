
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    hoursEarned: {
        type: Number,
        default: 0,
    },
    hoursSpent: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
