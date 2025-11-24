const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ensureAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    // Debug logging
    console.log('🔐 Auth Check:', {
        hasCookie: !!token,
        cookieKeys: Object.keys(req.cookies),
        origin: req.headers.origin,
        method: req.method,
        path: req.path
    });

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('🔐 Token verification failed:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = ensureAuth;
