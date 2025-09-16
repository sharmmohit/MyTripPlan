// src/components/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE } from "../config";

// Replace with your actual image path: import signupBg from "../../assets/signup-bg.jpg";
const signupBg = "https://images.unsplash.com/photo-1533575770077-052fa2c609fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = `${API_BASE}/auth`;
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail || !password) {
      return setError("Name, email and password are required");
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: cleanEmail, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully signed up! Please login.", { autoClose: 3000 });
        navigate("/login"); // redirect to login page
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Error during registration. Try again.");
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
          style={{ backgroundImage: `url(${signupBg})` }}
        >
          <div className="h-full bg-blue-900 bg-opacity-70 flex items-center justify-center p-6">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Join Us Today!</h2>
              <p className="text-sm">Create an account to start your adventure.</p>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-3/5 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Sign Up</h2>
            <Link to="/home" className="text-gray-500 hover:text-gray-700 text-lg">
              &times;
            </Link>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;