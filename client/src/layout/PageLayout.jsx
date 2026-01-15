import React, { useState } from "react";
import UserNavigation from "../assets/components/UserNavigation";
import Header from "../assets/components/Header";
import { useAuthStore } from "../store/auth.store";
import AdminNavigation from "../assets/components/AdminNavigation";

const PageLayout = ({
  children,
  showHeaderStats = true,
  pageTitle = "Dashboard",
}) => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const initials = (name) => {
    const split = name.split(" ");
    return `${split[0][0]}${split[1][0]}`;
  };
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-green-50/30">
      {/* Main Layout Container */}
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        {user.role_name === "admin" || user.role_name === "super_admin" ? (
          <AdminNavigation
            isMobileOpen={isMobileMenuOpen}
            onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        ) : (
          <UserNavigation
            isMobileOpen={isMobileMenuOpen}
            onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        )}

        {/* Main Content Area - Takes remaining width */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Full width, outside max-width container */}
          <div className="w-full">
            <Header
              onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title={pageTitle}
              showStats={showHeaderStats}
              user={user}
            />
          </div>

          {/* Main Content Area - Scrollable */}
          <main className="flex-1 overflow-auto">
            {/* Content Container with max width */}
            <div className="h-full p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto h-full">
                {/* Optional: Page-specific header/breadcrumb */}

                {/* Page Content */}
                <div className="h-full">{children}</div>
              </div>
            </div>
          </main>

          {/* Footer - Also full width but content constrained */}
          <footer className="w-full bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-4 px-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-600">
                  © {new Date().getFullYear()} EcoTrack. All rights reserved.
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <a
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="/help"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Help Center
                  </a>
                  <span className="text-sm text-gray-400">v2.0.1</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
