import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Home,
  ArrowLeft,
  Lock,
  User,
  Users,
  Crown,
  Mail,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";


const Unauthorized = ({ requiredRole = [] }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const roleConfig = {
    user: {
      title: "user Access Required",
      description:
        "This page is available to enrolled users only. You need user privileges to access this content.",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      homePath: "/dashboard",
    },

    admin: {
      title: "Administrator Access Required",
      description:
        "This area is restricted to platform administrators. Administrative privileges are required for system management.",
      icon: Crown,
      color: "from-red-500 to-orange-500",
      homePath: "/admin/dashboard",
    },
    super_admin: {
      title: "Administrator Access Required",
      description:
        "This area is restricted to platform administrators. Administrative privileges are required for system management.",
      icon: Crown,
      color: "from-red-500 to-orange-500",
      homePath: "/admin/dashboard",
    },
  };

  const roles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  const primaryRole = roles[0];

  const config = roles.length
    ? roleConfig[primaryRole] || {
        title: "Access Denied",
        description:
          "You don't have the required permissions to view this page.",
        icon: Shield,
        color: "from-gray-500 to-gray-600",
        homePath: "/dashboard",
      }
    : {
        title: "Access Denied",
        description:
          "You don't have the required permissions to view this page.",
        icon: Shield,
        color: "from-gray-500 to-gray-600",
        homePath: "/dashboard",
      };
console.log(roleConfig[primaryRole])
  const RoleIcon = config.icon;
  const userConfig = roleConfig[user?.role_name]
  console.log(user)

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

          {/* Icon */}
          <div
            className={`relative w-20 h-20 bg-linear-to-r ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
          >
            <RoleIcon className="w-10 h-10 text-white" />
            {roles.length > 0 && (
              <Lock className="w-5 h-5 text-white/80 absolute -top-1 -right-1" />
            )}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {config.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Role Info */}
          {roles.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {roles.join(" / ").toUpperCase()} PRIVILEGES REQUIRED
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => navigate(userConfig.homePath)}
              className="w-full bg-linear-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
          </div>

          {/* Help */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need elevated access?
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact Support
            </button>
          </div>

          {/* Security */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs text-yellow-700 text-center">
              Unauthorized access attempts are logged.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Unauthorized;
