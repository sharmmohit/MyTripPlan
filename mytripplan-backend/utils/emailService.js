const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"MyTripPlan" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendOTPEmail = async (email, otp, purpose) => {
  let subject, html;
  
  switch(purpose) {
    case 'signup':
      subject = 'Verify Your Email - MyTripPlan';
      html = `
        <h2>Welcome to MyTripPlan!</h2>
        <p>Your OTP for account verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
      break;
    case 'login':
      subject = 'Your Login OTP - MyTripPlan';
      html = `
        <h2>Login to MyTripPlan</h2>
        <p>Your OTP for login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
      break;
    case 'reset':
      subject = 'Password Reset OTP - MyTripPlan';
      html = `
        <h2>Reset Your Password</h2>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
      break;
    default:
      return false;
  }
  
  return await sendEmail(email, subject, html);
};

module.exports = { sendEmail, sendOTPEmail };