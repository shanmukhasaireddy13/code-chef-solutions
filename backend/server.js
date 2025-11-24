require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Connect DB
connectDB();

// Seed admin
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@sol.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'Admin',
                email: 'admin@sol.com',
                password: hashedPassword,
                role: 'admin',
                credits: 999999
            });

            console.log('Admin user seeded successfully');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};
seedAdmin();

const app = express();

// Trust proxy - required for rate limiting behind proxies/load balancers
app.set('trust proxy', 1);

// Allow multiple origins for CORS (local development + production + Vercel previews)
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://code-chef-solutions.vercel.app'
];

console.log("Allowed Frontend Origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list OR is a Vercel preview deployment
        if (allowedOrigins.indexOf(origin) !== -1 || (origin && origin.includes('vercel.app'))) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Health route
app.get('/health', (req, res) => res.status(200).send('OK'));

// Main routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
