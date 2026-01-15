// pages/RequestPasswordReset.js
import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { useAuthStore } from "../store/auth.store";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { requestResetPasswordLink } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await requestResetPasswordLink({email});
      if (!response.success) {
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your email and we'll send you instructions to reset your
            password
          </p>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Check Your Email
            </h2>

            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-700">
                  <strong>Didn't receive the email?</strong> Check your spam
                  folder or try again in a few minutes.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Send Another Email
              </button>

              <p className="text-sm text-gray-500">
                Return to{" "}
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        ) : (
          /* Reset Form */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  We'll send a password reset link to your email. The link will
                  expire in 15 minutes for security reasons.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <a
                  href="/auth/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Need help? Contact our{" "}
                <a
                  href="/support"
                  className="text-green-600 hover:text-green-700"
                >
                  support team
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default RequestPasswordReset;
