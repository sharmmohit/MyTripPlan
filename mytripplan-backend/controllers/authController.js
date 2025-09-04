const User = require('../models/user');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');
const generateToken = require('../utils/generateToken');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    
    // Check if user exists for signup purpose
    if (purpose === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }
    }
    
    // Check if user exists for login/reset purpose
    if (purpose === 'login' || purpose === 'reset') {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found with this email'
        });
      }
      
      if (purpose === 'reset' && !user.password) {
        return res.status(400).json({
          success: false,
          message: 'This account uses OTP login. Please use the login option instead.'
        });
      }
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTP for this email and purpose
    await OTP.deleteMany({ email, purpose });
    
    // Save OTP to database
    const otpRecord = new OTP({
      email,
      otp,
      purpose
    });
    
    await otpRecord.save();
    
    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, purpose);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// Verify OTP for login
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      otp, 
      purpose: 'login' 
    });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

// Verify OTP for signup and proceed to details
exports.verifyOTPForSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      otp, 
      purpose: 'signup' 
    });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Please proceed with registration.'
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      isVerified: true
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering user'
    });
  }
};

// Login with password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging in'
    });
  }
};

// Verify OTP for password reset
exports.verifyOTPForReset = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      otp, 
      purpose: 'reset' 
    });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update password
    user.password = password;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password'
    });
  }
};