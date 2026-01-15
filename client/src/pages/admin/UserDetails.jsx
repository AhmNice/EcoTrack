import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  AlertCircle,
  Lock,
  Unlock,
  Download,
  Activity,
  BarChart3,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

const UserDetailsPage = () => {
  const { user_id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(state?.user || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userReports, setUserReports] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const { getUser } = useAuthStore();
  // Mock user data

  // Mock user reports
  const mockUserReports = [
    {
      id: "report_001",
      title: "Blocked Drainage at Market Street",
      status: "resolved",
      severity: "high",
      created_at: "2026-01-07T11:56:44.262Z",
      upvotes: 12,
      downvotes: 2,
    },
    {
      id: "report_002",
      title: "Illegal Dumping Site",
      status: "in_progress",
      severity: "critical",
      created_at: "2026-01-05T09:30:00.000Z",
      upvotes: 25,
      downvotes: 3,
    },
    {
      id: "report_003",
      title: "Water Pollution in River",
      status: "pending",
      severity: "medium",
      created_at: "2026-01-03T14:20:00.000Z",
      upvotes: 8,
      downvotes: 1,
    },
  ];

  // Mock user activity
  const mockUserActivity = [
    {
      id: 1,
      action: "Submitted report",
      description: "Blocked Drainage at Market Street",
      timestamp: "2026-01-07T11:56:44.262Z",
      type: "report",
    },
    {
      id: 2,
      action: "Upvoted report",
      description: "Air Pollution Complaint",
      timestamp: "2026-01-06T15:30:00.000Z",
      type: "vote",
    },
    {
      id: 3,
      action: "Commented on",
      description: "Community Cleanup Initiative",
      timestamp: "2026-01-05T10:15:00.000Z",
      type: "comment",
    },
    {
      id: 4,
      action: "Profile updated",
      description: "Updated contact information",
      timestamp: "2026-01-04T16:45:00.000Z",
      type: "profile",
    },
    {
      id: 5,
      action: "Report resolved",
      description: "Illegal Dumping Site - Marked as resolved",
      timestamp: "2026-01-03T09:20:00.000Z",
      type: "resolution",
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "report":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "vote":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "comment":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "profile":
        return <User className="w-4 h-4 text-gray-500" />;
      case "resolution":
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get user initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Load data
  useEffect(() => {
    const getUserDetails = async () => {
      if (user) return;
      try {
        setLoading(true);
        const response = await getUser(user_id);
        if (!response.success) {
          return;
        }
        setUser(response.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, [user_id]);

  const handleToggleStatus = () => {
    setUser((prev) => ({ ...prev, is_active: !prev.is_active }));
    // API call would go here
  };

  const handleDeleteUser = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.full_name}? This action cannot be undone.`
      )
    ) {
      // API call to delete user
      console.log("Deleting user:", user.id);
      navigate("/admin/users");
    }
  };

  const handleExportData = () => {
    console.log("Exporting user data:", user.id);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="inline-block animate-spin  h-12 w-12 text-green-600" />
              <p className="mt-4 text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600">Manage user account and activity</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6 md:mb-0">
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-3"
                    style={{ backgroundColor: user.avatar_color }}
                  >
                    {getInitials(user.full_name)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleStatus}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        user.is_active
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <Lock className="w-3 h-3 inline mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 inline mr-1" />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {user.full_name}
                      </h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.is_verified
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.is_verified ? "Verified" : "Unverified"}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {user.role_name.charAt(0).toUpperCase() +
                            user.role_name.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <div className="mb-6">
                      <p className="text-gray-700">{user.bio}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-900 truncate w-40">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-900">{user.phone_number}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Joined</p>
                          <p className="text-gray-900">
                            {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Last Login</p>
                          <p className="text-gray-900">
                            {formatTimeAgo(user.last_login)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {user.location && (
                    <div className="mt-4 flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-gray-900">{user.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "overview"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "reports"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Reports ({userReports.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "activity"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Recent Activity
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Reports</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {user.reports_count}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Upvotes Received
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {user.total_upvotes}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Downvotes Received
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {user.total_downvotes}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Avg Response Time
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {user.average_response_time}
                        </p>
                      </div>
                    </div>

                    {/* Recent Reports */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Reports
                      </h3>
                      <div className="space-y-3">
                        {userReports.slice(0, 3).map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {report.title}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                    report.status
                                  )}`}
                                >
                                  {report.status.replace("_", " ")}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                                    report.severity
                                  )}`}
                                >
                                  {report.severity}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(report.created_at)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-green-600">
                                ↑{report.upvotes}
                              </span>
                              <span className="text-sm text-red-600">
                                ↓{report.downvotes}
                              </span>
                              <button
                                onClick={() =>
                                  navigate(`/admin/reports/${report.id}`)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-4">
                    {userReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {report.title}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.status.replace("_", " ")}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                                report.severity
                              )}`}
                            >
                              {report.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(report.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <span className="block text-sm text-green-600">
                              ↑{report.upvotes}
                            </span>
                            <span className="block text-sm text-red-600">
                              ↓{report.downvotes}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              navigate(`/admin/reports/${report.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-4">
                    {userActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">
                            <span className="font-medium">
                              {activity.action}
                            </span>{" "}
                            <span className="text-gray-700">
                              {activity.description}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
         

            {/* Account Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role ID</p>
                  <p className="text-gray-900 font-mono text-sm">
                    {user.role_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Super Admin</p>
                  <p className="text-gray-900">
                    {user.is_super_admin ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* System Access */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Access
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Report Creation</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Comment Permission</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Admin Dashboard</span>
                  {user.role_name === "user" ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Moderation Tools</span>
                  {["admin", "moderator", "super_admin"].includes(
                    user.role_name
                  ) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserDetailsPage;
