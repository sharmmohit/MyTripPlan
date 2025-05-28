// src/components/LoginSignup.jsx
import React, { useState, useEffect } from 'react';

const LoginSignup = ({ onClose, onLoginSuccess }) => {
    // Top-level state to manage which main tab is active: 'login' or 'signup'
    const [activeTab, setActiveTab] = useState('login');

    // Shared States
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const backendUrl = 'http://localhost:5000'; // Your backend URL - Ensure this matches your backend!

    // Login Specific States
    const [loginStage, setLoginStage] = useState('initial'); // 'initial', 'otp', 'password'
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [otpCountdown, setOtpCountdown] = useState(0); // Countdown for OTP resend

    // Signup Specific States
    const [signupStage, setSignupStage] = useState('initial'); // 'initial', 'otp', 'details', 'password'
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // --- Effects and Resets ---

    // Effect to clear messages and reset specific states when tab or stage changes
    useEffect(() => {
        setError('');
        setSuccessMessage('');
        setOtpCountdown(0);

        // Reset stage-specific inputs when switching major tabs
        if (activeTab === 'login') {
            setSignupStage('initial'); // Ensure signup flow is reset if we switch back
            // Only reset login specific inputs if returning to initial login stage
            if (loginStage === 'initial') {
                setPassword('');
                setOtp('');
            }
        } else { // activeTab === 'signup'
            setLoginStage('initial'); // Ensure login flow is reset if we switch back
            // Only reset signup specific inputs if returning to initial signup stage
            if (signupStage === 'initial') {
                setFirstName('');
                setLastName('');
                setPassword('');
                setConfirmPassword('');
                setOtp('');
            }
        }
    }, [activeTab, loginStage, signupStage]);

    // OTP resend countdown timer
    useEffect(() => {
        let timer;
        if (otpCountdown > 0) {
            timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpCountdown]);

    // Function to handle switching tabs and reset relevant states
    const handleTabSwitch = (tabName) => {
        setActiveTab(tabName);
        setEmail(''); // Always reset email when switching tabs
        setError('');
        setSuccessMessage('');
        setIsLoading(false);
        setOtpCountdown(0);
        setOtp('');

        if (tabName === 'login') {
            setLoginStage('initial');
            setSignupStage('initial'); // Ensure signup is completely reset
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
        } else { // tabName === 'signup'
            setSignupStage('initial');
            setLoginStage('initial'); // Ensure login is completely reset
            setPassword('');
        }
    };

    // --- Handlers ---

    // Handler for sending OTP (used by both login and signup flows)
    const handleSendOtp = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email) {
            setError('Please enter your email address.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setSuccessMessage(data.message);
                setOtpCountdown(60); // Start 60-second countdown
                // Determine next stage based on which flow is active
                if (activeTab === 'login') {
                    setLoginStage('otp');
                } else if (activeTab === 'signup') {
                    setSignupStage('otp');
                }
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setIsLoading(false);
            setError('Network error. Please try again.');
            console.error('Error sending OTP:', err);
        }
    };

    // Handler for verifying OTP and logging in/moving to signup details
    const handleVerifyOtpAndProcess = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/auth/verify-otp-and-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setSuccessMessage(data.message);
                if (activeTab === 'login') { // If currently in login flow
                    onLoginSuccess(data.user, data.token);
                    onClose(); // Close modal on successful login
                } else if (activeTab === 'signup') { // If currently in signup flow
                    setSignupStage('details'); // Move to name input for signup
                    setOtp(''); // Clear OTP field for next step
                }
            } else {
                setError(data.message || 'OTP verification failed.');
            }
        } catch (err) {
            setIsLoading(false);
            setError('Network error. Please try again.');
            console.error('Error verifying OTP:', err);
        }
    };

    // Handler for password-based login
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Email and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setSuccessMessage(data.message);
                onLoginSuccess(data.user, data.token);
                onClose(); // Close modal on success
            } else {
                setError(data.message || 'Login failed. Invalid credentials.');
            }
        } catch (err) {
            setIsLoading(false);
            setError('Network error. Please try again.');
            console.error('Error during password login:', err);
        }
    };

    // Handler for submitting first name and last name during signup
    const handleSignupDetailsSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!firstName) {
            setError('First Name is required.');
            return;
        }
        setSignupStage('password'); // Move to password creation
        setSuccessMessage(''); // Clear previous messages
    };

    // Handler for creating password and final signup
    const handleSignupPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!password || !confirmPassword) {
            setError('Please enter and confirm your password.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) { // Minimum password length
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            // This endpoint registers the user with all details and logs them in
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setSuccessMessage(data.message + ' Redirecting...');
                onLoginSuccess(data.user, data.token); // Log in the user after successful registration
                onClose(); // Close modal
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setIsLoading(false);
            setError('Network error. Please try again.');
            console.error('Error during registration:', err);
        }
    };


    // --- Conditional Rendering for Different Stages ---

    const renderLoginContent = () => {
        switch (loginStage) {
            case 'initial':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to MyTripPlan</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="your@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mb-4 transform hover:scale-105"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? 'Sending OTP...' : 'CONTINUE WITH EMAIL OTP'}
                        </button>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="px-3 text-gray-500 text-sm">OR</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <button
                            type="button"
                            onClick={() => { setLoginStage('password'); setError(''); setSuccessMessage(''); }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading}
                        >
                            LOGIN WITH PASSWORD
                        </button>
                    </>
                );

            case 'otp':
                return (
                    <form onSubmit={handleVerifyOtpAndProcess} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Verify OTP for Login</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group">
                            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                                Enter OTP sent to <span className="font-semibold">{email}</span>
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                maxLength="6"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? 'Verifying...' : 'LOGIN'}
                        </button>
                        <div className="text-center mt-3">
                            {otpCountdown > 0 ? (
                                <p className="text-sm text-gray-500">Resend OTP in {otpCountdown}s</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-blue-500 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setLoginStage('initial'); setError(''); setSuccessMessage(''); }}
                                className="text-gray-600 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );

            case 'password':
                return (
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login with Password</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="your@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || !email || !password}
                        >
                            {isLoading ? 'Logging In...' : 'LOGIN'}
                        </button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setLoginStage('initial'); setError(''); setSuccessMessage(''); }}
                                className="text-gray-600 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    const renderSignupContent = () => {
        switch (signupStage) {
            case 'initial':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="your@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? 'Sending OTP...' : 'CREATE ACCOUNT WITH EMAIL OTP'}
                        </button>
                    </>
                );

            case 'otp':
                return (
                    <form onSubmit={handleVerifyOtpAndProcess} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Verify OTP for Signup</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group">
                            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                                Enter OTP sent to <span className="font-semibold">{email}</span>
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                maxLength="6"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? 'Verifying...' : 'VERIFY OTP'}
                        </button>
                        <div className="text-center mt-3">
                            {otpCountdown > 0 ? (
                                <p className="text-sm text-gray-500">Resend OTP in {otpCountdown}s</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-blue-500 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setSignupStage('initial'); setError(''); setSuccessMessage(''); }}
                                className="text-gray-600 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );

            case 'details':
                return (
                    <form onSubmit={handleSignupDetailsSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Details</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name (Optional)</label>
                            <input
                                type="text"
                                id="lastName"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || !firstName}
                        >
                            {isLoading ? 'Processing...' : 'CONTINUE'}
                        </button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setSignupStage('initial'); setEmail(''); setError(''); setSuccessMessage(''); }}
                                className="text-gray-600 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );

            case 'password':
                return (
                    <form onSubmit={handleSignupPasswordSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Password</h2>
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm mb-4">{successMessage}</p>}
                        <div className="form-group">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Create Password</label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                        >
                            {isLoading ? 'Creating Account...' : 'SUBMIT'}
                        </button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setSignupStage('details'); setError(''); setSuccessMessage(''); }}
                                className="text-gray-600 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );

            default:
                return null;
        }
    };


    // --- Main Component Render ---
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative animate-fade-in-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                    &times;
                </button>

                {/* Header Tabs (Login / Signup) */}
                <div className="flex justify-center mb-6 border-b border-gray-200">
                    <button
                        onClick={() => handleTabSwitch('login')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200
                            ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => handleTabSwitch('signup')}
                        className={`ml-4 px-6 py-3 font-semibold transition-colors duration-200
                            ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        SIGNUP
                    </button>
                </div>

                {/* Conditional Rendering based on activeTab */}
                {activeTab === 'login' ? renderLoginContent() : renderSignupContent()}

                {/* Footer text (common for both) */}
                <p className="text-xs text-gray-500 text-center mt-6">
                    By continuing, you agree to MyTripPlan's{' '}
                    <a href="#" className="text-blue-500 hover:underline">Terms of Use</a> and{' '}
                    <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default LoginSignup;