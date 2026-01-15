import { ArrowLeft, ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";

const ReportCard = ({ report }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleViewDetails = (report) => {
    navigate(`/reports/${report.id}`, {
      state: {
        report,
      },
    });
  };
  const renderImages = () => {
    const { images } = report;
    const imageCount = images?.length || 0;
    const imagesToShow = images?.slice(0, 4) || [];

    if (imageCount === 0) {
      return (
        <div className="w-full h-40 bg-gray-100 rounded-t-2xl flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">No images</p>
          </div>
        </div>
      );
    }

    // Special layouts for different image counts
    if (imageCount === 1) {
      return (
        <div className="w-full rounded-t-2xl overflow-hidden">
          <img
            src={images[0]}
            alt="report_evidence_image_0"
            className="h-40 w-full object-cover"
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-0.5 w-full rounded-t-2xl overflow-hidden">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`report_evidence_image_${index}`}
              className="h-40 w-full object-cover"
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-0.5 w-full rounded-t-2xl overflow-hidden">
          <div className="col-span-2 h-32">
            <img
              src={images[0]}
              alt="report_evidence_image_0"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-24">
            <img
              src={images[1]}
              alt="report_evidence_image_1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-24">
            <img
              src={images[2]}
              alt="report_evidence_image_2"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      );
    }

    // 4 or more images
    return (
      <div className="grid grid-cols-2 gap-0.5 w-full rounded-t-2xl overflow-hidden">
        {imagesToShow.map((image, index) => {
          const isLastImage = index === 3 && imageCount > 4;

          if (isLastImage) {
            return (
              <div key={index} className="relative h-24">
                <img
                  src={image}
                  alt={`report_evidence_image_${index}`}
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    +{imageCount - 3}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <img
              key={index}
              src={image}
              alt={`report_evidence_image_${index}`}
              className="h-24 w-full object-cover"
            />
          );
        })}
      </div>
    );
  };

  // Get user's vote status
  const getUserVote = () => {
    if (!user || !report.voters || !Array.isArray(report.voters)) {
      return null;
    }

    const userVote = report.voters.find((voter) => voter.id === user.id);
    return userVote ? userVote.vote_type : null;
  };

  // Render vote icons based on user's vote
  const renderUserVoteIcon = () => {
    const userVote = getUserVote();

    if (userVote === 1) {
      return <ThumbsUp className="text-green-600 fill-green-200" size={14} />;
    } else if (userVote === -1) {
      return <ThumbsDown className="text-red-600 fill-red-200" size={14} />;
    }

    return null;
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col max-h-[480px]">
      {/* Report images */}
      <div className="shrink-0">{renderImages()}</div>

      {/* Report content */}
      <div className="p-4 grow overflow-hidden flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate">
              {report?.title || report.issue_type}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {report.location_address}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
              report.severity_level === "critical"
                ? "bg-red-100 text-red-800"
                : report.severity_level === "high"
                ? "bg-orange-100 text-orange-800"
                : report.severity_level === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {report.severity_level}
          </span>
        </div>

        <p className="text-gray-700 text-sm line-clamp-3 mb-3 grow">
          {report.description}
        </p>

        <div className="flex items-center gap-1.5 justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-4 truncate">
            <span className="truncate">{report.reporter.full_name}</span>
            <span>•</span>
            <span className="whitespace-nowrap">
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1">
              {renderUserVoteIcon()}
              <span className="flex items-center gap-1">
                <ThumbsUp className="text-gray-400" size={14} />
                <span>{report.upvotes || 0}</span>
              </span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="flex items-center gap-1">
                <ThumbsDown className="text-gray-400" size={14} />
                <span>{report.downvotes || 0}</span>
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 flex justify-between border-t border-gray-100">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              report.status === "resolved"
                ? "bg-green-100 text-green-800"
                : report.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {report.status === "in_progress"
              ? "In Progress"
              : report.status === "resolved"
              ? "Resolved"
              : "Pending"}
          </span>

          <button
            onClick={() => handleViewDetails(report)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer hover:bg-green-50 px-3 py-2 rounded-md transition-colors duration-200"
          >
            View Details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
