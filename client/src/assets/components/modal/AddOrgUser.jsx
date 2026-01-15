import React, { useEffect, useState } from "react";
import {
  Search,
  X,
  UserPlus,
  User,
  Mail,
  Shield,
  Building2,
  Check,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import { useOrganizationStore } from "../../../store/organizationStore";

const AddOrgUser = ({ orgs, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { allUsers, getAllUsers } = useAuthStore();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        await getAllUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);
  const [loading, setLoading] = useState(false);
  const { addUserToOrg } = useOrganizationStore();
  const onAdd = async () => {
    const payload = {
      user_id: selectedUser.id,
      organization_id: selectedOrg.id,
    };
    setLoading(true);
    try {
      const response = await addUserToOrg(payload);
      if (!response.success) return;
      onClose();
    } catch (error) {
      console.log;
    } finally {
      setLoading(false);
    }
  };
  // Filter organizations based on search
  useEffect(() => {
    if (orgs && Array.isArray(orgs)) {
      const filtered = orgSearchQuery
        ? orgs.filter(
            (org) =>
              org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
              (org.email &&
                org.email.toLowerCase().includes(orgSearchQuery.toLowerCase()))
          )
        : orgs;
      setFilteredOrgs(filtered);
    }
  }, [orgs, orgSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError("");
    setSelectedUser(null);

    try {
      // Filter users based on search query
      const filteredUsers = Array.isArray(allUsers)
        ? allUsers.filter((user) => {
            if (!user) return false;

            const emailMatch = user.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
            const nameMatch = user.full_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
            const usernameMatch = user.username
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());

            return emailMatch || nameMatch || usernameMatch;
          })
        : [];

      setSearchResults(filteredUsers);

      if (filteredUsers.length === 0) {
        setError("No users found with that email, name, or username.");
      }
    } catch (err) {
      setError("Failed to search users.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery(user.email || user.username || ""); // Show selected user's email or username
  };

  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setError("Please select a user first.");
      return;
    }

    if (!selectedOrg) {
      setError("Please select an organization first.");
      return;
    }

    const userData = {
      user: selectedUser,
      organization: selectedOrg,
      addedAt: new Date().toISOString(),
    };

    onAdd(userData);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setError("");
  };

  const handleClearOrg = () => {
    setSelectedOrg(null);
    setOrgSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClear();
    }
    if (e.key === "Enter" && !selectedUser) {
      handleSearch(e);
    }
  };

  // Loading state
  if (loadingUsers) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Add User to Organization
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrg
                    ? `Adding to: ${selectedOrg.name}`
                    : "Select an organization first"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Organization Selection */}
            {!selectedOrg ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={orgSearchQuery}
                      onChange={(e) => setOrgSearchQuery(e.target.value)}
                      placeholder="Search organizations..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {filteredOrgs.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredOrgs.map((org) => (
                      <button
                        key={org.id || org._id}
                        type="button"
                        onClick={() => handleSelectOrg(org)}
                        className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              {org.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {org.organization_type && (
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full mr-2">
                                  {org.organization_type}
                                </span>
                              )}
                              {org.email && (
                                <span className="text-gray-500">
                                  {org.email}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {orgSearchQuery
                        ? "No organizations found matching your search."
                        : "No organizations available."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Selected Organization */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          {selectedOrg.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrg.email || selectedOrg.organization_type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearOrg}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                      aria-label="Change organization"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (e.target.value === "") {
                            setSearchResults([]);
                            setError("");
                          }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search user by email, name, or username..."
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-100"
                        disabled={!!selectedUser || isSearching}
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label="Clear search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {!selectedUser && (
                      <button
                        type="submit"
                        disabled={!searchQuery.trim() || isSearching}
                        className="px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center whitespace-nowrap"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Search
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 mr-1">⚠️</span>
                      {error}
                    </p>
                  )}
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && !selectedUser && (
                  <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-700">
                        Found {searchResults.length} user
                        {searchResults.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id || user._id}
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">
                                {user.full_name || user.username}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected User */}
                {selectedUser && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {selectedUser.full_name || selectedUser.username}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedUser.email}
                          </p>
                          {selectedUser.role && (
                            <div className="flex items-center mt-1">
                              <Shield className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {selectedUser.role}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleClear}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                        aria-label="Remove selected user"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedUser || !selectedOrg}
                className="px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <span className="flex gap-1 items-center ">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Adding user
                  </span>
                ) : (
                  <span className="flex gap-1 items-center ">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User to Organization
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrgUser;
