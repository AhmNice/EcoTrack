import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useOrganizationStore } from "../../store/organizationStore";

const AddOrganizationPage = () => {
  const navigate = useNavigate();
  const { org_id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(!!org_id); // For editing mode
  const { addOrganization, getOrganizationById, updateOrganization } =
    useOrganizationStore();

  // Check if we're in edit mode
  const isEditMode = !!org_id;
  console.log(isEditMode);
  console.log(location.state);

  // Form state with all fields
  const [formData, setFormData] = useState({
    name: "",
    organization_type: "",
    email: "",
    phone_number: "",
    description: "",
    location: "",
    website: "",
  });

  // Fetch organization data if in edit mode
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!isEditMode) return;

      try {
        setInitialLoading(true);
        // Try to get data from location state first (if coming from list)
        if (location.state?.organization) {
          setFormData(location.state.organization);
        } else if (getOrganizationById) {
          const organization = await getOrganizationById(org_id);
          if (organization) {
            setFormData({
              name: organization.name || "",
              organization_type: organization.organization_type || "",
              email: organization.email || "",
              phone_number: organization.phone_number || "",
              description: organization.description || "",
              location: organization.location || "",
              website: organization.website || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchOrganizationData();
  }, [org_id, isEditMode, location.state, getOrganizationById]);

  // Organization type options
  const typeOptions = [
    { value: "", label: "Select organization type" },
    { value: "government", label: "Government" },
    { value: "non_profit", label: "Non-Profit" },
    { value: "private", label: "Private Company" },
    { value: "municipal", label: "Municipal" },
    { value: "research", label: "Research" },
    { value: "community", label: "Community" },
    { value: "educational", label: "Educational" },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle textarea change (separate for better performance)
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    } else if (formData.name.length > 150) {
      newErrors.name = "Name cannot exceed 150 characters";
    }

    // Organization type validation
    if (!formData.organization_type) {
      newErrors.organization_type = "Organization type is required";
    }

    // Email validation (optional but validate format if provided)
    if (formData.email && formData.email.length > 150) {
      newErrors.email = "Email cannot exceed 150 characters";
    } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional)
    if (formData.phone_number && formData.phone_number.length > 20) {
      newErrors.phone_number = "Phone number cannot exceed 20 characters";
    }

    // Website validation (optional)
    if (formData.website) {
      if (formData.website.length > 200) {
        newErrors.website = "Website cannot exceed 200 characters";
      } else if (
        !formData.website.startsWith("http://") &&
        !formData.website.startsWith("https://")
      ) {
        newErrors.website = "Website must start with http:// or https://";
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare the data exactly as your database schema expects
      const organizationData = {
        name: formData.name.trim(),
        organization_type: formData.organization_type,
        email: formData.email ? formData.email.trim() : null,
        phone_number: formData.phone_number
          ? formData.phone_number.trim()
          : null,
        description: formData.description ? formData.description.trim() : null,
        location: formData.location ? formData.location.trim() : null,
        website: formData.website ? formData.website.trim() : null,
      };

      let response;
      if (isEditMode) {
        // Update existing organization
        if (!updateOrganization) {
          throw new Error("Update function not available");
        }
        response = await updateOrganization(org_id, organizationData);
        if (!response.success) return;
      } else {
        // Add new organization
        response = await addOrganization(organizationData);
      }

      if (response && !response.success) {
        throw new Error(response.message || "Failed to save organization");
      }

      // Show success and navigate back
      navigate("/admin/organizations");
    } catch (error) {
      console.error("Error saving organization:", error);
      setErrors({
        submit:
          error.message || "Failed to save organization. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      Object.values(formData).some(
        (value) => value && value.toString().trim() !== ""
      )
    ) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        navigate("/admin/organizations");
      }
    } else {
      navigate("/admin/organizations");
    }
  };

  // Loading state for edit mode
  if (isEditMode && initialLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading organization data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Organization" : "Add New Organization"}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? "Update organization information"
                  : "Add a new environmental organization"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Organization Information
            </h2>

            <div className="space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  maxLength={150}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {errors.name ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">
                          {errors.name}
                        </span>
                      </>
                    ) : formData.name ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          Valid name
                        </span>
                      </>
                    ) : null}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.name.length}/150 characters
                  </span>
                </div>
              </div>

              {/* Organization Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none ${
                    errors.organization_type
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  {errors.organization_type ? (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">
                        {errors.organization_type}
                      </span>
                    </div>
                  ) : formData.organization_type ? (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        Type selected
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleTextareaChange}
                    placeholder="Enter organization description, mission, and activities..."
                    rows="4"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                <div className="mt-2">
                  {formData.description ? (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        {formData.description.length} characters
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        Optional - describe the organization
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="organization@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      maxLength={150}
                    />
                  </div>
                  <div className="mt-2">
                    {errors.email ? (
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">
                          {errors.email}
                        </span>
                      </div>
                    ) : formData.email ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          Valid email
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.phone_number
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      maxLength={20}
                    />
                  </div>
                  <div className="mt-2">
                    {errors.phone_number ? (
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">
                          {errors.phone_number}
                        </span>
                      </div>
                    ) : formData.phone_number ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          Valid phone
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.location ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="mt-2">
                    {formData.location ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          Location added
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Optional - organization location
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.website ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="mt-2">
                    {errors.website ? (
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">
                          {errors.website}
                        </span>
                      </div>
                    ) : formData.website ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          Valid URL
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Optional - organization website
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              {(formData.name ||
                formData.organization_type ||
                formData.description) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {formData.name ? (
                            <span className="font-semibold text-gray-700 text-lg">
                              {getInitials(formData.name)}
                            </span>
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {formData.name || "Organization Name"}
                        </h4>
                        {formData.organization_type && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {typeOptions.find(
                              (t) => t.value === formData.organization_type
                            )?.label || formData.organization_type}
                          </span>
                        )}
                        {formData.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {truncateText(formData.description, 120)}
                          </p>
                        )}
                        <div className="mt-3 space-y-1">
                          {formData.location && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-2" />
                              {formData.location}
                            </div>
                          )}
                          {formData.email && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="w-3 h-3 mr-2" />
                              {formData.email}
                            </div>
                          )}
                          {formData.website && (
                            <div className="flex items-center text-xs text-blue-600">
                              <Globe className="w-3 h-3 mr-2" />
                              {formData.website
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode
                    ? "Ready to Update Organization"
                    : "Ready to Add Organization"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Fields marked with * are required
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    All other fields are optional
                  </p>
                </div>
                {errors.submit && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm text-red-700">
                        {errors.submit}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 text-white mr-2" />
                      {isEditMode ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? "Update Organization" : "Add Organization"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to truncate text
const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default AddOrganizationPage;
