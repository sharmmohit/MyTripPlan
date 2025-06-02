// server.js

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.config();

// Import database connection pool
const pool = require('./config/db'); // Correctly import the pool from config/db.js

// Import controllers and routes
const authController = require('./controllers/authController');
const flightController = require('./controllers/flightController');
const bookingController = require('./controllers/bookingController');
const trainRoutes = require('./routes/TrainRoutes'); // NEW: Import train routes

// Create an Express application instance
const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Enable CORS for all routes (for development)
app.use(cors());

// Define a simple root route to confirm the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'MyTripPlan Backend is running!' });
});

// Example API endpoint: Fetching a test message from the database
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT VERSION() as mysql_version');
        res.status(200).json({
            message: 'Successfully fetched data from database!',
            mysqlVersion: rows[0].mysql_version
        });
    } catch (error) {
        console.error('Error fetching from database:', error);
        res.status(500).json({ message: 'Failed to fetch data from database', error: error.message });
    }
});

// --- Authentication Routes (using authController) ---
app.post('/api/auth/send-otp', authController.sendOtp);
app.post('/api/auth/verify-otp-and-login', authController.verifyOtpAndLogin);
app.post('/api/auth/register', authController.registerUser);
app.post('/api/auth/login', authController.loginUser);

// --- Middleware to protect routes ---
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Ensure JWT_SECRET is available in .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId; // Ensure this matches what you put in the JWT payload
            req.email = decoded.email; // Attach email from token
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

// --- Flight Routes ---
app.get('/api/flights/search', (req, res) => flightController.searchFlights(req, res, pool));
app.post('/api/bookings', protect, (req, res) => bookingController.bookFlight(req, res, pool));

// --- NEW: Train Routes ---
// All requests to /api/trains will be handled by trainRoutes
app.use('/api/trains', trainRoutes);

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`MyTripPlan Backend server running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});
