const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateReferralCode = require('../utils/generateReferralCode');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /auth/signup
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password, referralCode } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate unique referral code for new user
        let newReferralCode = generateReferralCode();
        let codeExists = await User.findOne({ referralCode: newReferralCode });

        // Ensure uniqueness
        while (codeExists) {
            newReferralCode = generateReferralCode();
            codeExists = await User.findOne({ referralCode: newReferralCode });
        }

        // Check if referred by someone
        let referrer = null;
        let initialCredits = 5;

        if (referralCode) {
            referrer = await User.findOne({ referralCode });
            if (referrer) {
                initialCredits = 20; // 5 initial + 15 referral bonus
            }
        }

        user = await User.create({
            name,
            email,
            password,
            referralCode: newReferralCode,
            referredBy: referrer ? referrer.referralCode : null,
            credits: initialCredits
        });

        // Credit the referrer
        if (referrer) {
            referrer.credits += 15;
            referrer.referralCount += 1;
            await referrer.save();
        }

        // Generate JWT and set cookie
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '2min',
        });

        generateToken(req, res, user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            referralCode: user.referralCode,
            role: user.role,
            token: token // Also return token in response for frontend to set cookie
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
                expiresIn: '30d',
            });

            generateToken(req, res, user._id, user.role);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                credits: user.credits,
                role: user.role,
                token: token // Also return token in response for frontend to set cookie
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Logout user
// @route   GET /auth/logout
// @access  Private
exports.logoutUser = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('jwt', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        expires: new Date(0),
        path: "/"
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
