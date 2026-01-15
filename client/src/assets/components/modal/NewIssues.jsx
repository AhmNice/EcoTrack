import React, { useState } from "react";
import {
  X,
  AlertCircle,
  Tag,
  FileText,
  Save,
  Loader2,
  CheckCircle,
  Plus,
  Sparkles,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";
import { useIssuesStore } from "../../../store/issueStore";

const NewIssueModal = ({ isOpen, onClose, onSuccess, toEdit }) => {
  const { addIssueType, updateIssueType } = useIssuesStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (toEdit) {
        // Initialize with edit data
        setFormData({
          name: toEdit.name || "",
          description: toEdit.description || "",
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, toEdit]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Issue type name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const issueData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      };

      let response;

      if (toEdit) {
        // Edit existing issue type
        issueData.id = toEdit.id; // Assuming toEdit has an id property
        response = await updateIssueType(issueData);
      } else {
        // Create new issue type
        response = await addIssueType(issueData);
      }

      if (response.success) {
        toast.success(
          toEdit
            ? "Issue type updated successfully!"
            : "Issue type created successfully!"
        );

        if (onSuccess) {
          onSuccess(response.data || issueData);
        }

        onClose();
      } else {
        // Handle specific errors
        if (response.message?.includes("unique constraint")) {
          setErrors({ name: "An issue type with this name already exists" });
        } else {
          toast.error(
            response.message ||
              (toEdit
                ? "Failed to update issue type"
                : "Failed to create issue type")
          );
        }
      }
    } catch (error) {
      console.error(
        `Error ${toEdit ? "updating" : "creating"} issue type:`,
        error
      );
      toast.error(
        toEdit ? "Failed to update issue type" : "Failed to create issue type"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!toEdit;

  return (
    <div className="absolute  z-50 top-0 left-0 w-full h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4" onKeyDown={handleKeyDown}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="relative bg-linear-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 bg-linear-to-br ${
                    isEditMode
                      ? "from-green-500 to-green-700"
                      : "from-green-500 to-emerald-500"
                  } rounded-lg flex items-center justify-center mr-3`}
                >
                  {isEditMode ? (
                    <Edit className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isEditMode ? "Edit Issue Type" : "Create New Issue Type"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isEditMode
                      ? "Update the details of this issue type"
                      : "Define a new type of environmental issue"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 pt-5">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Issue Type Name */}
              <div>
                <label className=" text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  Issue Type Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Air Pollution, Waste Disposal"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  maxLength={100}
                  autoFocus
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {errors.name ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">{errors.name}</span>
                      </div>
                    ) : formData.name ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {formData.name.length >= 3
                            ? "Valid name"
                            : "Minimum 3 characters"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.name.length}/100
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className=" text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  Description
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this issue type. Include examples, common causes, and impacts..."
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none outline-none transition-all ${
                      errors.description
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    maxLength={1000}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {formData.description.length}/1000
                  </div>
                </div>
                <div className="mt-2">
                  {errors.description && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{errors.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Counter */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">
                    {formData.name.length + formData.description.length}
                  </span>
                  <span> characters total</span>
                </div>
                <div>
                  <span className="font-medium">1100</span>
                  <span> characters max</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-gray-200">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative cursor-pointer flex items-center px-5 py-2.5 bg-linear-to-r ${
                      isEditMode
                        ? "from-green-600 to-green-900 hover:from-green-700 hover:to-green-700"
                        : "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    } text-white rounded-xl font-medium transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditMode ? "Update Issue Type" : "Create Issue Type"}
                      </>
                    )}
                  </button>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="mt-3 mb-2 text-xs text-gray-400 text-center">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">
                    Enter
                  </kbd>{" "}
                  to submit
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Backdrop Click Handler */}
        <div
          className="fixed inset-0 -z-10"
          onClick={onClose}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default NewIssueModal;
