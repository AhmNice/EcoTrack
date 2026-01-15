import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  HelpCircle,
  Menu,
  MapPin,
  Filter,
  TrendingUp,
  ChevronDown,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notificationStore";

const Header = ({
  onMenuToggle,
  user,
  title = "Dashboard",
  showStats = true,
}) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();
  const {
    notifications,
    loadingNotifications,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotificationStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Central Park, NYC");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const initials = (name) => {
    const split = name.split(" ");
    return `${split[0][0]}${split[1][0]}`;
  };

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      getUserNotifications(user.id);
    }
  }, [user?.id, getUserNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Stats data
 
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

  const handleQuickReport = () => {
    navigate("/submit-report");
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.report_id) {
      if (user.role_name === "user") {
        navigate(`/reports/${notification.report_id}`);
      } else {
        navigate(`/admin/reports/${notification.report_id}`);
      }
    }
    setIsNotificationsOpen(false);
  };

  const handleLocationUpdate = (newLocation) => {
    setCurrentLocation(newLocation);
    setShowLocationModal(false);
  };

  return (
    <header className="sticky w-full top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="px-4 w-full sm:px-6 lg:px-8">
        <div className="flex w-full  items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Right Section:  & Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <button
                        onClick={() => {
                          const unreadIds = notifications
                            .filter((n) => !n.is_read)
                            .map((n) => n.id);
                          if (unreadIds.length > 0) {
                            markAllNotificationsAsRead(unreadIds);
                          }
                        }}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.is_read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                notification.notification_type === "urgent"
                                  ? "bg-red-500"
                                  : notification.notification_type === "warning"
                                  ? "bg-yellow-500"
                                  : notification.notification_type === "info"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {notification.notification_type
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    notification.sent_at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        navigate("/notifications");
                        setIsNotificationsOpen(false);
                      }}
                      className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>



            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-medium">
                  {initials(user.full_name)}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user.full_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Environmental Champion
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">My Profile</span>
                    </button>

                    <button
                      onClick={() => navigate("/my-reports")}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">My Reports</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
