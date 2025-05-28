// server.js

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware
const jwt = require('jsonwebtoken'); // Re-added for the 'protect' middleware here
const pool = require('./config/db');
// Import authentication controller
const authController = require('./controllers/authController');
const flightController = require('./controllers/flightController');
const bookingController = require('./controllers/bookingController');

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Database connection pool setup


// Test database connection

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

/**
 * @route POST /api/auth/send-otp
 * @description Generates and sends an OTP to the provided email address.
 * @access Public
 */
app.post('/api/auth/send-otp', authController.sendOtp);

/**
 * @route POST /api/auth/verify-otp-and-login
 * @description Verifies the OTP and either registers a new user or logs in an existing one.
 * @access Public
 */
app.post('/api/auth/verify-otp-and-login', authController.verifyOtpAndLogin);

/**
 * @route POST /api/auth/register
 * @description Registers a new user with email and password.
 * @access Public
 */
app.post('/api/auth/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @description Authenticates user with email and password and returns a token.
 * @access Public
 */
app.post('/api/auth/login', authController.loginUser);

// --- Middleware to protect routes (can be used for future protected routes) ---
// Note: This 'protect' middleware is defined here but not directly used on auth routes
// as they are public. You would apply it to other API routes later.
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

// Example of a protected route (uncomment when you have one)
// app.get('/api/user/profile', protect, async (req, res) => {
//   try {
//     const [user] = await pool.execute('SELECT user_id, email, first_name, last_name FROM users WHERE user_id = ?', [req.userId]);
//     if (!user || user.length === 0) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     res.status(200).json({ message: 'User profile data', user: user[0] });
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
//   }
// });
app.get('/api/flights/search', (req, res) => flightController.searchFlights(req, res, pool));
app.post('/api/bookings', protect, (req, res) => bookingController.bookFlight(req, res, pool));
// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`MyTripPlan Backend server running on port ${PORT}`);
  console.log(`Access it at http://localhost:${PORT}`);
});
