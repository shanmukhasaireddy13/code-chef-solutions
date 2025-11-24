const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String,
    },
    credits: {
        type: Number,
        default: 5
    },
    purchasedSolutions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solution'
    }],
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: String
    },
    referralCount: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const bcrypt = require('bcryptjs');

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
