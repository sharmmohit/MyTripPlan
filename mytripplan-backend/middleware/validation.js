const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

const validateSignup = (req, res, next) => {
  const { firstName, email, password } = req.body;
  
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'First name is required'
    });
  }
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }
  
  next();
};

const validateOTPRequest = (req, res, next) => {
  const { email, purpose } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!purpose || !['signup', 'login', 'reset'].includes(purpose)) {
    return res.status(400).json({
      success: false,
      message: 'Valid purpose is required'
    });
  }
  
  next();
};

const validateOTPVerification = (req, res, next) => {
  const { email, otp, purpose } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!otp || !validateOTP(otp)) {
    return res.status(400).json({
      success: false,
      message: 'Valid 6-digit OTP is required'
    });
  }
  
  if (!purpose || !['signup', 'login', 'reset'].includes(purpose)) {
    return res.status(400).json({
      success: false,
      message: 'Valid purpose is required'
    });
  }
  
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateOTPRequest,
  validateOTPVerification
};