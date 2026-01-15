import React, { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import { useAuthStore } from "../store/auth.store";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Download,
  Plus,
  Eye,
  ChevronRight,
  Bell,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNotificationStore } from "../store/notificationStore";
import { useStatisticsStore } from "../store/statisticsStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { notifications } = useNotificationStore();
  const { userStats, fetchUserStats } = useStatisticsStore();

  const [stats, setStats] = useState({
    my_reports: 0,
    pending_reports: 0,
    resolved_reports: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    // Set initial notification count
    const unreadNotifications = notifications.filter((n) => !n.is_read).length;

    setStats((prev) => ({
      ...prev,
      unreadNotifications,
    }));
  }, [notifications]);

  useEffect(() => {
    const getUserStat = async () => {
      try {
        if (user?.id) {
          await fetchUserStats(user.id);
        }
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };

    getUserStat();
  }, [user?.id, fetchUserStats]);

  // Update stats when userStats changes
  useEffect(() => {
    if (userStats) {
      setStats((prev) => ({
        ...prev,
        my_reports: userStats.my_reports || 0,
        pending_reports: userStats.pending_reports || 0,
        resolved_reports: userStats.resolved_reports || 0,
      }));
    }
  }, [userStats]);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 mr-1" />
              {change > 0 ? "+" : ""}
              {change}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, path, color }) => (
    <Link
      to={path}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`p-2 rounded-lg ${color} inline-block mb-3`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
      </div>
    </Link>
  );

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back,{" "}
              <span className="font-semibold text-green-700">
                {user?.full_name || user?.email}
              </span>
              ! Here's what's happening in your community.
            </p>
          </div>

          <div className="flex items-center space-x-3">
           
            <Link
              to="/submit-report"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Report
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Reports"
          value={stats.my_reports}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pending Reports"
          value={stats.pending_reports}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Resolved Reports"
          value={stats.resolved_reports}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <Link
                to="/my-reports"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                title="Submit New Report"
                description="Report environmental issues in your area"
                icon={AlertCircle}
                path="/submit-report"
                color="bg-green-100 text-green-600"
              />
              <QuickActionCard
                title="View My Reports"
                description="Track all your submitted reports"
                icon={Eye}
                path="/my-reports"
                color="bg-blue-100 text-blue-600"
              />
              <QuickActionCard
                title="Community Feed"
                description="See what others are reporting nearby"
                icon={MapPin}
                path="/community-reports"
                color="bg-purple-100 text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Progress & Additional Stats */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {stats.unreadNotifications} Unread Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Check for updates on your reports
                </p>
              </div>
            </div>
            <Link
              to="/notifications"
              className="block w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg transition-colors font-medium"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
