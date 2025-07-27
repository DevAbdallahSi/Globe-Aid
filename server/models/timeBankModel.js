const mongoose = require('mongoose');

const timeBankSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['earned', 'spent'], required: true },
    service: { type: String, required: true },
    with: { type: String }, // Or maybe a ref to User
    hours: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimeBank', timeBankSchema);
