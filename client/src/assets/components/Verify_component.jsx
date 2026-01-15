import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Smartphone,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Shield
} from 'lucide-react';

const VerifyComponent = ({
  type = "email",
  onSubmit,
  onResend,
  loading = false,
  error = null,
  email = "",
  phone = ""
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  const recipient = type === "email" ? email : phone;
  const maskedRecipient = type === "email"
    ? recipient.replace(/(.{2})(.*)(?=@)/, (match, p1, p2) => p1 + '*'.repeat(p2.length))
    : recipient.replace(/\d(?=\d{4})/g, '*');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleSubmit();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const pastedOtp = pastedData.split('');
      setOtp(pastedOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6 && onSubmit) {
      onSubmit(otpString);
    }
  };

  const handleResend = () => {
    if (countdown === 0 && onResend) {
      setCountdown(60);
      onResend();
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="rounded-xl bg-white p-4 shadow border border-gray-100">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Verify your {type}
          </h2>

        </div>

        {/* OTP Input - Compact */}
        <div className="mb-4">

          <div className="flex justify-center space-x-2 mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-12 text-center text-xl font-semibold border rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition"
                style={{
                  borderColor: error ? '#ef4444' : '#d1d5db',
                  backgroundColor: error ? '#fef2f2' : '#f9fafb'
                }}
                disabled={loading || isVerified}
              />
            ))}
          </div>
        </div>

        {/* Error Message - Compact */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <p className="font-medium">Verification Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success Message - Compact */}
        {isVerified && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div className="text-xs text-green-800">
              <p className="font-medium">Verified Successfully</p>
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="space-y-2">
          <button
            onClick={handleSubmit}
            disabled={otp.join('').length !== 6 || loading || isVerified}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors flex items-center justify-center gap-1 text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : isVerified ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Verified
              </>
            ) : (
              <>
                Verify
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              className="text-xs text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className={`w-3 h-3 ${countdown > 0 ? 'animate-spin' : ''}`} />
              Resend {countdown > 0 && `(${countdown}s)`}
            </button>
          </div>
        </div>

        {/* Additional Info - Compact */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2">
            {type === "email" ? (
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-xs text-gray-600">
              <p>Code expires in 10 minutes. Check spam folder if not received.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Link - Compact */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Need help?{' '}
          <button className="text-green-600 hover:text-green-700 font-medium">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyComponent;