import React, { useState, useEffect } from "react";
import {
  Users,
  FileWarning,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import { useStatisticsStore } from "../../store/statisticsStore";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { dashboardStats, fetchDashboardStats } = useStatisticsStore();
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
    },
    reports: {
      total: 0,
      pending: 0,
      critical: 0,
      resolved: 0,
    },
  });

  // Simulate data loading
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        await fetchDashboardStats();

        // Update stats with fetched data
        if (dashboardStats) {
          setStats({
            users: {
              total: dashboardStats.users?.total || 0,
              active: dashboardStats.users?.active || 0,
            },
            reports: {
              total: dashboardStats.reports?.total || 0,
              pending: dashboardStats.reports?.pending || 0,
              critical: dashboardStats.reports?.critical || 0,
              resolved: dashboardStats.reports?.resolved || 0,
            },
          });
        }
      } catch (error) {
        console.log("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fetchDashboardStats]);

  // Calculate resolution rate safely
  const resolutionRate = stats.reports.total > 0
    ? Math.round((stats.reports.resolved / stats.reports.total) * 100)
    : 0;

  if (loading) {
    return (
      <PageLayout pageTitle="Admin Dashboard" showHeaderStats={false}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="Admin Dashboard" showHeaderStats={false}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform statistics and report overview</p>
      </div>

      {/* Stats Overview - 4 cards only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.users.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-green-600">
            <span>{stats.users.active} active users</span>
          </div>
        </div>

        {/* Total Reports */}
        <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.reports.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileWarning className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-sm text-blue-600">
            <span>{stats.reports.resolved} resolved</span>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-xl border border-yellow-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Pending Reports</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.reports.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-sm text-red-600">
            <span>{stats.reports.critical} critical</span>
          </div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Resolved Reports</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.reports.resolved}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-green-600">
            <span>
              {resolutionRate}% resolution rate
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;