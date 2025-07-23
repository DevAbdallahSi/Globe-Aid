const mongoose = require('mongoose');

const timeBankOfferSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    skill: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    hoursAvailable: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TimeBankOffer = mongoose.model('TimeBankOffer', timeBankOfferSchema);

module.exports = TimeBankOffer;
