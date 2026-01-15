import React, { useState, useEffect } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
  Link,
  data,
} from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Users,
  User,
  Edit,
  Trash2,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  ExternalLink,
  Settings,
  Activity,
  BarChart3,
  Clock,
  Star,
  MessageSquare,
  Download,
  Share2,
  Eye,
  Lock,
  Unlock,
  Tag,
  Hash,
  Database,
  Layers,
  Briefcase,
  Map,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useOrganizationStore } from "../../store/organizationStore";
import { format } from "date-fns";
import { toast } from "react-toastify";

const OrgDetails = () => {
  const { organization_id } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(state?.organization || null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getOrgData, deleteOrganization, updateOrganization } =
    useOrganizationStore();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    activeReports: 0,
    resolvedReports: 0,
  });

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);

        // If we have data from navigation state, use it
        if (state?.orgData) {
          setOrgData(state.orgData);
        } else if (organization_id) {
          // Otherwise fetch from API
          const data = await getOrgData(organization_id);
          if (data.data) {
            setOrgData(data.data);
          } else {
            toast.error("Organization not found");
            navigate("/admin/organizations");
            return;
          }
        }

        setStats({
          totalUsers: orgData?.users?.length || 0,
          totalReports: orgData?.reports?.length || 0,
          activeReports:
            orgData?.reports?.filter(
              (report) =>
                report.status === "active" || report.status === "pending"
            ).length || 0,
          resolvedReports:
            orgData?.reports?.filter(
              (report) =>
                report.status === "resolved" || report.status === "closed"
            ).length || 0,
        });
      } catch (error) {
        console.error("Error fetching organization data:", error);
        toast.error("Failed to load organization details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [organization_id, state?.orgData, getOrgData, navigate]);
  const handleDeleteOrganization = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteOrganization(organization_id);
      if (response.success) {
        toast.success("Organization deleted successfully");
        navigate("/admin/organizations");
      } else {
        toast.error(response.message || "Failed to delete organization");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getOrgData(organization_id);
      if (data) {
        setOrgData(data);
        toast.success("Organization data refreshed");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const getOrgTypeColor = (type) => {
    const colors = {
      government: "bg-blue-100 text-blue-800",
      non_profit: "bg-green-100 text-green-800",
      private: "bg-purple-100 text-purple-800",
      municipal: "bg-yellow-100 text-yellow-800",
      research: "bg-indigo-100 text-indigo-800",
      community: "bg-pink-100 text-pink-800",
      educational: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getOrgTypeLabel = (type) => {
    const labels = {
      government: "Government",
      non_profit: "Non-Profit",
      private: "Private Company",
      municipal: "Municipal",
      research: "Research",
      community: "Community",
      educational: "Educational",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEditOrganization = () => {
    navigate(`/admin/organizations/edit/${organization_id}`, {
      state: { organization: orgData },
    });
  };

  const handleAddUser = () => {
    navigate(`/admin/organizations/${organization_id}/add-user`);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organization details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!orgData) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Building2 className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Organization not found
          </h3>
          <p className="text-gray-600 mb-6">
            The organization you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/admin/organizations")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Organizations
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/organizations")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {orgData.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getOrgTypeColor(
                      orgData.organization_type
                    )}`}
                  >
                    {getOrgTypeLabel(orgData.organization_type)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Database className="w-4 h-4 mr-1" />
                    ID: {orgData.id?.slice(0, 8)}...
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created: {formatDate(orgData.created_at)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleEditOrganization}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalReports}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeReports}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.resolvedReports}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["overview", "users", "reports", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Organization Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Description
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {orgData.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {orgData.email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-gray-900">{orgData.email}</p>
                          </div>
                        </div>
                      )}

                      {orgData.phone_number && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="text-gray-900">
                              {orgData.phone_number}
                            </p>
                          </div>
                        </div>
                      )}

                      {orgData.location && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="text-gray-900">{orgData.location}</p>
                          </div>
                        </div>
                      )}

                      {orgData.website && (
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <a
                              href={orgData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 flex items-center"
                            >
                              {orgData.website}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Organization ID</p>
                        <p className="text-gray-900 font-mono text-sm">
                          {orgData.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrgTypeColor(
                            orgData.organization_type
                          )}`}
                        >
                          {getOrgTypeLabel(orgData.organization_type)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-gray-900">
                          {formatDate(orgData.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Organization Members
                </h3>
                <button
                  onClick={handleAddUser}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>

              {orgData.users && orgData.users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orgData.users.map((user) => (
                        <tr key={user.user_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.full_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.role || "Member"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleRemoveUser(user.user_id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add users to this organization to get started.
                  </p>
                  <button
                    onClick={handleAddUser}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First User
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assigned Reports
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    View All
                  </button>
                </div>
              </div>

              {orgData.reports && orgData.reports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orgData.reports.map((report) => (
                        <tr key={report.report_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                report.status === "resolved" ||
                                report.status === "closed"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.status?.charAt(0).toUpperCase() +
                                report.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {formatDate(report.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-4">
                              View
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reports assigned
                  </h3>
                  <p className="text-gray-600">
                    Reports assigned to this organization will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Organization Settings
              </h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Danger Zone
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Delete Organization
                      </p>
                      <p className="text-sm text-gray-600">
                        Once deleted, it cannot be recovered.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Organization
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Organization
                  </h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{orgData.name}</strong>?
                All associated data will be permanently removed.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Organization"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default OrgDetails;
