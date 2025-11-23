const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String, // Store as string for display flexibility or Date
        required: true
    },
    endTime: {
        type: String
    },
    duration: {
        type: String
    },
    participants: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Live', 'Upcoming'],
        required: true
    },
    type: {
        type: String, // e.g., "Rated", "Unrated"
        default: "Rated"
    }
}, { timestamps: true });

module.exports = mongoose.model('Contest', ContestSchema);
