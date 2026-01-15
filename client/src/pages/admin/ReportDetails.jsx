import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import {
  ArrowLeft,
  Eye,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Download,
  Share2,
  MessageSquare,
  ChevronRight,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  ExternalLink,
  Loader2,
  Loader,
} from "lucide-react";
import { useReportStore } from "../../store/reportStore";
import { useCommentStore } from "../../store/commentStore";
import OrgModal from "../../assets/components/modal/OrgModal";

const AdminPostDetailsPage = () => {
  const { report_id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [report, setReport] = useState(state?.report || null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const { getReport, deleteReport, assignReport, resolveReport } =
    useReportStore();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const { getCommentsByReport, addComment } = useCommentStore();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [assigning, setAssigning] = useState(false);
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  console.log(report);
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

  // Status options for dropdown
  const statusOptions = [
    { value: "pending", label: "Mark as Pending", icon: Clock },
    { value: "in_progress", label: "Mark as In Progress", icon: AlertCircle },
    { value: "resolved", label: "Mark as Resolved", icon: CheckCircle },
    { value: "closed", label: "Mark as Rejected", icon: XCircle },
  ];

  // Load data
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report) return;
      setLoading(true);
      try {
        const response = await getReport(report_id);
        if (!response.success || !response.report) {
          setLoading(false);
          return setReport(null);
        }
        setReport(response.report);
      } catch (error) {
        console.error("Error fetching report:", error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [report_id, report, getReport]);
  useEffect(() => {
    if (!report_id) {
      toast.error("no report or id");
      return;
    }
    const fetchComments = async (report_id) => {
      setLoadingComments(true);
      try {
        const response = await getCommentsByReport(report_id);
        if (!response.success) {
          return;
        }
        setComments(response.comments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments(report_id);
  }, [report_id, report, getReport, getCommentsByReport]);
  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    setLoadingStatus(true);
    try {
      const payload = {
        report_id,
        status: newStatus,
      };
      const response = await resolveReport(payload);
      if (!response.success) {
        return;
      }
      setReport((prev) => ({ ...prev, status: newStatus }));
      setStatusAction("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Handle comment submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      user: {
        name: "Admin",
        role: "Administrator",
        avatar: "AD",
      },
      comment: newComment,
      timestamp: new Date().toISOString(),
      isOfficial: true,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };
  const handleAssignModal = () => {
    setShowOrgModal((prev) => !prev);
  };
  const handleOnAssign = async () => {
    const payload = {
      org_id: selectedOrg.id,
      report_id: report.id,
    };
    setAssigning(true);
    try {
      const response = await assignReport({
        report_id: payload.report_id,
        org_id: payload.org_id,
      });
      if (!response.success) return;
      setReport(response.report);
    } catch (error) {
      console.log(error);
    } finally {
      setAssigning(false);
    }
  };
  console.log(report);
  // Handle report deletion
  const handleDeleteReport = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      const response = await deleteReport(report.id);
      if (!response.success) return;
      navigate("/admin/reports");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="inline-block animate-spin  h-12 w-12  text-green-600" />
              <p className="mt-4 text-gray-600">Loading report details...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Report Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The report you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/reports")}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {showOrgModal && (
          <OrgModal
            setSelectedOrg={setSelectedOrg}
            selectedOrg={selectedOrg}
            onClose={() => handleAssignModal()}
            onAssign={() => handleOnAssign()}
          />
        )}
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/reports")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Report Details
              </h1>
              <p className="text-gray-600">ID: {report.id}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {loadingStatus && <Loader2 className="animate-spin h-4 w-4" />}
            <div className="relative">
              <select
                value={statusAction}
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusUpdate(e.target.value);
                  }
                  setStatusAction("");
                }}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Update Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={handleDeleteReport}
              className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="ml-1">
                        {report.status
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          report.status.slice(1).replace("_", " ")}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                        report.severity_level
                      )}`}
                    >
                      {report.severity_level.charAt(0).toUpperCase() +
                        report.severity_level.slice(1)}{" "}
                      Severity
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-400}`}
                    >
                      {report?.assigned && "Assigned"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {report.title}
                  </h2>
                  <p className="text-gray-700">{report.description}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{report.upvotes}</span>
                    </div>
                    <div className="text-xs text-gray-500">Upvotes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="font-semibold">{report.downvotes}</span>
                    </div>
                    <div className="text-xs text-gray-500">Downvotes</div>
                  </div>
                </div>
              </div>

              {/* Tags */}

              {/* Images */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Report Images ({report.images?.length || 0})
                </h3>
                {report.images && report.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={report.images[activeImageIndex]}
                        alt={`Report ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {report.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            activeImageIndex === index
                              ? "border-green-500"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Comments & Updates
                </h3>
                <span className="text-sm text-gray-500">
                  {comments.length} comments
                </span>
              </div>

              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="font-semibold text-green-800">AD</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or update..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          comment.isOfficial ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            comment.isOfficial
                              ? "text-blue-800"
                              : "text-gray-800"
                          }`}
                        >
                          {comment.user.avatar || "U"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {comment.user}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                comment.isOfficial
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {comment.user.role}
                            </span>
                            {comment.isOfficial && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Reporter Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {report.reporter.full_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {report.reporter.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Email:</span>
                      <span className="text-gray-900">
                        {report.reporter.email}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Phone:</span>
                      <span className="text-gray-900">
                        {report.reporter.phone_number}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Reports:</span>
                      <span className="text-gray-900">
                        {report.reporter.reports_count || 0} submitted
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Joined:</span>
                      <span className="text-gray-900">
                        {formatDate(report.reporter.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  View Full Profile
                </button>
              </div>
            </div>

            {/* Report Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Report Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 mr-2">Reported:</span>
                  <span className="text-gray-900">
                    {formatDate(report.created_at)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 mr-2">Last Updated:</span>
                  <span className="text-gray-900">
                    {formatDate(report.updated_at)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 mr-2">Location:</span>
                  <span className="text-gray-900">
                    {report.location_address}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 mr-2">Issue Type:</span>
                  <span className="text-gray-900">{report.issue_type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle
                    className={`w-4 h-4 rounded-full ${
                      report?.assigned ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-600">Assigned To:</span>
                  <span
                    className={`font-medium ${
                      report?.assigned ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {report.assigned
                      ? report?.assigned_to?.[0]?.name ?? "Not assigned"
                      : "Not assigned"}
                  </span>
                </div>
                {report.estimated_resolution_time && (
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 mr-2">Est. Resolution:</span>
                    <span className="text-gray-900">
                      {report.estimated_resolution_time}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Coordinates</p>
                  <p className="text-sm text-gray-500">
                    {report.latitude}, {report.longitude}
                  </p>
                  <button className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center justify-center mx-auto">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open in Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleAssignModal()}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-700">Assign to Team</span>
                  {assigning ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPostDetailsPage;
