import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import {
  Search,
  Filter,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Eye,
} from "lucide-react";
import { useOrganizationStore } from "../../store/organizationStore";
import AddOrgUser from "../../assets/components/modal/AddOrgUser";

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const {
    getAllOrganization,

    organizations,
    deleteOrganization,
  } = useOrganizationStore();
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddUser, setShowAddUser] = useState(false);
  const handleShowAddUser = () => {
    setShowAddUser((prev) => !prev);
  };

  console.log(organizations);
  // Organization type options
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "government", label: "Government" },
    { value: "non_profit", label: "Non-Profit" },
    { value: "private", label: "Private Company" },
    { value: "municipal", label: "Municipal" },
    { value: "research", label: "Research" },
    { value: "community", label: "Community" },
    { value: "educational", label: "Educational" },
  ];

  // Get organization type color
  const getTypeColor = (type) => {
    switch (type) {
      case "government":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "non_profit":
        return "bg-green-100 text-green-800 border border-green-200";
      case "private":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "municipal":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "research":
        return "bg-red-100 text-red-800 border border-red-200";
      case "community":
        return "bg-cyan-100 text-cyan-800 border border-cyan-200";
      case "educational":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Format organization type for display
  const formatType = (type) => {
    if (!type) return "Unknown";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Sort organizations
  const sortOrganizations = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...organizations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (org.email &&
            org.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (org.phone_number && org.phone_number.includes(searchTerm)) ||
          (org.description &&
            org.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (org.location &&
            org.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (org) => org.organization_type === selectedType
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (sortConfig.direction === "asc") {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

    setFilteredOrganizations(filtered);
  }, [organizations, searchTerm, selectedType, sortConfig]);

  // Load data
  useEffect(() => {
    const fetchOrganization = async () => {
      setLoading(true);
      try {
        await getAllOrganization();
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrgs = filteredOrganizations.slice(startIndex, endIndex);

  // Handle organization selection
  const handleSelectOrg = (id) => {
    if (selectedOrgs.includes(id)) {
      setSelectedOrgs(selectedOrgs.filter((orgId) => orgId !== id));
    } else {
      setSelectedOrgs([...selectedOrgs, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedOrgs.length === currentOrgs.length) {
      setSelectedOrgs([]);
    } else {
      setSelectedOrgs(currentOrgs.map((org) => org.id));
    }
  };

  // Handle actions
  const handleViewOrganization = (organization) => {
    navigate(`/admin/organizations/${organization.id}`, {
      state: { organization },
    });
  };

  const handleEditOrganization = (organization) => {
    navigate(`/admin/organizations/edit/${organization.id}`, {
      state: { organization },
    });
  };

  const handleDeleteOrganization = async (org) => {
    if (window.confirm(`Are you sure you want to delete ${org.name}?`)) {
      console.log(`Delete organization: ${org.id}`);
      try {
        const response = await deleteOrganization(org.id);
      } catch (error) {}
    }
  };

  const handleBulkAction = (action) => {
    console.log(`${action} selected organizations:`, selectedOrgs);
    // Implement bulk action logic
  };

  const handleAddOrganization = () => {
    navigate("/admin/organizations/new");
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="inline-block animate-spin h-10 w-10 text-green-600" />
              <p className="mt-3 text-gray-600">Loading organizations...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {showAddUser && (
        <AddOrgUser orgs={organizations} onClose={() => handleShowAddUser()} />
      )}
      <div className="space-y-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
            <p className="text-gray-600 mt-1">
              Manage environmental organizations and agencies
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                handleShowAddUser();
              }}
              className="inline-flex items-center px-4 py-2 bg-gray-100 border-2 border-gray-200 hover:bg-green-600 hover:border-green-600 hover:text-white rounded-lg text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add organization user"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization User
            </button>
            <button
              onClick={handleAddOrganization}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Organizations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.length}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Description</p>
                <p className="text-2xl font-bold text-green-600">
                  {organizations.filter((o) => o.description).length}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Location</p>
                <p className="text-2xl font-bold text-purple-600">
                  {organizations.filter((o) => o.location).length}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Website</p>
                <p className="text-2xl font-bold text-orange-600">
                  {organizations.filter((o) => o.website).length}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={
                    selectedOrgs.length === currentOrgs.length &&
                    currentOrgs.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedOrgs.length > 0
                    ? `${selectedOrgs.length} selected`
                    : `${filteredOrganizations.length} organizations`}
                </span>
                {selectedOrgs.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="text-sm text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedOrgs.length === currentOrgs.length &&
                        currentOrgs.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => sortOrganizations("name")}
                  >
                    <div className="flex items-center">
                      Organization
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact & Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => sortOrganizations("organization_type")}
                  >
                    <div className="flex items-center">
                      Type
                      {sortConfig.key === "organization_type" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrgs.includes(org.id)}
                        onChange={() => handleSelectOrg(org.id)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="font-semibold text-gray-700">
                            {getInitials(org.name)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                          {org.description && (
                            <div className="text-xs text-gray-500 mt-1 max-w-xs">
                              {truncateText(org.description, 80)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          {org.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                              <span className="text-gray-900 truncate">
                                {org.email}
                              </span>
                            </div>
                          )}
                          {org.phone_number && (
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                              <span className="text-gray-900">
                                {org.phone_number}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          {org.location && (
                            <div className="flex items-center text-xs">
                              <MapPin className="w-3 h-3 text-gray-400 mr-2 shrink-0" />
                              <span className="text-gray-600 truncate">
                                {org.location}
                              </span>
                            </div>
                          )}
                          {org.website && (
                            <div className="flex items-center text-xs">
                              <Globe className="w-3 h-3 text-gray-400 mr-2 shrink-0" />
                              <a
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 truncate"
                              >
                                {org.website
                                  .replace(/^https?:\/\//, "")
                                  .replace(/^www\./, "")}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          org.organization_type
                        )}`}
                      >
                        {formatType(org.organization_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditOrganization(org)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg"
                          title="Edit organization"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrganization(org)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                          title="Delete organization"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewOrganization(org)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-red-50 rounded-lg"
                          title="Delete organization"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredOrganizations.length)} of{" "}
                  {filteredOrganizations.length} organizations
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === pageNum
                            ? "bg-green-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No results */}
        {filteredOrganizations.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "No organizations have been added yet."}
            </p>
            <button
              onClick={handleAddOrganization}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default OrganizationsPage;
