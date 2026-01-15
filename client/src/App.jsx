import { useState } from "react";
import reactLogo from "./assets/react.svg";
import EcoTrackLanding from "./pages/LandingPage";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./root/Layout";
import LogInPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./hook/ProtectedRoute";
import GuestRoute from "./hook/GuestRoute";
import { ToastContainer } from "react-toastify";
import OtpPage from "./pages/OtpPage";
import SubmitReport from "./pages/SubmitReport";
import MyReport from "./pages/MyReport";
import ReportDetails from "./pages/ReportDetailsPage";
import NotFound from "./pages/NotFound";
import CommunityReports from "./pages/CommunityReports";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/PasswordResetPage";
import RequestPasswordReset from "./pages/RequestPasswordResetPage";
import NotificationPage from "./pages/NotificationPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ActivityLog from "./pages/admin/ActivityLog";
import AdminReportsPage from "./pages/admin/Reports";
import AdminPostDetailsPage from "./pages/admin/ReportDetails";
import AdminUsersPage from "./pages/admin/Users";
import UserDetailsPage from "./pages/admin/UserDetails";
import AddUserPage from "./pages/admin/AddUser";
import OrganizationsPage from "./pages/admin/Organizations";
import AddOrganizationPage from "./pages/admin/AddNewOrg";
import OrgDetails from "./pages/admin/OrgDetails";
import IssuesTypePage from "./pages/admin/IssuesTypePage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<EcoTrackLanding />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/auth/login"
          element={
            <GuestRoute>
              <LogInPage />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <GuestRoute>
              <RequestPasswordReset />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/verify-account"
          element={
            <GuestRoute>
              <OtpPage />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole={["user", "admin", "super_admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute requiredRole={["user", "super_admin", "admin"]}>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-report"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <SubmitReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community-reports"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <CommunityReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <MyReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:report_id"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <ReportDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:user_id"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <UserDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/:report_id"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AdminPostDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizations"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <OrganizationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizations/:organization_id"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <OrgDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizations/new"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AddOrganizationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizations/edit/:org_id"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <AddOrganizationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute requiredRole={["admin", "super_admin"]}>
              <IssuesTypePage />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
