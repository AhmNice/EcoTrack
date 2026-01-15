import React, { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import {
  MapPin,
  AlertCircle,
  FileText,
  Camera,
  Upload,
  Loader2,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Building,
  Map,
} from "lucide-react";
import { useIssuesStore } from "../store/issueStore";
import { useGeolocation } from "../hook/useGeolocation";
import { useReportStore } from "../store/reportStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubmitReport = () => {
  const navigate = useNavigate();

  // State for user input fields
  const [userInput, setUserInput] = useState({
    title: "",
    issue_type: "",
    description: "",
    severity: "medium",
  });

  // State for government jurisdiction data
  const [governmentData, setGovernmentData] = useState({
    state: "",
    local_government: "",
  });

  // State for location data (auto-populated and not cleared on submit)
  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    location_address: "",
  });

  // State for images
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Hooks
  const {
    location,
    address,
    loading: geoLoading,
    fetchLocation,
    getAddress,
  } = useGeolocation();
  const { createReport } = useReportStore();
  const { getAllIssues, issues } = useIssuesStore();

  // Fetch issues on mount
  useEffect(() => {
    const fetchIssues = async () => {
      await getAllIssues();
    };
    fetchIssues();
  }, []);
  console.log(issues)

  // Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Update location data when geolocation is available
  useEffect(() => {
    if (location.latitude && location.longitude) {
      setLocationData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      getAddress();
    }
  }, [location.latitude, location.longitude]);

  // Update address and extract government data when available
  useEffect(() => {
    if (address) {
      // Set the full address
      setLocationData((prev) => ({
        ...prev,
        location_address: `${address.city || ""}, ${address.country || ""}`.trim(),
      }));

      // Extract government jurisdiction data from address
      // This assumes your geolocation hook returns state/province and local government info
      // You might need to adjust based on your actual API response structure
      const state = address.state || address.province || address.region || "";
      const localGovernment = address.county || address.district || address.municipality || address.city || "";

      setGovernmentData({
        state: state,
        local_government: localGovernment,
      });
    }
  }, [address]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state" || name === "local_government") {
      setGovernmentData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserInput((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle severity button clicks
  const handleSeverityChange = (severity) => {
    setUserInput((prev) => ({ ...prev, severity }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length <= 5) {
      setImages((prev) => [...prev, ...validFiles]);
    } else {
      toast.error("Maximum 5 images allowed");
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userInput.title.trim()) {
      newErrors.title = "Title is required";
    } else if (userInput.title.length < 10) {
      newErrors.title = "Title should be at least 10 characters";
    }

    if (!userInput.issue_type) {
      newErrors.issue_type = "Please select an issue type";
    }

    if (!userInput.description.trim()) {
      newErrors.description = "Description is required";
    } else if (userInput.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!governmentData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!governmentData.local_government.trim()) {
      newErrors.local_government = "Local Government is required";
    }

    if (!locationData.latitude || !locationData.longitude) {
      newErrors.location =
        "Location coordinates are required. Please wait for detection or enable location services";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append user input
    formData.append("title", userInput.title);
    formData.append("issue_type", userInput.issue_type);
    formData.append("description", userInput.description);
    formData.append("severity_level", userInput.severity);

    // Append government jurisdiction data
    formData.append("state", governmentData.state);
    formData.append("local_government", governmentData.local_government);

    // Append location data (auto-populated)
    formData.append("latitude", locationData.latitude);
    formData.append("longitude", locationData.longitude);
    formData.append("location_address", locationData.location_address);

    // Append images
    images.forEach((image) => {
      formData.append("files", image);
    });

    setIsLoading(true);
    try {
      const response = await createReport(formData);

      if (response.success) {
        // Reset only user input fields, keep location and government data
        setUserInput({
          title: "",
          issue_type: "",
          description: "",
          severity: "medium",
        });
        setImages([]);
        setSuccessMessage("Report submitted successfully!");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Severity options
  const severityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: Info,
      description: "Minor issue, not urgent",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: AlertCircle,
      description: "Moderate issue, needs attention",
    },
    {
      value: "high",
      label: "High",
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: AlertTriangle,
      description: "Serious issue, requires prompt action",
    },
    {
      value: "critical",
      label: "Critical",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: AlertTriangle,
      description: "Emergency, requires immediate action",
    },
  ];

  return (
    <PageLayout pageTitle="Submit Report">
      <div className="max-w-4xl mx-auto">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Submit Environmental Report
                </h1>
                <p className="text-gray-600">
                  Help protect the environment by reporting issues in your
                  community
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Report Title *
                </label>
                <span className="text-xs text-gray-500">
                  {userInput.title.length}/100 characters
                </span>
              </div>
              <input
                type="text"
                name="title"
                value={userInput.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g., Illegal waste dumping near Central Park causing health hazards"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Be specific and descriptive. Include location and issue type in
                the title.
              </p>
            </div>

            {/* Issue Type & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Issue Type */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Issue Type *
                </label>
                <div className="relative">
                  <select
                    name="issue_type"
                    value={userInput.issue_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none ${
                      errors.issue_type ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select an issue type</option>
                    {issues.map((issue) => (
                      <option key={issue.id} value={issue.id}>
                        {issue.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.issue_type && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.issue_type}
                  </p>
                )}
              </div>

              {/* Severity Level */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Severity Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {severityOptions.map((level) => {
                    const Icon = level.icon;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleSeverityChange(level.value)}
                        className={`py-3 px-2 rounded-lg border flex flex-row items-center gap-1 transition-all ${
                          userInput.severity === level.value
                            ? `${level.color} ring-2 ring-offset-1 ring-opacity-50`
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {level.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  {
                    severityOptions.find((l) => l.value === userInput.severity)
                      ?.description
                  }
                </p>
              </div>
            </div>

            {/* Government Jurisdiction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* State */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  State *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="state"
                    value={governmentData.state}
                    onChange={handleChange}
                    placeholder="e.g., Lagos State"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.state ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.state && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.state}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Enter the state where the issue is located
                </p>
              </div>

              {/* Local Government */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Local Government *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="local_government"
                    value={governmentData.local_government}
                    onChange={handleChange}
                    placeholder="e.g., Ikeja Local Government"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.local_government ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.local_government && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.local_government}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Enter the local government area
                </p>
              </div>
            </div>

            {/* GPS Location */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                GPS Location Coordinates *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={
                    locationData.latitude && locationData.longitude
                      ? `${locationData.latitude}, ${locationData.longitude}`
                      : (geoLoading
                          ? "Detecting coordinates..."
                          : "Coordinates not available")
                  }
                  readOnly
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.location
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-gray-100"
                  }`}
                />
                {!geoLoading && locationData.latitude && (
                  <button
                    type="button"
                    onClick={fetchLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Refresh
                  </button>
                )}
              </div>
              {errors.location && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
              {geoLoading && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting your coordinates...
                </p>
              )}
              <p className="text-xs text-gray-500">
                Your GPS coordinates are automatically detected. Make sure
                location services are enabled.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Detailed Description *
                </label>
                <span className="text-xs text-gray-500">
                  {userInput.description.length}/2000 characters
                </span>
              </div>
              <textarea
                name="description"
                value={userInput.description}
                onChange={handleChange}
                maxLength={2000}
                placeholder="Describe the issue in detail. Include:
• Exact location details
• When you first noticed the issue
• How it's affecting the community
• Any immediate dangers or hazards
• What you think should be done"
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500">
                The more details you provide, the easier it will be for
                authorities to take action.
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Upload Evidence {images.length > 0 && `(${images.length}/5)`}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                <div className="text-gray-500 mb-4">
                  <Camera className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">
                    Drag & drop photos or click to upload
                  </p>
                  <p className="text-sm mt-1">
                    Maximum 5 images, 5MB each. Supported formats: JPG, PNG,
                    WebP
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    images.length >= 5
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {images.length >= 5
                    ? "Maximum 5 images reached"
                    : "Choose Files"}
                </label>
              </div>

              {/* Preview Images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Selected Images ({images.length}/5)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-8 border-t border-gray-200">
              {errors.submit && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">{errors.submit}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !locationData.latitude}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Submitting report...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Submit Report
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Important Information
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>
                      • Reports are reviewed within 24-48 hours by local
                      authorities
                    </li>
                    <li>• Provide accurate government jurisdiction for proper routing</li>
                    <li>• Include clear photos as evidence when possible</li>
                    <li>
                      • You can track your report status in "My Reports" section
                    </li>
                    <li>
                      • False or misleading reports may lead to account
                      suspension
                    </li>
                    <li>
                      • For emergencies, contact local authorities directly
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmitReport;