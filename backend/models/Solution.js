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

// Compound index for faster lookups by contest and problem
SolutionSchema.index({ contestId: 1, problemId: 1 });
// Index for filtering by difficulty
SolutionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Solution', SolutionSchema);
