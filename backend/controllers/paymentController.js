const User = require('../models/User');
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const UserOfferUsage = require('../models/UserOfferUsage');
const { encrypt, decrypt } = require('../utils/encryption');
const crypto = require('crypto');

// @desc    Create a new payment order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { amount, utr, couponCode } = req.body;
        const userId = req.user.id;

        console.log('Create Order Request:', { amount, utr: '***', couponCode, userId });

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (!utr) {
            return res.status(400).json({ message: 'UTR is required' });
        }

        // Hash UTR for uniqueness check
        const utrHash = crypto.createHash('sha256').update(utr).digest('hex');

        // Check if UTR already exists (using hash)
        const existingOrder = await Order.findOne({ utrHash });
        if (existingOrder) {
            return res.status(400).json({ message: 'UTR number already used' });
        }

        // Also check legacy plain text UTRs (optional, but good for transition)
        const legacyOrder = await Order.findOne({ utr });
        if (legacyOrder) {
            return res.status(400).json({ message: 'UTR number already used' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let finalAmount = Number(amount);
        let appliedCoupon = null;

        // If coupon code provided, validate and apply
        if (couponCode && couponCode.trim()) {
            console.log('Validating coupon:', couponCode);
            const offer = await Offer.findOne({ code: couponCode.toUpperCase(), isActive: true });

            if (!offer) {
                return res.status(400).json({ message: 'Invalid or inactive coupon code' });
            }

            // Check if user has already used this coupon
            const usageCount = await UserOfferUsage.countDocuments({ userId, offerId: offer._id });
            if (usageCount >= offer.usageLimit) {
                return res.status(400).json({ message: 'You have already used this coupon' });
            }

            // Check validity date
            if (offer.validUntil && new Date() > new Date(offer.validUntil)) {
                return res.status(400).json({ message: 'Coupon has expired' });
            }

            // Only DISCOUNT, FIRST_TIME, and REFERRAL_UNLOCK offers work for credit purchases
            if (offer.offerType === 'DISCOUNT' || offer.offerType === 'FIRST_TIME' || offer.offerType === 'REFERRAL_UNLOCK') {
                // Check FIRST_TIME condition
                if (offer.offerType === 'FIRST_TIME' && user.purchasedSolutions && user.purchasedSolutions.length > 0) {
                    return res.status(400).json({ message: 'This offer is valid for first-time users only' });
                }

                // Check REFERRAL_UNLOCK condition
                if (offer.offerType === 'REFERRAL_UNLOCK') {
                    const userReferrals = user.referralCount || 0;
                    const requiredReferrals = offer.conditions?.minReferrals || 0;

                    if (userReferrals < requiredReferrals) {
                        const remaining = requiredReferrals - userReferrals;
                        return res.status(400).json({
                            message: `Locked! Refer ${remaining} more friend${remaining > 1 ? 's' : ''} to unlock this offer.`
                        });
                    }
                }

                // Check minimum purchase amount
                if (offer.conditions && offer.conditions.minPurchaseAmount > 0 && finalAmount < offer.conditions.minPurchaseAmount) {
                    return res.status(400).json({
                        message: `Minimum purchase of ${offer.conditions.minPurchaseAmount} credits required`
                    });
                }

                // Calculate discount
                let discountAmount = 0;
                if (offer.discountType === 'PERCENTAGE') {
                    discountAmount = (finalAmount * (offer.discountPercent || 0)) / 100;
                } else {
                    discountAmount = offer.discountValue || 0;
                }

                // Cap discount at cart value
                if (discountAmount > finalAmount) discountAmount = finalAmount;

                finalAmount = Math.round((finalAmount - discountAmount) * 100) / 100;
                appliedCoupon = offer.code;

                console.log('Coupon applied:', { originalAmount: amount, discountAmount, finalAmount });

                // Record coupon usage
                await UserOfferUsage.create({
                    userId,
                    offerId: offer._id,
                    usedAt: new Date()
                });
            } else {
                return res.status(400).json({
                    message: 'This coupon type is not valid for credit purchases'
                });
            }
        }

        // Encrypt UTR
        const encryptedUtr = encrypt(utr);

        // Create order
        const order = await Order.create({
            user: userId,
            amount: finalAmount, // The amount the user actually pays
            credits: Number(amount), // The original amount (credits) to be added
            utr: encryptedUtr,
            utrHash,
            status: 'pending'
        });

        console.log('Order created successfully:', order._id);

        res.status(201).json({
            message: appliedCoupon
                ? `Order created successfully with coupon ${appliedCoupon}`
                : 'Order created successfully',
            order: {
                _id: order._id,
                amount: order.amount,
                credits: order.credits,
                status: order.status,
                appliedCoupon: appliedCoupon
            }
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Decrypt UTRs for display
        const decryptedOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.utr = decrypt(order.utr);
            return orderObj;
        });

        res.json(decryptedOrders);
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify order with UTR
// @route   POST /api/admin/verify-order
// @access  Private (Admin)
exports.verifyOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { orderId, adminUtr } = req.body;

        if (!orderId || !adminUtr) {
            return res.status(400).json({ message: 'Order ID and Admin UTR are required' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is already processed' });
        }

        // Decrypt stored UTR to compare
        const decryptedUtr = decrypt(order.utr);

        // Verify UTR matches
        if (decryptedUtr === adminUtr) {
            order.status = 'approved';
            await order.save();

            // Add credits to user
            const user = await User.findById(order.user);
            if (user) {
                // Use order.credits if available (for new orders), fallback to order.amount for old orders
                const creditsToAdd = order.credits !== undefined ? order.credits : order.amount;
                user.credits += creditsToAdd;
                await user.save();
                console.log(`Credits updated for user ${user._id}. Added: ${creditsToAdd}, New Balance: ${user.credits}`);
            }

            res.json({
                message: 'Order approved and credits added',
                status: 'approved',
                newBalance: user ? user.credits : 0
            });
        } else {
            res.status(400).json({ message: 'UTR does not match', status: 'pending' });
        }
    } catch (error) {
        console.error('Verify Order Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate QR Code for payment
// @route   GET /api/payment/qr-code
// @access  Private
exports.generateQRCode = async (req, res) => {
    try {
        const { amount } = req.query;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Generate a unique transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Mock QR Code URL (using a public API for demo purposes)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${transactionId}-${amount}`;

        res.json({
            transactionId,
            qrCodeUrl,
            amount
        });
    } catch (error) {
        console.error('Generate QR Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};