const Contest = require('../models/Contest');
const Solution = require('../models/Solution');

// @desc    Create a new contest
// @route   POST /api/contests
// @access  Private (Admin)
exports.createContest = async (req, res) => {
    const { name, startTime, endTime, duration, status, type } = req.body;

    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const contest = await Contest.create({
            name,
            startTime,
            endTime,
            duration,
            status,
            type
        });

        res.status(201).json(contest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const cache = require('../utils/cache');

// @desc    Get all contests (Live & Upcoming)
// @route   GET /api/contests
// @access  Public
exports.getDashboardContests = async (req, res) => {
    try {
        const cacheKey = 'dashboard_contests';
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const liveContests = await Contest.find({ status: 'Live' }).lean();
        const upcomingContests = await Contest.find({ status: 'Upcoming' }).lean();

        const data = {
            live: liveContests,
            upcoming: upcomingContests
        };

        cache.set(cacheKey, data, 300); // Cache for 5 minutes
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get problems for a specific contest
// @route   GET /api/contests/:id/problems
// @access  Public
exports.getContestProblems = async (req, res) => {
    try {
        const cacheKey = `contest_problems_${req.params.id}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const problems = await Solution.find({ contestId: req.params.id }).select('-content').lean();

        cache.set(cacheKey, problems, 300); // Cache for 5 minutes
        res.json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
