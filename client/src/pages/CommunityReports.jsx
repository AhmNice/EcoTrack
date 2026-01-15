import React, { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import { useReportStore } from "../store/reportStore";
import ReportCard from "../assets/components/cards/ReportCard";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  Grid,
  List,
  TrendingUp,
  Flame,
  BarChart3,
  X,
} from "lucide-react";

const CommunityReports = () => {
  const { allReports, getAllReports, } = useReportStore();
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCommunity, SetLoadingCommunity] = useState(false);
  // Fetch reports on component mount
  useEffect(() => {
    const fetchAllReports = async () => {
      SetLoadingCommunity(true);
      try {
        await getAllReports();
      } catch (error) {
        console.log(error);
      } finally {
        SetLoadingCommunity(false);
      }
    };
    fetchAllReports();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...allReports];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (report) =>
          (report.title && report.title.toLowerCase().includes(term)) ||
          (report.description &&
            report.description.toLowerCase().includes(term)) ||
          (report.location_address &&
            report.location_address.toLowerCase().includes(term)) ||
          (report.issue_type && report.issue_type.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((report) => report.status === statusFilter);
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      result = result.filter(
        (report) => report.severity_level === severityFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "most_votes":
          return (parseInt(b.upvotes) || 0) - (parseInt(a.upvotes) || 0);
        case "highest_severity":
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (
            (severityOrder[b.severity_level] || 0) -
            (severityOrder[a.severity_level] || 0)
          );
        case "most_comments":
          // Assuming reports have a comments_count field
          return (b.comments_count || 0) - (a.comments_count || 0);
        default:
          return 0;
      }
    });

    setFilteredReports(result);

    // Update active filters for display
    const filters = [];
    if (statusFilter !== "all") filters.push(`Status: ${statusFilter}`);
    if (severityFilter !== "all") filters.push(`Severity: ${severityFilter}`);
    if (sortBy !== "newest") filters.push(`Sort: ${sortBy.replace("_", " ")}`);
    setActiveFilters(filters);
  }, [allReports, searchTerm, statusFilter, severityFilter, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setSortBy("newest");
  };

  // Remove specific filter
  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("Status:")) {
      setStatusFilter("all");
    } else if (filterToRemove.startsWith("Severity:")) {
      setSeverityFilter("all");
    } else if (filterToRemove.startsWith("Sort:")) {
      setSortBy("newest");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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

  return (
    <PageLayout pageTitle="Community Reports">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_votes">Most Votes</option>
                  <option value="highest_severity">Highest Severity</option>
                  <option value="most_comments">Most Comments</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {allReports.length}
            </span>{" "}
            reports
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-green-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading reports...</span>
            </div>
          )}
        </div>

        {/* Reports Grid/List */}
        {loadingCommunity && filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading community reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 mb-6">
              {allReports.length === 0
                ? "There are no reports in the community yet. Be the first to submit one!"
                : "Try adjusting your filters or search terms"}
            </p>
            {allReports.length === 0 ? (
              <button
                onClick={() => (window.location.href = "/submit-report")}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit First Report
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CommunityReports;
