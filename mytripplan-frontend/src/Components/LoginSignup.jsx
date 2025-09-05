// src/components/LoginSignup.jsx
import React, { useState } from "react";

const LoginSignup = ({ onLoginSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState("login"); // login | signup
  const [signupStage, setSignupStage] = useState("email"); // email | otp | details
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000/api/auth";

  // ------------------- Handlers -------------------
  const handleSendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setError("Email is required");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setSignupStage("otp");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndProcess = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !otp) return setError("Email and OTP are required");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/verify-otp-and-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        if (activeTab === "login") {
          // ✅ OTP login success
          if (data.user && data.token) {
            localStorage.setItem("token", data.token);
            onLoginSuccess(data.user, data.token);
            onClose();
          } else {
            setError("Invalid response from server.");
          }
        } else {
          // ✅ OTP verified for signup, move to details form
          setSignupStage("details");
        }
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch {
      setError("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupPasswordSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!firstName || !cleanEmail || !password) {
      return setError("First name, email, and password are required");
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email: cleanEmail, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch {
      setError("Error during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return setError("Email and password are required");
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l-lg ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("login");
              setSignupStage("email");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r-lg ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("signup");
              setSignupStage("email");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {activeTab === "login" ? (
            <>
              {/* Login with Password */}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login with Password"}
              </button>

              {/* Login with OTP */}
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Login with OTP"}
              </button>

              {signupStage === "otp" && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyOtpAndProcess}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Signup with OTP flow */}
              {signupStage === "email" && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}
              {signupStage === "otp" && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyOtpAndProcess}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
              {signupStage === "details" && (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={handleSignupPasswordSubmit}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>
                </>
              )}
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Close button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
