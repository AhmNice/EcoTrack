// components/AuthLayout.js
import React from "react";
import {
  Globe,
  Camera,
  MapPin,
  Users,
  Shield,
  TrendingUp,
  CheckCircle,
  Leaf,
  Award,
  Target,
} from "lucide-react";

const AuthLayout = ({ children, isLogin = true }) => {


  return (
    <div className="h-screen flex lg:justify-between flex-col lg:flex-row bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="hidden lg:hidden bg-linear-to-r from-green-600 to-emerald-600 text-white p-6 shrink-0">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">EcoTrack</h1>
            <p className="text-green-100 text-sm">Protecting Our Planet</p>
          </div>
        </div>
        <p className="text-center text-green-100 text-sm mt-2">
          {isLogin
            ? "Sign in to continue protecting our environment"
            : "Create your account and start making a difference"}
        </p>
      </div>

      {/* Main Content*/}
    <div className="flex-1 flex flex-col p-6 overflow-y-scroll overflow-x-hidden no_scrollbar ">
        <div className="flex-1 flex items-center justify-center ">
          <div className="w-full max-w-md flex items-center justify-center lg:max-w-lg xl:max-w-xl">
            {children}
          </div>
        </div>
      </div>

      {/* Side Panel - Fixed height on desktop */}
      <div className="hidden lg:flex flex-1  bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-y-scroll overflow-x-hidden">
        <div className="flex-1 flex flex-col p-12 text-white h-full">
          {/* Header */}
          <div className="shrink-0">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EcoTrack</h1>
                <p className="text-green-100 text-sm">Protecting Our Planet</p>
              </div>
            </div>
          </div>

          {/* Features - Centered content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  {isLogin ? "Welcome Back!" : "Join the Movement"}{" "}
                  <span className="text-green-200">for a Cleaner Planet</span>
                </h2>
                <p className="text-green-100 text-lg leading-relaxed">
                  {isLogin
                    ? "Continue your journey in monitoring and protecting our environment with the EcoTrack community."
                    : "Become part of a growing community dedicated to monitoring and resolving environmental issues through technology and collaboration."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Leaf className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float delay-1000">
          <Target className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float delay-2000">
          <CheckCircle className="w-7 h-7 text-white/30" />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;