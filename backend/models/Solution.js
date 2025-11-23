const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: true
    },
    problemId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 15
    },
    content: {
        type: String, // Markdown or code content
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Solution', SolutionSchema);
