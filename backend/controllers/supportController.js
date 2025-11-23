const SupportTicket = require('../models/SupportTicket');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;

        const ticket = await SupportTicket.create({
            user: req.user.id,
            subject,
            message
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's tickets
// @route   GET /api/support
// @access  Private
exports.getUserTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/admin/support
// @access  Private (Admin)
exports.getAllTickets = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const tickets = await SupportTicket.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reply to ticket (Admin)
// @route   PUT /api/admin/support/:id
// @access  Private (Admin)
exports.replyToTicket = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const { adminResponse } = req.body;

        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { adminResponse, status: 'Resolved' },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
