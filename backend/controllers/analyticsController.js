const User = require('../models/User');
const Contest = require('../models/Contest');
const Solution = require('../models/Solution');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalContests = await Contest.countDocuments();
        const activeContests = await Contest.countDocuments({ status: 'Live' });
        const totalSolutions = await Solution.countDocuments();

        // Calculate total revenue from approved orders
        const revenueResult = await require('../models/Order').aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get recent users (last 5)
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username email createdAt credits');

        res.json({
            totalUsers,
            totalContests,
            activeContests,
            totalSolutions,
            totalRevenue,
            recentUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
