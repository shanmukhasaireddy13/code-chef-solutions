const User = require('../models/User');
const Solution = require('../models/Solution');

// @desc    Create a new solution
// @route   POST /api/solutions
// @access  Private (Admin)
exports.createSolution = async (req, res) => {
    const { contestId, problemId, name, difficulty, price, content } = req.body;

    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const solution = await Solution.create({
            contestId,
            problemId,
            name,
            difficulty,
            price,
            content
        });

        res.status(201).json(solution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Buy a solution
// @route   POST /api/solutions/buy/:problemId
// @access  Private
exports.buySolution = async (req, res) => {
    try {
        // Find solution by problemId instead of _id
        const solution = await Solution.findOne({ problemId: req.params.id });

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        const user = await User.findById(req.user.id);

        // Check if already purchased
        if (user.purchasedSolutions.includes(solution._id)) {
            return res.status(400).json({ message: 'Solution already purchased' });
        }

        // Check credits
        if (user.credits < solution.price) {
            return res.status(400).json({ message: 'Insufficient credits' });
        }

        // Deduct credits and add solution
        user.credits -= solution.price;
        user.purchasedSolutions.push(solution._id);
        await user.save();

        res.json({
            message: 'Solution purchased successfully',
            credits: user.credits,
            solution
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get purchased solutions
// @route   GET /api/solutions/my-solutions
// @access  Private
exports.getMySolutions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('purchasedSolutions');
        res.json(user.purchasedSolutions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get solution details (public info)
// @route   GET /api/solutions/:id
// @access  Public
exports.getSolutionPublic = async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id).select('-content');
        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }
        res.json(solution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get full solution (with content) for purchased solutions
// @route   GET /api/solutions/:id/full
// @access  Private
// Get full solution (with content) for purchased solutions
// Route: GET /api/solutions/:id/full
// Access: Private
exports.getSolutionFull = async (req, res) => {
    try {
        console.log('getSolutionFull called with ID:', req.params.id);
        console.log('User ID:', req.user.id);

        // Find by MongoDB _id
        const solution = await Solution.findById(req.params.id).lean();

        if (!solution) {
            console.log('Solution not found');
            return res.status(404).json({ message: 'Solution not found' });
        }

        const user = await User.findById(req.user.id).lean();
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log('User purchased solutions:', user.purchasedSolutions);
        console.log('Solution ID:', solution._id);

        // Verify purchase
        const hasPurchased = user.purchasedSolutions.some(id => id.toString() === solution._id.toString());
        if (!hasPurchased) {
            console.log('Purchase verification failed');
            return res.status(403).json({ message: 'You have not purchased this solution' });
        }

        // Return full solution (including content)
        res.json(solution);
    } catch (error) {
        console.error('getSolutionFull Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Buy multiple solutions (Cart) with Offer support
// @route   POST /api/solutions/buy-cart
// @access  Private
exports.buyCart = async (req, res) => {
    const { items, couponCode } = req.body; // items: [{ problemId, price }]
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        let totalAmount = 0;
        const solutionIds = [];
        const solutionsToBuy = [];

        // 1. Validate Items & Calculate Base Total
        for (const item of items) {
            const solution = await Solution.findOne({ problemId: item.problemId });
            if (!solution) return res.status(404).json({ message: `Solution ${item.problemId} not found` });

            if (user.purchasedSolutions.includes(solution._id)) {
                // Skip or error? Let's skip already purchased ones to be safe, or error.
                // For a cart, maybe just filter them out?
                // Let's error for now to be explicit.
                return res.status(400).json({ message: `Solution ${solution.name} already purchased` });
            }

            totalAmount += solution.price;
            solutionIds.push(solution._id);
            solutionsToBuy.push(solution);
        }

        // 2. Apply Offer / Coupon
        let discount = 0;
        let appliedOffer = null;
        const Offer = require('../models/Offer');
        const UserOfferUsage = require('../models/UserOfferUsage');

        // Check for Auto-Apply Offers first (if no code provided)
        if (!couponCode) {
            // Find active auto-apply offers
            const autoOffers = await Offer.find({ isActive: true, autoApply: true });
            for (const offer of autoOffers) {
                // Check usage limit
                const usage = await UserOfferUsage.countDocuments({ userId, offerId: offer._id });
                if (usage >= offer.usageLimit) continue; // Skip if limit reached

                // Check conditions
                // ... (Simplified logic for brevity, ideally reuse validateOffer logic)
                // For BOGO:
                if (offer.offerType === 'BOGO') {
                    if (items.length >= offer.bogoRules.buyCount + offer.bogoRules.getFreeCount) {
                        // Calculate discount
                        const sorted = [...solutionsToBuy].sort((a, b) => a.price - b.price);
                        for (let i = 0; i < offer.bogoRules.getFreeCount; i++) {
                            if (sorted[i].price <= offer.bogoRules.maxFreePrice) {
                                discount += sorted[i].price;
                            }
                        }
                        appliedOffer = offer;
                        break; // Apply first valid auto-offer
                    }
                }
                // For First Time:
                if (offer.offerType === 'FIRST_TIME' && user.purchasedSolutions.length === 0) {
                    if (offer.discountType === 'PERCENTAGE') discount += (totalAmount * offer.discountPercent) / 100;
                    else discount += offer.discountValue;
                    appliedOffer = offer;
                    break;
                }
            }
        } else {
            // Validate provided coupon
            const offer = await Offer.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (!offer) return res.status(400).json({ message: 'Invalid coupon code' });

            // Check usage limit
            const usage = await UserOfferUsage.countDocuments({ userId, offerId: offer._id });
            if (usage >= offer.usageLimit) return res.status(400).json({ message: 'Coupon usage limit exceeded' });

            // Validate conditions (Min purchase, etc.)
            if (offer.conditions.minPurchaseAmount > totalAmount) return res.status(400).json({ message: `Min spend of ${offer.conditions.minPurchaseAmount} required` });

            // Apply Discount
            if (offer.offerType === 'BOGO') {
                if (items.length >= offer.bogoRules.buyCount + offer.bogoRules.getFreeCount) {
                    const sorted = [...solutionsToBuy].sort((a, b) => a.price - b.price);
                    for (let i = 0; i < offer.bogoRules.getFreeCount; i++) {
                        if (sorted[i].price <= offer.bogoRules.maxFreePrice) {
                            discount += sorted[i].price;
                        }
                    }
                } else {
                    return res.status(400).json({ message: 'BOGO requirements not met' });
                }
            } else {
                if (offer.discountType === 'PERCENTAGE') discount = (totalAmount * offer.discountPercent) / 100;
                else discount = offer.discountValue;
            }
            appliedOffer = offer;
        }

        // Cap discount
        if (discount > totalAmount) discount = totalAmount;
        const finalAmount = totalAmount - discount;

        // 3. Check Credits
        if (user.credits < finalAmount) {
            return res.status(400).json({ message: 'Insufficient credits' });
        }

        // 4. Process Transaction
        user.credits -= finalAmount;
        user.purchasedSolutions.push(...solutionIds);
        await user.save();

        // 5. Record Offer Usage
        if (appliedOffer) {
            await UserOfferUsage.create({
                userId,
                offerId: appliedOffer._id,
                usedAt: new Date()
            });
        }

        res.json({
            message: 'Purchase successful',
            credits: user.credits,
            purchasedCount: solutionIds.length,
            discountApplied: discount
        });

    } catch (error) {
        console.error("Buy Cart Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
