import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/PageLayout";
import {
  Search,
  MapPin,
  Clock,
  Eye,
  Edit,
  ChevronRight,
  Flag,
  CheckCircle,
  Calendar,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useAuditLogStore } from "../../store/auditLogStore";

const ActivityLog = () => {
  const {
    auditLogs,
    loadingAuditLog,
    auditLogError,
    fetchAuditLogs,
    deleteAuditLog,
    fetchAuditLogsByDateRange,
  } = useAuditLogStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [limit, setLimit] = useState(50);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Helper function to get icon based on affected table
  const getActionIcon = (affectedTable) => {
    const table = affectedTable?.toLowerCase() || "";

    if (table.includes("report")) {
      return <Flag className="w-5 h-5 text-red-500" />;
    } else if (table.includes("user")) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (table.includes("organization")) {
      return <Calendar className="w-5 h-5 text-blue-500" />;
    } else if (table.includes("audit") || table.includes("system")) {
      return <Settings className="w-5 h-5 text-purple-500" />;
    }
    return <AlertTriangle className="w-5 h-5 text-gray-500" />;
  };

  // Helper function to get severity color based on action
  const getSeverityColor = (action) => {
    const actionLower = action?.toLowerCase() || "";

    if (actionLower.includes("delete")) {
      return "bg-red-100 text-red-800";
    } else if (actionLower.includes("update") || actionLower.includes("edit")) {
      return "bg-blue-100 text-blue-800";
    } else if (actionLower.includes("create")) {
      return "bg-green-100 text-green-800";
    } else if (actionLower.includes("create")) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Load audit logs on component mount
  useEffect(() => {
    handleLoadLogs();
  }, []);

  const handleLoadLogs = async () => {
    await fetchAuditLogs(limit);
  };

  const handleLoadByDateRange = async () => {
    if (startDate && endDate) {
      await fetchAuditLogsByDateRange(startDate, endDate, limit);
    }
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm("Are you sure you want to delete this audit log?")) {
      const success = await deleteAuditLog(logId);
      if (success) {
        // Refresh logs after deletion
        handleLoadLogs();
      }
    }
  };

  // Filter logs based on search term and filter type
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.affected_table?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "create" &&
        log.action?.toLowerCase().includes("create")) ||
      (filterType === "update" &&
        log.action?.toLowerCase().includes("update")) ||
      (filterType === "delete" && log.action?.toLowerCase().includes("delete"));

    return matchesSearch && matchesFilter;
  });

  if (loadingAuditLog) {
    return (
      <PageLayout>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">Loading audit logs...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Audit Logs
              </h3>
              <p className="text-sm text-gray-600">
                System activity and data modifications ({filteredLogs.length}{" "}
                records)
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by action, table, or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Filter Dropdown */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>

              {/* Limit Selector */}
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value={10}>Last 10</option>
                <option value={25}>Last 25</option>
                <option value={50}>Last 50</option>
                <option value={100}>Last 100</option>
              </select>

              <button
                onClick={handleLoadLogs}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={handleLoadByDateRange}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Filter by Date
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {auditLogError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <p className="text-sm">{auditLogError}</p>
          </div>
        )}

        {/* Audit Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">No audit logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getActionIcon(log.affected_table)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {log.action || "System Action"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getSeverityColor(
                          log.action
                        )}`}
                      >
                        {log.action?.toLowerCase().includes("delete")
                          ? "Delete"
                          : log.action?.toLowerCase().includes("update")
                          ? "Update"
                          : log.action?.toLowerCase().includes("create")
                          ? "Create"
                          : "Other"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {log.affected_table || "Unknown Table"}
                    </p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span>User ID: {log.user_id || "System"}</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete log entry"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        {filteredLogs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setLimit(limit + 50)}
              className="w-full flex items-center justify-center text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Load More
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ActivityLog;
