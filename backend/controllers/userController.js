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

// @desc    Update password
// @route   PUT /api/user/password
// @access  Private
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user transactions
// @route   GET /api/user/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const Order = require('../models/Order');

        // Fetch approved orders (Credits Added)
        const orders = await Order.find({
            user: req.user.id,
            status: 'approved'
        }).sort({ createdAt: -1 });

        const transactions = orders.map(order => ({
            id: order._id,
            type: 'credit',
            description: 'Added Credits',
            date: new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            amount: `+${order.credits || order.amount} Credits`
        }));

        res.json(transactions);
    } catch (error) {
        console.error('Get Transactions Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update tour status
// @route   PUT /api/user/tour-status
// @access  Private
exports.updateTourStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { isCompleted } = req.body;

        // If isCompleted is provided, use it. Otherwise default to true (for completion)
        if (isCompleted !== undefined) {
            user.hasSeenTour = isCompleted;
        } else {
            user.hasSeenTour = true;
        }

        await user.save();

        res.json({ message: 'Tour status updated' });
    } catch (error) {
        console.error('Update Tour Status Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
