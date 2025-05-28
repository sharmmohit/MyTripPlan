// controllers/authController.js
const bcrypt = require('bcryptjs'); // For password hashing
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const authModel = require('../models/authModel'); // Database interactions for users
const otpStore = require('../otpStore'); // In-memory OTP storage
const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const nodemailer = require('nodemailer'); // For sending emails

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP host (e.g., 'smtp.mailgun.org')
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS  // Your email password (App Password for Gmail) from .env
    }
});
// -----------------------

/**
 * @description Generates and sends an OTP to the provided email address.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.sendOtp = async (req, res) => {
    const { email } = req.body; // Expect email instead of phoneNumber

    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    try {
        // Generate a 6-digit numeric OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        otpStore.set(email, { otp: otpCode, expiryTime }); // Store OTP against email

        // --- Send OTP via Email ---
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender email address
            to: email,                     // Recipient email address
            subject: 'MyTripPlan OTP Verification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0056b3;">MyTripPlan - OTP Verification</h2>
                    <p>Dear user,</p>
                    <p>Your One-Time Password (OTP) for MyTripPlan is:</p>
                    <h1 style="color: #4CAF50; font-size: 28px; letter-spacing: 3px;">${otpCode}</h1>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Do not share this OTP with anyone.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thank you,<br/>The MyTripPlan Team</p>
                </div>
            `,
        });
        console.log(`OTP for ${email} sent via email!`); // Still good for debugging
        // -------------------------

        res.status(200).json({ message: 'OTP sent successfully to your email!' });
    } catch (error) {
        console.error('Error sending OTP via email:', error);
        res.status(500).json({ message: 'Failed to send OTP via email.', error: error.message });
    }
};

/**
 * @description Verifies the OTP and either registers a new user or logs in an existing one.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.verifyOtpAndLogin = async (req, res) => {
    const { email, otp } = req.body; // Expect email instead of phoneNumber

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const storedOtpData = otpStore.get(email); // Retrieve OTP against email

    if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expiryTime) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // OTP is valid, proceed with login/registration logic
    otpStore.delete(email); // Consume OTP

    try {
        let user = await authModel.findUserByEmail(email); // Find user by email

        if (!user) {
            // User does not exist, proceed to register
            const userId = uuidv4();
            // For simplicity, generate a dummy password for email-only OTP signups.
            // In a real app, you might prompt them to set a password after this step.
            const passwordHash = await bcrypt.hash(uuidv4(), 10); // Dummy hash
            // Create user with email, no phone number
            user = await authModel.createUser({ userId, email, passwordHash, phoneNumber: null });
            console.log('New user registered via OTP (email):', user);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, firstName: user.first_name }, // Use user_id from DB
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'OTP verified and logged in successfully!',
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error('Error during OTP verification and login:', error);
        res.status(500).json({ message: 'Server error during login/registration.' });
    }
};

/**
 * @description Registers a new user with email and password.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body; // Expecting email, password for direct registration

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for registration.' });
    }

    try {
        let userExists = await authModel.findUserByEmail(email); // Find by email

        if (userExists) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user with email and password, phone_number is null
        const newUser = await authModel.createUser({
            userId,
            email,
            passwordHash,
            firstName: firstName || null,
            lastName: lastName || null,
            phoneNumber: null // Explicitly set to null
        });

        const token = jwt.sign(
            { userId: newUser.user_id, email: newUser.email, firstName: newUser.first_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                userId: newUser.user_id,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name
            }
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

/**
 * @description Authenticates user with email and password and returns a token.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // Expect email and password for direct login

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        let user = await authModel.findUserByEmail(email); // Find by email

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, firstName: user.first_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Logged in successfully!',
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
