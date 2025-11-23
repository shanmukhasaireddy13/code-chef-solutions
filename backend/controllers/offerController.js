const Offer = require('../models/Offer');
const UserOfferUsage = require('../models/UserOfferUsage');
const User = require('../models/User');

// Create a new offer (Admin)
exports.createOffer = async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all offers (Admin sees all, User sees active/public)
exports.getOffers = async (req, res) => {
    try {
        const { role, _id: userId } = req.user;
        let query = {};

        if (role !== 'admin') {
            query = {
                isActive: true,
            };
        }

        const offers = await Offer.find(query).sort({ createdAt: -1 });

        // Attach usage info for the current user
        const offersWithUsage = await Promise.all(offers.map(async (offer) => {
            const usageCount = await UserOfferUsage.countDocuments({ userId, offerId: offer._id });
            return {
                ...offer.toObject(),
                usageCount,
                hasUsed: usageCount >= offer.usageLimit
            };
        }));

        res.json(offersWithUsage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle offer status (Admin)
exports.toggleOfferStatus = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });

        offer.isActive = !offer.isActive;
        await offer.save();
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete offer (Admin)
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });

        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate an offer/coupon for a user
exports.validateOffer = async (req, res) => {
    try {
        const { code, cartValue, cartItems, userId } = req.body; // cartItems should be array of { price, ... }

        let offer;
        if (code) {
            offer = await Offer.findOne({ code: code.toUpperCase(), isActive: true });
        } else {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        if (!offer) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        // 1. Check Validity Date
        if (offer.validUntil && new Date() > new Date(offer.validUntil)) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        // 2. Check Usage Limit for User
        const usageCount = await UserOfferUsage.countDocuments({ userId, offerId: offer._id });
        if (usageCount >= offer.usageLimit) {
            return res.status(400).json({ message: 'You have already used this coupon' });
        }

        // 3. Check Conditions
        // Min Purchase Amount
        if (offer.conditions && offer.conditions.minPurchaseAmount > 0 && cartValue < offer.conditions.minPurchaseAmount) {
            return res.status(400).json({ message: `Minimum purchase of ${offer.conditions.minPurchaseAmount} credits required` });
        }

        // First Time User
        if (offer.offerType === 'FIRST_TIME') {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Check if user has purchased any solutions before
            if (user.purchasedSolutions && user.purchasedSolutions.length > 0) {
                return res.status(400).json({ message: 'This offer is valid for first-time users only' });
            }
        }

        // Referral Unlock
        if (offer.offerType === 'REFERRAL_UNLOCK') {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const userReferrals = user.referralCount || 0;
            const requiredReferrals = offer.conditions?.minReferrals || 0;

            // User must have AT LEAST the required number of referrals
            if (userReferrals < requiredReferrals) {
                const remaining = requiredReferrals - userReferrals;
                return res.status(400).json({
                    message: `Locked! Refer ${remaining} more friend${remaining > 1 ? 's' : ''} to unlock this offer.`,
                    required: requiredReferrals,
                    current: userReferrals,
                    remaining: remaining
                });
            }
        }

        // 4. Calculate Discount / BOGO
        let discount = 0;
        let freeItems = [];

        if (offer.offerType === 'BOGO') {
            // Logic: Buy X Get Y
            const buyCount = offer.bogoRules?.buyCount || 0;
            const getFreeCount = offer.bogoRules?.getFreeCount || 0;
            const maxFreePrice = offer.bogoRules?.maxFreePrice || Infinity;

            if (cartItems && cartItems.length >= buyCount + getFreeCount) {
                // Sort items by price (cheapest first usually gets free)
                const sortedItems = [...cartItems].sort((a, b) => a.price - b.price);

                // Take the cheapest 'getFreeCount' items
                for (let i = 0; i < getFreeCount && i < sortedItems.length; i++) {
                    if (sortedItems[i].price <= maxFreePrice) {
                        discount += sortedItems[i].price;
                        freeItems.push(sortedItems[i]._id); // Assuming items have _id
                    }
                }
            } else {
                const totalNeeded = buyCount + getFreeCount;
                const currentCount = cartItems?.length || 0;
                const moreNeeded = totalNeeded - currentCount;
                return res.status(400).json({
                    message: `Add ${moreNeeded} more item${moreNeeded > 1 ? 's' : ''} to qualify for BOGO offer`,
                    required: totalNeeded,
                    current: currentCount
                });
            }
        } else {
            // Standard Discount (DISCOUNT, FIRST_TIME, REFERRAL_UNLOCK)
            if (offer.discountType === 'PERCENTAGE') {
                discount = (cartValue * (offer.discountPercent || 0)) / 100;
            } else {
                discount = offer.discountValue || 0;
            }
        }

        // Cap discount at cart value
        if (discount > cartValue) discount = cartValue;

        res.json({
            valid: true,
            offer: {
                _id: offer._id,
                code: offer.code,
                title: offer.title,
                description: offer.description,
                offerType: offer.offerType,
                discountType: offer.discountType
            },
            discountAmount: Math.round(discount * 100) / 100, // Round to 2 decimal places
            finalPrice: Math.round((cartValue - discount) * 100) / 100,
            freeItems: freeItems
        });

    } catch (error) {
        console.error("Validation Error:", error);
        res.status(500).json({ message: error.message });
    }
};
