import React, { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  FileWarning,
  AlertTriangle,
  Users,
  Building2,
  Bell,
  BarChart3,
  ClipboardList,

  LogOut,
  Menu,
  X,
  Shield,
  ChevronDown,
  User,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

const AdminNavigation = ({ isMobileOpen = false, onMobileToggle }) => {
  const { logoutUser, user } = useAuthStore();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNavbarItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,

    },
    // {
    //   label: "Roles & Permissions",
    //   path: "/admin/roles",
    //   icon: ShieldCheck,
    //   superAdminOnly: true,

    // },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: FileWarning,

    },
    {
      label: "Issue Types",
      path: "/admin/issues",
      icon: AlertTriangle,

    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,

    },
    {
      label: "Organizations",
      path: "/admin/organizations",
      icon: Building2,

    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,

    },

    {
      label: "Audit Logs",
      path: "/admin/audit-logs",
      icon: ClipboardList,

    },

  ];


  const filteredNavItems = adminNavbarItems.filter((item) => {
    if (user?.role_name !== "super_admin") {
      return item.superAdminOnly !== true;
    }
    return true;
  });

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
        ${
          isMobileOpen ? "translate-x-0 " : "-translate-x-full lg:translate-x-0"
        }
        fixed lg:sticky top-0  left-0 z-40 h-screen transition-all duration-300 ease-in-out
        w-64  shrink-0
      `}
      >
        <div className="h-full flex flex-col bg-linear-to-b from-green-900 via-emerald-900 to-green-950 text-white shadow-xl">
          {/* Logo & Header */}
          <div className="p-4 border-b border-emerald-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EcoTrack</h1>
                <p className="text-emerald-300 text-sm">
                  Administration Portal
                </p>
              </div>
            </div>
            <button
              onClick={onMobileToggle}
              className="lg:hidden fixed top-4 right-4 z-50 text-white p-2 hover:bg-green-400 rounded-md transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1  no_scrollbar overflow-y-auto p-4">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-2 py-2 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md"
                        : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                    }
                  `}
                  onClick={() => isMobileOpen && onMobileToggle()}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        item.badge ? "relative" : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`
                      px-2 py-1 text-xs font-semibold rounded-full
                      ${
                        item.label === "Notifications"
                          ? "bg-red-500 text-white"
                          : "bg-emerald-800 text-emerald-300"
                      }
                    `}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout & Footer */}
          <div className="p-4 border-t border-emerald-800 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 transition-all duration-200 group border border-red-800/50"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>

            <div className="text-center text-xs text-emerald-400">
              <p>Admin Portal v2.0</p>
              <p>© 2024 EcoTrack Administration</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Collapsed Sidebar (Desktop) */}
      {isCollapsed && (
        <aside className="hidden lg:block sticky top-0 h-screen w-20 flex-shrink-0">
          <div className="h-full flex flex-col bg-linear-to-b from-green-900 to-emerald-900 border-r border-emerald-800">
            {/* Logo */}
            <div className="p-4 border-b border-emerald-800">
              <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Navigation Icons */}
            <nav className="flex-1 p-4 space-y-2">
              {filteredNavItems.slice(0, 8).map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-center p-3 rounded-xl relative transition-all duration-200
                    ${
                      isActive
                        ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md"
                        : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                    }
                  `}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Help & Logout Icons */}
            <div className="p-4 space-y-2">
              <button
                onClick={() => navigate("/admin/help")}
                className="w-full flex items-center justify-center p-3 rounded-xl text-emerald-100 hover:bg-emerald-800/50 hover:text-white transition-colors"
                title="Help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default AdminNavigation;
