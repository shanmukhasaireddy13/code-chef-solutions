const User = require('../models/User');

// @desc    Get referral statistics
// @route   GET /api/referral/stats
// @access  Private
exports.getReferralStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const creditsEarnedFromReferrals = user.referralCount * 15;

        res.json({
            referralCode: user.referralCode,
            referralCount: user.referralCount || 0,
            creditsEarned: creditsEarnedFromReferrals,
            referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?ref=${user.referralCode}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
