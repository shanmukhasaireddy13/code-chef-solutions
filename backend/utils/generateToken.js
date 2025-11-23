const jwt = require('jsonwebtoken');

const generateToken = (req, res, userId, role) => {
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });

    // Determine if we should use secure cookies
    // Use secure cookies if in production OR if the request is over HTTPS
    const isSecure = process.env.NODE_ENV === 'production' || 
                     (req && (req.secure || req.headers['x-forwarded-proto'] === 'https' || req.protocol === 'https'));
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isSecure, // Use secure cookies for HTTPS
        sameSite: 'lax', // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/', // Make cookie available for all paths
    });
};

module.exports = generateToken;
