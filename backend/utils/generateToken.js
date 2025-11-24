const jwt = require('jsonwebtoken');

const generateToken = (req, res, userId, role) => {
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,                 // Cookie only secure on HTTPS
        sameSite: isProduction ? "None" : "Lax",  // Needed for cross-site on Vercel
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/"
    });
};

module.exports = generateToken;
