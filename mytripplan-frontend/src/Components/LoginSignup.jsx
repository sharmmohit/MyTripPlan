import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const LoginSignup = ({ onLoginSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000/api/auth";
  const navigate = useNavigate();

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

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
        clearFields();
        toast.success("Successfully signed up! Please login.", { autoClose: 3000 });
        navigate("/"); // Redirect to login page
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Error during registration. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
        clearFields();
        toast.success("Logged in successfully!", { autoClose: 3000 });
        navigate("/home"); // After login, go to homepage
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l-lg ${
              activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => { setActiveTab("login"); setError(""); clearFields(); }}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r-lg ${
              activeTab === "signup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => { setActiveTab("signup"); setError(""); clearFields(); }}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

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

          {activeTab === "login" ? (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-6 text-center">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
