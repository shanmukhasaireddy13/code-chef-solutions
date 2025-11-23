const router = require('express').Router();
const passport = require('passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// Local Auth
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Changed to POST for better practice, but GET is also fine for simple logout

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect dashboard.
        res.redirect('http://localhost:3000/dashboard');
    }
);

module.exports = router;
