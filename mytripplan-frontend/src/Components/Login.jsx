// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loginBg from "./loginimage.png"

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000/api/auth";
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return setError("Email and password are required");
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess && onLoginSuccess(data.user, data.token);
        toast.success("Logged in successfully!", { autoClose: 3000 });
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Error during login. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side with background image */}
        <div 
          className="hidden md:block md:w-2/5 bg-cover bg-center"
          style={{ backgroundImage: {loginBg} }}
        >
          <div className="h-full bg-blue-900 bg-opacity-70 flex items-center justify-center p-6">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Welcome Back!</h2>
              <p className="text-sm">Sign in to continue your journey with us.</p>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-3/5 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Login</h2>
            <Link to="/home" className="text-gray-500 hover:text-gray-700 text-lg">
              &times;
            </Link>
          </div>
          
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;