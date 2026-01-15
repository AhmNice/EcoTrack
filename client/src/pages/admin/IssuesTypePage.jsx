import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Hash,
  Tag,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  SortAsc,
  SortDesc,
  Shield,
  Grid,
  List,
  Info,
} from "lucide-react";

import { toast } from "react-toastify";
import PageLayout from "../../layout/PageLayout";
import { useIssuesStore } from "../../store/issueStore";
import ConfirmationModal from "../../assets/components/modal/ConfirmationModal";
import NewIssueModal from "../../assets/components/modal/NewIssues";

const IssuesTypePage = () => {
  const navigate = useNavigate();
  const { getAllIssues, issues, deleteIssue, loading } = useIssuesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toEdit, setToEdit] = useState(null);
  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = [...issues];
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (issue) =>
          issue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (issue.description &&
            issue.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null) aValue = "";
        if (bValue == null) bValue = "";

        // Convert to string for consistent comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredIssues(filtered);
  }, [issues, searchQuery, sortConfig, selectedCategory]);

  const fetchIssues = async () => {
    try {
      await getAllIssues();
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to load issue types");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (issue) => {
    setIssueToDelete(issue);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!issueToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteIssue(issueToDelete.id);

      if (response.success) {
        toast.success("Issue type deleted successfully");
        fetchIssues(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete issue type");
      }
    } catch (error) {
      console.error("Error deleting issue type:", error);
      toast.error("Failed to delete issue type");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setIssueToDelete(null);
    }
  };

  const handleEdit = (issue) => {
    setToEdit(issue);
    setShowAddNewModal(true);
  };
  console.log(toEdit);
  const handleAddNew = () => {
    setShowAddNewModal(true);
  };

  const handleRefresh = () => {
    fetchIssues();
  };

  const handleExport = () => {
    // Implement export functionality
    const csvContent = [
      ["ID", "Name", "Description", "Created At"],
      ...filteredIssues.map((issue) => [
        issue.id,
        issue.name,
        issue.description || "",
        new Date(issue.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "issue_types.csv";
    a.click();

    toast.success("Exported successfully");
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredIssues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{issue.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="w-3 h-3 mr-1" />
                  {issue.id.slice(0, 8)}...
                </div>
              </div>
            </div>
            <div className="relative"></div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {issue.description || "No description provided"}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleEdit(issue)}
              className="flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-1.5" />
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(issue)}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center"
              >
                <Tag className="w-4 h-4 mr-2" />
                Name
                {getSortIcon("name")}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <button
                onClick={() => handleSort("created_at")}
                className="flex items-center"
              >
                Created
                {getSortIcon("created_at")}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredIssues.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {issue.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {issue.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-md">
                  <p className="text-sm text-gray-600 truncate">
                    {issue.description || "No description"}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(issue.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleEdit(issue)}
                    className="text-green-600 hover:text-green-900 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(issue)}
                    className="text-red-600 hover:text-red-900 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  return (
    <PageLayout pageTitle="Issue Types">
      {showAddNewModal && (
        <NewIssueModal
          isOpen={true}
          onClose={() => setShowAddNewModal(false)}
          toEdit={toEdit}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issue Types</h1>
            <p className="text-gray-600 mt-1">
              Manage different types of environmental issues that can be
              reported
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Issue Type
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search issue types by name or description..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </button>

              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortConfig.key}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="created_at">Date Created</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    value={sortConfig.direction}
                    onChange={(e) =>
                      setSortConfig((prev) => ({
                        ...prev,
                        direction: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                {/* Add more filter options as needed */}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Issue Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {issues.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {issues.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Descriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    issues.filter(
                      (issue) => issue.description && issue.description.trim()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading issue types...</p>
            </div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery
                ? "No matching issue types found"
                : "No issue types yet"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "Get started by adding your first issue type"}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add First Issue Type
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredIssues.length} of {issues.length} issue types
              </p>
              <div className="text-sm text-gray-600">
                Sorted by: {sortConfig.key} ({sortConfig.direction})
              </div>
            </div>

            {viewMode === "grid" ? renderGridView() : renderListView()}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && issueToDelete && (
          <ConfirmationModal
            isLoading={isDeleting}
            confirmText="Delete Issue Type"
            onConfirm={() => handleConfirmDelete}
            message=" Are you sure you want to delete"
            onClose={() => setShowDeleteModal(false)}
            isOpen={showDeleteModal}
            type="danger"
            title="Delete"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default IssuesTypePage;
