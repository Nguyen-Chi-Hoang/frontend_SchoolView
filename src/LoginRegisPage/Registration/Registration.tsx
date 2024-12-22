import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Để hiển thị thông báo
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-schoolview.onrender.com/api/auth/register",
        {
          email,
          password,
        }
      );
      setMessage(response.data.message); // Thông báo thành công
    } catch (error) {
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 underline hover:text-blue-600"
            >
              Login
            </a>
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 underline hover:text-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
