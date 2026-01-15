import React, { useState, useEffect, useRef } from "react";
import { useOrganizationStore } from "../../../store/organizationStore";
import {
  Search,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Check,
  ChevronRight,
  UserPlus,
} from "lucide-react";

const OrgModal = ({
  setSelectedOrg,
  selectedOrg: propSelectedOrg,
  onClose,
  onAssign,
}) => {
  const { getAllOrganization, organizations } = useOrganizationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrg, setFilteredOrg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [internalSelectedOrg, setInternalSelectedOrg] = useState(null);

  const modalRef = useRef(null);

  // Use propSelectedOrg or internalSelectedOrg
  const selectedOrg = propSelectedOrg || internalSelectedOrg;

  // Load organizations on mount
  useEffect(() => {
    const loadOrganizations = async () => {
      if (organizations.length > 0) return;
      setLoading(true);
      await getAllOrganization();
      setLoading(false);
    };
    loadOrganizations();
  }, [getAllOrganization]);

  // Filter organizations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrg(organizations.slice(0, 10));
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = organizations
      .filter(
        (org) =>
          org.name?.toLowerCase().includes(searchLower) ||
          org.email?.toLowerCase().includes(searchLower) ||
          org.phone_number?.includes(searchTerm) ||
          org.location?.toLowerCase().includes(searchLower) ||
          org.organization_type?.toLowerCase().includes(searchLower)
      )
      .slice(0, 10);

    setFilteredOrg(filtered);
  }, [searchTerm, organizations]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle organization selection
  const handleSelectOrg = (org) => {
    setSelectedOrgId(org.id);
    setSelectedOrg(org)
    setInternalSelectedOrg(org);
  };

  // Handle assign organization
  const handleAssign = () => {
    if (selectedOrg) {
      if (setSelectedOrg) {
        setSelectedOrg(selectedOrg);
      }
      console.log(selectedOrg);
      if (onAssign) {
        onAssign();
      }
      onClose();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Get organization initials
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get organization type color
  const getTypeColor = (type) => {
    switch (type) {
      case "government":
        return "bg-blue-100 text-blue-800";
      case "non_profit":
        return "bg-green-100 text-green-800";
      case "private":
        return "bg-purple-100 text-purple-800";
      case "municipal":
        return "bg-orange-100 text-orange-800";
      case "research":
        return "bg-red-100 text-red-800";
      case "community":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format organization type
  const formatType = (type) => {
    if (!type) return "Unknown";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Enter" && selectedOrg) {
        handleAssign();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedOrg, onClose]);

  return (
    <div className="fixed inset-0 z-50  h-screen bg-black/50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="rounded-xl bg-white w-full max-w-md h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedOrg
                  ? `Selected: ${selectedOrg.name}`
                  : "Select Organization"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedOrg
                  ? "Click assign to confirm selection"
                  : "Search and select an organization"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, location, or type..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                title="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto  md:h-[200px]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">Loading organizations...</p>
            </div>
          ) : filteredOrg.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "No organizations found"
                  : "No organizations available"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try a different search term"
                  : "There are no organizations in the system"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrg.map((org) => (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedOrgId === org.id
                      ? "bg-green-50 border-l-4 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedOrgId === org.id
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              selectedOrgId === org.id
                                ? "text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            {getInitials(org.name)}
                          </span>
                        </div>
                      </div>

                      {/* Organization Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4
                            className={`font-medium truncate ${
                              selectedOrgId === org.id
                                ? "text-green-800"
                                : "text-gray-900"
                            }`}
                          >
                            {org.name}
                          </h4>
                          {org.organization_type && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                selectedOrgId === org.id
                                  ? "bg-green-200 text-green-800"
                                  : getTypeColor(org.organization_type)
                              }`}
                            >
                              {formatType(org.organization_type)}
                            </span>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1">
                          {org.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{org.email}</span>
                            </div>
                          )}
                          {org.phone_number && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span>{org.phone_number}</span>
                            </div>
                          )}
                          {org.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{org.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Preview */}
                        {org.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {org.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Select Indicator */}
                    <div className="flex-shrink-0 ml-2">
                      {selectedOrgId === org.id ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Selection Confirmation */}
                  {selectedOrgId === org.id && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center text-sm text-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        <span>Selected - click "Assign" below to confirm</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - FIXED WITH ALL BUTTONS VISIBLE */}
        <div className="p-4  border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              {filteredOrg.length > 0 ? (
                <span>
                  {selectedOrg
                    ? `1 selected of ${filteredOrg.length} shown`
                    : `Showing ${filteredOrg.length} organization${
                        filteredOrg.length !== 1 ? "s" : ""
                      }`}
                </span>
              ) : (
                <span>No results</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors min-w-[80px]"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                disabled={!selectedOrg}
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors min-w-[140px] ${
                  selectedOrg
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgModal;
