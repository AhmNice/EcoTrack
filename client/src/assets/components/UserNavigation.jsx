import React, { useState, useEffect } from "react";
import {
  Bell,
  FileEdit,
  Folder,
  Globe2,
  Home,
  LogOut,
  MailQuestion,
  User,
  Menu,
  X,
  Shield,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

const UserNavigation = ({ isMobileOpen = false, onMobileToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuthStore();

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const userNavbarItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    {
      name: "Submit Report",
      icon: FileEdit,
      path: "/submit-report",
    },
    { name: "My Reports", icon: Folder, path: "/my-reports" },
    { name: "Community Report", icon: Globe2, path: "/community-reports" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Profile", icon: User, path: "/profile" },
   
  ];

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (!response.success) {
        return;
      }
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseMobile = () => {
    if (onMobileToggle) {
      onMobileToggle(false);
    }
  };
  const initials = (name) => {
    const split = name.split(" ");
    return `${split[0][0]}${split[1][0]}`;
  };

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        handleCloseMobile();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}


      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative
        w-[280px] md:w-64
        h-screen
        bg-white flex flex-col border-r border-gray-200
        transform transition-all duration-300 z-50
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-20" : "md:w-64"}
      `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="w-8 h-8 bg-linear-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-xl text-gray-900">EcoTrack</h2>
                <p className="text-xs text-gray-500">Environmental</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            className="p-2 transition-all rounded-md hover:bg-gray-100 md:hidden"
            onClick={handleCloseMobile}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Desktop Collapse Button */}
          {!isCollapsed && (
            <button
              className="p-2 transition-all rounded-md hover:bg-gray-100 hidden md:block"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4 md:hidden text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {userNavbarItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <NavLink
                to={item.path}
                key={item.name}
                onClick={handleCloseMobile}
                className={`
                  flex items-center gap-3 rounded-lg p-3 transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <div className="relative">
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium text-sm">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Expand Button for Collapsed State */}
        {isCollapsed && (
          <button
            className="m-3 p-2 transition-all rounded-md hover:bg-gray-100 hidden md:flex items-center justify-center"
            onClick={() => setIsCollapsed(false)}
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {/* User Profile & Logout */}
        <div className="border-t border-gray-100 p-3">
          {/* User Profile (only visible when expanded) */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-linear-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {initials(user.full_name)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user.full_name}
                </p>
                <p className="text-xs text-gray-500">Environmental Champion</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg p-3 transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="flex-1 text-left text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserNavigation;
