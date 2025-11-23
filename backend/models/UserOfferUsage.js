const mongoose = require('mongoose');

const userOfferUsageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    orderId: {
        type: String, // Can be linked to a specific transaction/order
        required: false
    },
    usedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure a user can't use the same offer more than the limit (handled in logic, but index helps)
userOfferUsageSchema.index({ userId: 1, offerId: 1 });

module.exports = mongoose.model('UserOfferUsage', userOfferUsageSchema);
