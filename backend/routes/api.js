const router = require('express').Router();
const ensureAuth = require('../middleware/auth');

// Controllers
const { getCurrentUser, updateProfile, getTransactions, } = require('../controllers/userController');
const { createOrder, getOrders, verifyOrder, generateQRCode } = require('../controllers/paymentController');
const { buySolution, buyCart, getMySolutions, getSolutionPublic, getSolutionFull, createSolution } = require('../controllers/solutionController');
const { getReferralStats } = require('../controllers/referralController');
const { getDashboardContests, getContestProblems, createContest } = require('../controllers/contestController');
const { getDashboardStats } = require('../controllers/analyticsController');
const { createTicket, getUserTickets, getAllTickets, replyToTicket } = require('../controllers/supportController');
const { createOffer, getOffers, toggleOfferStatus, validateOffer, deleteOffer } = require('../controllers/offerController');

// User Routes
router.get('/user/me', ensureAuth, getCurrentUser);
router.put('/user/profile', ensureAuth, updateProfile);
router.put('/user/password', ensureAuth, require('../controllers/userController').updatePassword);
router.get('/user/transactions', ensureAuth, getTransactions);
router.put('/user/tour-status', ensureAuth, require('../controllers/userController').updateTourStatus);


// Payment Routes
router.post('/payment/create-order', ensureAuth, createOrder);
router.get('/payment/qr-code', ensureAuth, generateQRCode);

// Admin Routes (Orders)
router.get('/admin/orders', ensureAuth, getOrders);
router.post('/admin/verify-order', ensureAuth, verifyOrder);

// Solution Routes
router.get('/solutions/my-solutions', ensureAuth, getMySolutions);
router.post('/solutions', ensureAuth, createSolution);
router.get('/solutions/:id', getSolutionPublic);
router.get('/solutions/:id/full', ensureAuth, getSolutionFull);
router.post('/solutions/buy/:id', ensureAuth, buySolution);
router.post('/solutions/buy-cart', ensureAuth, buyCart);

// Referral Routes
router.get('/referral/stats', ensureAuth, getReferralStats);

// Contest Routes
router.get('/contests', getDashboardContests);
router.post('/contests', ensureAuth, createContest);
router.get('/contests/:id/problems', getContestProblems);

// Analytics Routes
router.get('/admin/analytics', ensureAuth, getDashboardStats);

// Support Routes
router.post('/support', ensureAuth, createTicket);
router.get('/support', ensureAuth, getUserTickets);
router.get('/admin/support', ensureAuth, getAllTickets);
router.put('/admin/support/:id', ensureAuth, replyToTicket);

// Offer Routes (Admin)
router.post('/admin/offers', ensureAuth, createOffer);
router.get('/admin/offers', ensureAuth, getOffers); // Admin sees all
router.put('/admin/offers/:id/toggle', ensureAuth, toggleOfferStatus);
router.delete('/admin/offers/:id', ensureAuth, deleteOffer);

// Offer Routes (Public/User)
router.get('/offers/active', ensureAuth, getOffers); // User sees active (handled by controller logic)
router.post('/offers/validate', ensureAuth, validateOffer);

module.exports = router;