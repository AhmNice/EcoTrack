import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";

const initialState = {
  userStats: null,
  adminStats: null,
  dashboardStats: null,
  reportStats: null,
  userBreakdownStats: null,
  reportStatusStats: null,
  reportSeverityStats: null,
  systemStats: null,
  loading: false,
  error: null,
  success: null,
};

const ENDPOINT = "statistics";

export const useStatisticsStore = create((set, get) => ({
  ...initialState,

  fetchUserStats: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/${ENDPOINT}/user`, {
        user_id: userId,
      });

      if (response.data.success) {
        set({
          userStats: response.data.stats,
          success: "User statistics fetched successfully",
          loading: false,
        });
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch user stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch user statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching user stats:", error);
      return null;
    }
  },
  fetchAdminStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/admin`);

      if (response.data.success) {
        set({
          adminStats: response.data.data,
          success: "Admin statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch admin stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch admin statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching admin stats:", error);
      return null;
    }
  },
  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/dashboard`);

      if (response.data.success) {
        set({
          dashboardStats: response.data.data,
          success: "Dashboard statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        toast.error(response.data.message)
        throw new Error(response.data.message || "Failed to fetch dashboard stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch dashboard statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching dashboard stats:", error);
      return null;
    }
  },
  fetchReportStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/reports`);

      if (response.data.success) {
        set({
          reportStats: response.data.data,
          success: "Report statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch report stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch report statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching report stats:", error);
      return null;
    }
  },
  fetchUserBreakdownStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/users/breakdown`);

      if (response.data.success) {
        set({
          userBreakdownStats: response.data.data,
          success: "User breakdown statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch user breakdown stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch user breakdown statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching user breakdown stats:", error);
      return null;
    }
  },
  fetchReportStatusStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/reports/status`);

      if (response.data.success) {
        set({
          reportStatusStats: response.data.data,
          success: "Report status statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch report status stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch report status statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching report status stats:", error);
      return null;
    }
  },
  fetchReportSeverityStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/reports/severity`);

      if (response.data.success) {
        set({
          reportSeverityStats: response.data.data,
          success: "Report severity statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch report severity stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch report severity statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching report severity stats:", error);
      return null;
    }
  },
  fetchSystemStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${ENDPOINT}/system`);

      if (response.data.success) {
        set({
          systemStats: response.data.data,
          success: "System statistics fetched successfully",
          loading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch system stats");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch system statistics";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("❌ Error fetching system stats:", error);
      return null;
    }
  },
  clearStats: () => {
    set({
      userStats: null,
      adminStats: null,
      dashboardStats: null,
      reportStats: null,
      userBreakdownStats: null,
      reportStatusStats: null,
      reportSeverityStats: null,
      systemStats: null,
      error: null,
      success: null,
    });
  },
  setError: (error) => {
    set({ error });
  },
  clearError: () => {
    set({ error: null });
  },
}));
