const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    utr: {
        type: String,
        required: true
    },
    utrHash: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Index for fetching user orders
OrderSchema.index({ user: 1 });
// Index for filtering by status (e.g., admin dashboard)
OrderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', OrderSchema);