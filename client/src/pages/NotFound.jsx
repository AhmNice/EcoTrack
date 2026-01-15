import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const NotFound = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (user) {
      const route =
        user.role_name === "user" ? "/dashboard" : "/admin/dashboard";
      navigate(route);
      return;
    }
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for might have been removed or doesn't exist.
        </p>
        <button
          onClick={() => handleNavigate()}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
