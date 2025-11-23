const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/user/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user transactions
// @route   GET /api/user/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    // In a real app, fetch from a Transaction model
    // For now, returning mock data from backend as requested
    const transactions = [
        { id: 1, type: 'credit', description: 'Added Credits', date: 'Nov 22, 2025', amount: '+100 Credits' },
        { id: 2, type: 'debit', description: 'Purchased Solution', date: 'Nov 21, 2025', amount: '-15 Credits' }
    ];
    res.json(transactions);
};
