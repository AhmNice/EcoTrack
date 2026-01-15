import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCheck,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  FileText,
  User,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import PageLayout from "../layout/PageLayout";
import { useNotificationStore } from "../store/notificationStore";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const { user } = useAuthStore();
  const {
    notifications,
    loadingNotifications,
    notificationError,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearError,
  } = useNotificationStore();

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      getUserNotifications(user.id);
    }
  }, [user?.id, getUserNotifications]);
  const navigate = useNavigate();
  const handleViewReport = (report_id) => {
    console.log(user)
    if (user.role_name === "user") {
      navigate(`/reports/${report_id}`);
    } else {
      navigate(`/admin/reports/${report_id}`);
    }
  };
  // Mock data based on your schema

  const notificationsToUse = notifications;
  const unreadCount = notificationsToUse.filter((n) => !n.is_read).length;

  const filters = [
    { id: "all", label: "All", count: notificationsToUse.length },
    {
      id: "unread",
      label: "Unread",
      count: notificationsToUse.filter((n) => !n.is_read).length,
    },
    {
      id: "read",
      label: "Read",
      count: notificationsToUse.filter((n) => n.is_read).length,
    },
    {
      id: "emergency",
      label: "Emergency",
      count: notificationsToUse.filter((n) => n.severity === "critical").length,
    },
    {
      id: "report",
      label: "Report Updates",
      count: notificationsToUse.filter((n) =>
        n.notification_type.includes("report")
      ).length,
    },
    {
      id: "system",
      label: "System",
      count: notificationsToUse.filter(
        (n) =>
          n.notification_type.includes("system") ||
          n.notification_type.includes("community") ||
          n.notification_type.includes("achievement")
      ).length,
    },
  ];

  const getNotificationIcon = (type, severity) => {
    switch (type) {
      case "emergency_alert":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "report_resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "action_required":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "report_verified":
        return <CheckCheck className="w-5 h-5 text-blue-500" />;
      case "system_alert":
        return <Info className="w-5 h-5 text-purple-500" />;
      default:
        switch (severity) {
          case "critical":
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
          case "high":
            return <AlertCircle className="w-5 h-5 text-orange-500" />;
          case "medium":
            return <Info className="w-5 h-5 text-yellow-500" />;
          default:
            return <Bell className="w-5 h-5 text-green-500" />;
        }
    }
  };

  const getNotificationColor = (type, severity) => {
    switch (type) {
      case "emergency_alert":
        return "bg-red-50 border-red-200";
      case "report_resolved":
        return "bg-green-50 border-green-200";
      case "action_required":
        return "bg-yellow-50 border-yellow-200";
      case "report_verified":
        return "bg-blue-50 border-blue-200";
      case "system_alert":
        return "bg-purple-50 border-purple-200";
      default:
        switch (severity) {
          case "critical":
            return "bg-red-50 border-red-200";
          case "high":
            return "bg-orange-50 border-orange-200";
          case "medium":
            return "bg-yellow-50 border-yellow-200";
          default:
            return "bg-green-50 border-green-200";
        }
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Use real notifications from store if available, otherwise use mock
      const dataToUse = notifications;
      setFilteredNotifications(dataToUse);
    }, 500);
  }, [notifications]);

  useEffect(() => {
    const notificationsToFilter = notifications;

    if (activeFilter === "all") {
      setFilteredNotifications(notificationsToFilter);
    } else if (activeFilter === "unread") {
      setFilteredNotifications(notificationsToFilter.filter((n) => !n.is_read));
    } else if (activeFilter === "read") {
      setFilteredNotifications(notificationsToFilter.filter((n) => n.is_read));
    } else if (activeFilter === "emergency") {
      setFilteredNotifications(
        notificationsToFilter.filter((n) => n.severity === "critical")
      );
    } else if (activeFilter === "report") {
      setFilteredNotifications(
        notificationsToFilter.filter((n) =>
          n.notification_type.includes("report")
        )
      );
    } else if (activeFilter === "system") {
      setFilteredNotifications(
        notificationsToFilter.filter(
          (n) =>
            n.notification_type.includes("system") ||
            n.notification_type.includes("community") ||
            n.notification_type.includes("achievement")
        )
      );
    }
  }, [activeFilter, notifications]);

  const handleMarkAsRead = (id, readStatus) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    const notificationsToUse = notifications;
    const unreadIds = notificationsToUse
      .filter((n) => !n.is_read)
      .map((n) => n.id);
    if (unreadIds.length > 0) {
      markAllNotificationsAsRead(unreadIds);
    }
  };

  const handleDeleteNotifications = () => {
    // Delete each selected notification
    selectedNotifications.forEach((id) => {
      deleteNotification(id);
    });
    setSelectedNotifications([]);
    setShowDeleteConfirm(false);
  };

  const handleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(
        selectedNotifications.filter((notificationId) => notificationId !== id)
      );
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const refreshNotifications = () => {
    if (user?.id) {
      getUserNotifications(user.id);
    }
  };

  return (
    <PageLayout pageTitle="Notifications" showHeaderStats={false}>
      {loadingNotifications ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {notificationError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{notificationError}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  Stay updated with your environmental reports and community
                  activities
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={refreshNotifications}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unreadCount}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Report Updates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      notifications.filter((n) =>
                        n.notification_type.includes("report")
                      ).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emergency Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      notifications.filter((n) => n.severity === "critical")
                        .length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by:
                </span>
              </div>

              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    activeFilter === filter.id
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeFilter === filter.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header with Select All */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedNotifications.length ===
                        filteredNotifications.length &&
                      filteredNotifications.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Select All ({filteredNotifications.length} notifications)
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {unreadCount} unread • {filteredNotifications.length} total
                </span>
              </div>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-100">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600">
                    {activeFilter === "all"
                      ? "You're all caught up! No new notifications."
                      : `No ${activeFilter} notifications found.`}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-all duration-200 ${
                      !notification.is_read ? "bg-blue-50/50" : ""
                    } ${
                      selectedNotifications.includes(notification.id)
                        ? "bg-green-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onChange={() =>
                            handleSelectNotification(notification.id)
                          }
                          className="w-4 h-4 text-green-500 border-gray-300 rounded"
                        />
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(
                          notification.notification_type,
                          notification.severity
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`font-medium ${
                                  !notification.is_read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.notification_type
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </h3>
                              {!notification.is_read && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="text-gray-600 mb-2">
                              {notification.message}
                            </p>

                            {notification.report_title && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center space-x-3 text-sm">
                                  {notification.report_title && (
                                    <div className="flex items-center space-x-1 text-gray-700">
                                      <FileText className="w-4 h-4" />
                                      <span className="font-medium">
                                        {notification.report_title}
                                      </span>
                                    </div>
                                  )}
                                  {notification.report_location && (
                                    <div className="flex items-center space-x-1 text-gray-600">
                                      <MapPin className="w-4 h-4" />
                                      <span>
                                        {notification.report_location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-4 mt-3">
                              <span className="text-sm text-gray-500 flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{getTimeAgo(notification.sent_at)}</span>
                              </span>

                              {notification.notification_type ===
                                "action_required" && (
                                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                                  Take Action →
                                </button>
                              )}

                              {notification.report_id && (
                                <button
                                  onClick={() =>
                                    handleViewReport(notification.report_id)
                                  }
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  View Report →
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() =>
                                handleMarkAsRead(
                                  notification.id,
                                  !notification.is_read
                                )
                              }
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title={
                                notification.is_read
                                  ? "Mark as unread"
                                  : "Mark as read"
                              }
                            >
                              {notification.is_read ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setExpandedNotification(
                                  expandedNotification === notification.id
                                    ? null
                                    : notification.id
                                )
                              }
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {expandedNotification === notification.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedNotification === notification.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Notification ID:
                                </span>
                                <p className="font-mono text-gray-700">
                                  {notification.id}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <p className="text-gray-700">
                                  {notification.notification_type}
                                </p>
                              </div>
                              {notification.report_id && (
                                <div>
                                  <span className="text-gray-500">
                                    Report ID:
                                  </span>
                                  <p className="font-mono text-gray-700">
                                    {notification.report_id}
                                  </p>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-500">Severity:</span>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    notification.severity === "critical"
                                      ? "bg-red-100 text-red-700"
                                      : notification.severity === "high"
                                      ? "bg-orange-100 text-orange-700"
                                      : notification.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {notification.severity}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Notifications
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedNotifications.length}{" "}
              notification(s)? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNotifications}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default NotificationPage;
