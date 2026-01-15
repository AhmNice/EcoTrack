import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MessageSquare,
  Flag,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  BarChart3,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useReportStore } from "../store/reportStore";
import ConfirmationModal from "../assets/components/modal/ConfirmationModal";
import { toast } from "react-toastify";
import { useVoteStore } from "../store/voteStore";
import { useCommentStore } from "../store/commentStore";

const ReportDetails = () => {
  const { report_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(location?.state?.report || null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuthStore();
  const { getReport, deleteReport } = useReportStore();
  const [showModal, setShowModal] = useState(false);
  const { getCommentsByReport, addComment } = useCommentStore();
  const [loadingComments, setLoadingComments] = useState(false);
  const handleDelete = async (report_id) => {
    try {
      const response = await deleteReport(report_id);
      if (!response.success) {
        return;
      }
      setShowModal(false);
      navigate("/my-reports");
    } catch (error) {
      console.log(error);
      return;
    }
  };
  console.log(report);
  // Fetch report details
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report) return;
      setLoading(true);
      try {
        const response = await getReport(report_id);
        if (!response.success || !response.report) {
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
  // Fetch report comments
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
  // Get user's vote from report
  useEffect(() => {
    const getUserVote = () => {
      if (!user || !report?.voters || !Array.isArray(report.voters)) {
        return null;
      }
      const userVote = report.voters.find((voter) => voter.user_id === user.id);
      console.log(userVote);
      setUserVote(userVote || null);
    };

    if (report) {
      getUserVote();
    }
  }, [report, user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to comment");
      return;
    }

    try {
      const payload = {
        report_id,
        user_id: user.id,
        comment: newComment.trim(),
      };
      const response = await addComment(payload);
      if (!response.success) {
        return;
      }
      if (newComment.trim()) {
        const newCommentObj = {
          id: comments.length + 1,
          user: user.full_name || "You",
          avatar: "ME",
          comment: newComment,
          timestamp: "Just now",
          upvotes: 0,
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { upVoteReport, downVoteReport, removeVote } = useVoteStore();

  const handleVote = async (voteType, report_id) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      setReport((prev) => {
        let upvotes = Number(prev.upvotes);
        let downvotes = Number(prev.downvotes);

        // REMOVE SAME VOTE
        if (userVote?.vote_type === voteType) {
          if (voteType === 1) upvotes -= 1;
          if (voteType === -1) downvotes -= 1;
        }

        // SWITCH VOTE
        else if (userVote) {
          if (userVote.vote_type === 1) upvotes -= 1;
          if (userVote.vote_type === -1) downvotes -= 1;

          if (voteType === 1) upvotes += 1;
          if (voteType === -1) downvotes += 1;
        }

        // FIRST TIME VOTE
        else {
          if (voteType === 1) upvotes += 1;
          if (voteType === -1) downvotes += 1;
        }

        return { ...prev, upvotes, downvotes };
      });

      // === API CALLS ===
      if (userVote?.vote_type === voteType) {
        await removeVote(report_id);
        setUserVote(null);
      } else {
        if (voteType === 1) await upVoteReport(report_id);
        if (voteType === -1) await downVoteReport(report_id);
        setUserVote({ user_id: user.id, vote_type: voteType });
      }
    } catch (error) {
      console.error(error);
      toast.error("Vote action failed. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report?.title || report?.issue_type || "Environmental Report",
        text: report?.description?.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
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

  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-100 text-gray-800";

    switch (severity.toLowerCase()) {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const calculateDaysOpen = (createdAt) => {
    if (!createdAt) return 0;

    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();

      // Check for "Invalid Date"
      if (isNaN(createdDate.getTime())) return 0;

      // Difference in milliseconds
      const diffInMs = currentDate - createdDate;

      // Convert ms to days: (ms / 1000ms / 60s / 60m / 24h)
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // Return 0 if the date is in the future, otherwise round down
      return diffInDays > 0 ? Math.floor(diffInDays) : 0;
    } catch (error) {
      console.error("Error calculating days open:", error);
      return 0;
    }
  };

  const voteRatio = (report) => {
    if (!report || !report.total_votes || report.total_votes === 0) {
      return (
        <span>
          0% <span className="text-sm">positive</span>
        </span>
      );
    }

    try {
      const upvotes = parseInt(report.upvotes) || 0;
      const totalVotes = parseInt(report.total_votes) || 0;
      const result = Math.round((upvotes / totalVotes) * 100);

      if (isNaN(result)) {
        return (
          <span>
            0% <span className="text-sm">positive</span>
          </span>
        );
      }

      return (
        <span>
          {result}% <span className="text-sm">positive</span>
        </span>
      );
    } catch (error) {
      return (
        <span>
          0% <span className="text-sm">positive</span>
        </span>
      );
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return "Unknown";

    switch (status.toLowerCase()) {
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "resolved":
        return "Resolved";
      default:
        return status.replace("_", " ").toUpperCase();
    }
  };

  const getSeverityDisplay = (severity) => {
    if (!severity) return "Unknown";
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const renderImageGallery = () => {
    if (!report?.images || report.images.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-96 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-3" />
              <p className="font-medium">No images available</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <div className="h-96">
            <img
              src={report.images[activeImage]}
              alt={`Report evidence ${activeImage + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Image+Not+Available";
              }}
            />
          </div>

          {report.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev > 0 ? prev - 1 : report.images.length - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev < report.images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <ChevronLeft size={20} className="rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {report.images.length > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {report.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80?text=Image";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <PageLayout pageTitle="Loading...">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout pageTitle="Report Not Found">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Report Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The report you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/my-reports")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Reports
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle={`Report: ${report.title || report.issue_type}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-reports")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Reports
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {report.title || report.issue_type}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {getStatusDisplay(report.status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                    report.severity_level
                  )}`}
                >
                  {getSeverityDisplay(report.severity_level)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {report.reporter?.full_name || "Unknown Reporter"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(report.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {report.location_address || "Location not specified"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleVote(1, report_id)}
                disabled={!user}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  userVote?.vote_type === 1
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ThumbsUp size={18} />
                <span className="font-medium">{report.upvotes || 0}</span>
              </button>
              <button
                onClick={() => handleVote(-1, report_id)}
                disabled={!user}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  userVote?.vote_type === -1
                    ? "bg-red-50 text-red-700 border-red-300"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ThumbsDown size={18} />
                <span className="font-medium">{report.downvotes || 0}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {renderImageGallery()}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p
                  className={`${
                    !showFullDescription && "line-clamp-6"
                  } transition-all whitespace-pre-wrap`}
                >
                  {report.description || "No description provided."}
                </p>
                {report.detailed_notes && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="font-medium text-blue-900 mb-2">
                      Additional Notes:
                    </p>
                    <p className="text-blue-800 whitespace-pre-wrap">
                      {report.detailed_notes}
                    </p>
                  </div>
                )}
                {report.description && report.description.length > 500 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    {showFullDescription ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Comments ({comments.length})
                </h2>
                {!user && (
                  <p className="text-sm text-gray-500">Login to comment</p>
                )}
              </div>

              {/* Comment Form */}
              {user && (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-green-800">
                        {user.full_name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <textarea
                        id="comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                        disabled={!user}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || !user}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 && !loadingComments && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}

                {comments &&
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-gray-700">
                          {comment.avatar || "M"}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {comment.user}
                            </span>
                            <span className="text-sm text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          {user && (
                            <button className="text-gray-400 hover:text-gray-600">
                              <Flag size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{comment.comment}</p>
                        {user && (
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                              <ThumbsUp size={16} />
                              <span className="text-sm">{comment.upvotes}</span>
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 text-sm">
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {loadingComments && (
                  <div className="w-full  flex items-center justify-center">
                    <Loader2
                      className="animate-spin text-green-700"
                      size={24}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Report Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Report Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Open</span>
                  <span className="font-semibold text-gray-900">
                    {calculateDaysOpen(report.created_at)} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-semibold text-gray-900">
                    {report.total_votes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vote Ratio</span>
                  <span className="font-semibold flex gap-1 text-gray-900">
                    {voteRatio(report)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Issue Type</span>
                  <span className="font-semibold text-gray-900">
                    {report.issue_type || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reporter
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {report.reporter?.full_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Reported {calculateDaysOpen(report.created_at)} days ago
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t text-sm border-gray-200">
                  {report.reporter?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <a
                        href={`mailto:${report.reporter.email}`}
                        className="flex items-center gap-2 truncate text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {report.reporter.email}
                      </a>
                    </div>
                  )}
                  {report.reporter?.phone_number && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      {report.reporter.phone_number}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  {report.location_address || "Location not specified"}
                </div>
                {report.latitude && report.longitude && (
                  <div className="text-sm text-gray-500">
                    <p>Coordinates:</p>
                    <p className="font-mono">
                      Lat: {report.latitude}, Long: {report.longitude}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (report.latitude && report.longitude) {
                      const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
                      window.open(url, "_blank");
                    } else {
                      alert("Location coordinates not available");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!report.latitude || !report.longitude}
                >
                  <Globe size={18} />
                  View on Map
                </button>
              </div>
            </div>
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
            {/* Actions */}
            {user && user.id === report.user_id && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/edit-report/${report_id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={18} />
                    Edit Report
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <ConfirmationModal
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          onConfirm={() => handleDelete(report.id)}
          type="danger"
          message={`Deleting report can not be undo`}
        />
      )}
    </PageLayout>
  );
};

export default ReportDetails;
