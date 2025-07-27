const mongoose = require('mongoose');

const timeBankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['earned', 'spent'],
        required: true
    },
    service: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    with: {
        type: String, // You can change this to ObjectId if you want to link to another user
        required: true
    }
});

module.exports = mongoose.model('TimeBank', timeBankSchema);
