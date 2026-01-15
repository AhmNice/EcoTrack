import React, { useState } from "react";
import PageLayout from "../layout/PageLayout";
import { useAuthStore } from "../store/auth.store";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Save,
  X,
  MapPin,
  Globe,
  FileText,
  BarChart3,
  Award,
  Star,
  TrendingUp,
  Lock,
  LogOut,
  ChevronRight,
  EarOffIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logoutUser, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isSaving, setIsSaving] = useState(false);

  // Mock stats - in real app, these would come from API
  const userStats = {
    totalReports: 12,
    pendingReports: 3,
    resolvedReports: 7,
    inProgressReports: 2,
    totalUpvotes: 156,
    totalDownvotes: 8,
    communityRank: "Top Contributor",
    joinDate: user?.created_at || "2026-01-06",
    lastActive: user?.last_login || "2026-01-07T09:14:07.923Z",
  };

  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updateDetected =
      editedUser.full_name !== user.full_name ||
      editedUser.email !== user.email ||
      editedUser.phone_number !== user.phone_number;

    if (!updateDetected) {
      toast.error("No change detected");
      return;
    }
    const payload = {
      user_id: user.id,
      full_name: editedUser.full_name,
      email: editedUser.email,
      phone_number: editedUser.phone_number,
    };

    setIsSaving(true);

    try {
      const response = await updateProfile(payload);
      if (!response.success) {
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDaysSinceJoin = () => {
    if (!user?.created_at) return 0;
    const joinDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (!response.success) {
        return;
      }
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <PageLayout pageTitle="Profile">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view your profile
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="My Profile">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.full_name?.charAt(0) || "U"}
                </div>
                {user.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {user.phone_number && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {user.phone_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <User className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.full_name || ""}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    ) : (
                      <p className="text-gray-900">{user.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone_number || ""}
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
                        }
                        placeholder="Add phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.phone_number || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.is_super_admin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role_name || "User"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Member Since
                      </label>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.created_at)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Active for {calculateDaysSinceJoin()} days
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Active
                      </label>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDate(user.last_login)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Status
                </h2>
                <Shield className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        user.is_verified ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      {user.is_verified ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Verification
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.is_verified ? "Verified" : "Pending verification"}
                      </p>
                    </div>
                  </div>
                  {!user.is_verified && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Verify Email
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Account Status
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.is_active ? "Active" : "Suspended"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Quick Actions */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Activity
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {userStats.totalReports}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {userStats.resolvedReports}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Resolved</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {userStats.pendingReports}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {userStats.totalUpvotes}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Total Upvotes</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        Community Rank
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {userStats.communityRank}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href="/my-reports"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  <span className="font-medium text-gray-700 group-hover:text-green-700">
                    My Reports
                  </span>
                </a>

                <a
                  href="/submit-report"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  <span className="font-medium text-gray-700 group-hover:text-green-700">
                    Submit New Report
                  </span>
                </a>

                <a
                  href="/community-reports"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  <span className="font-medium text-gray-700 group-hover:text-green-700">
                    Community Reports
                  </span>
                </a>

                {!user.is_verified && (
                  <button className="w-full flex items-center gap-3 p-3 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Verify Your Account</span>
                  </button>
                )}
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
