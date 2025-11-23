const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined for offers that don't need a code (e.g. BOGO)
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    offerType: {
        type: String,
        enum: ['DISCOUNT', 'BOGO', 'FIRST_TIME', 'REFERRAL_UNLOCK'],
        required: true,
        default: 'DISCOUNT'
    },
    discountType: {
        type: String,
        enum: ['FLAT', 'PERCENTAGE'],
        default: 'PERCENTAGE'
    },
    discountValue: {
        type: Number,
        default: 0
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['Global', 'Coupon'],
        default: 'Coupon'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    validUntil: {
        type: Date
    },
    usageLimit: {
        type: Number,
        default: 1 // How many times a single user can use this
    },
    conditions: {
        minPurchaseAmount: { type: Number, default: 0 }, // In Credits
        minReferrals: { type: Number, default: 0 },
        requiredSolutionCount: { type: Number, default: 0 }
    },
    bogoRules: {
        buyCount: { type: Number, default: 0 },
        getFreeCount: { type: Number, default: 0 },
        maxFreePrice: { type: Number, default: 0 }, // Max price of the free item in Credits
        minTotalValue: { type: Number, default: 0 }
    },
    autoApply: {
        type: Boolean,
        default: false
    },
    requiresCode: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
