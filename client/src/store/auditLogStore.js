import { create } from "zustand";
import api from "../lib/axios";

const initialState = {
  auditLogs: [],
  loadingAuditLog: false,
  auditLogError: null,
  auditLogSuccess: null,
};

const ENDPOINT = "audit-logs";

export const useAuditLogStore = create((set, get) => ({
  ...initialState,

  /* =====================================
     FETCH ALL AUDIT LOGS
  ===================================== */
  fetchAuditLogs: async (limit = 100) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.get(`/${ENDPOINT}`, {
        params: { limit },
      });

      if (response.data.success) {
        set({
          auditLogs: response.data.data,
          auditLogSuccess: "Audit logs fetched successfully",
          loadingAuditLog: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch audit logs");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch audit logs";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
        auditLogs: [],
      });
      console.error("❌ Error fetching audit logs:", error);
      return [];
    }
  },

  /* =====================================
     FETCH AUDIT LOGS BY USER
  ===================================== */
  fetchAuditLogsByUser: async (userId, limit = 50) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.get(`/${ENDPOINT}/user/${userId}`, {
        params: { limit },
      });

      if (response.data.success) {
        set({
          auditLogs: response.data.data,
          auditLogSuccess: "User audit logs fetched successfully",
          loadingAuditLog: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch user audit logs");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch user audit logs";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
        auditLogs: [],
      });
      console.error("❌ Error fetching user audit logs:", error);
      return [];
    }
  },

  /* =====================================
     FETCH AUDIT LOGS BY TABLE
  ===================================== */
  fetchAuditLogsByTable: async (tableName, limit = 50) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.get(`/${ENDPOINT}/table/${tableName}`, {
        params: { limit },
      });

      if (response.data.success) {
        set({
          auditLogs: response.data.data,
          auditLogSuccess: "Table audit logs fetched successfully",
          loadingAuditLog: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch table audit logs");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch table audit logs";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
        auditLogs: [],
      });
      console.error("❌ Error fetching table audit logs:", error);
      return [];
    }
  },

  /* =====================================
     FETCH AUDIT LOGS BY DATE RANGE
  ===================================== */
  fetchAuditLogsByDateRange: async (startDate, endDate, limit = 100) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.get(`/${ENDPOINT}/date-range/search`, {
        params: { start_date: startDate, end_date: endDate, limit },
      });

      if (response.data.success) {
        set({
          auditLogs: response.data.data,
          auditLogSuccess: "Date range audit logs fetched successfully",
          loadingAuditLog: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch audit logs by date range");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch audit logs by date range";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
        auditLogs: [],
      });
      console.error("❌ Error fetching date range audit logs:", error);
      return [];
    }
  },

  /* =====================================
     CREATE AUDIT LOG
  ===================================== */
  createAuditLog: async (auditLogData) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.post(`/${ENDPOINT}`, auditLogData);

      if (response.data.success) {
        set({
          auditLogSuccess: "Audit log created successfully",
          loadingAuditLog: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create audit log");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create audit log";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
      });
      console.error("❌ Error creating audit log:", error);
      return null;
    }
  },

  /* =====================================
     DELETE AUDIT LOG
  ===================================== */
  deleteAuditLog: async (logId) => {
    set({ loadingAuditLog: true, auditLogError: null });
    try {
      const response = await api.delete(`/${ENDPOINT}/${logId}`);

      if (response.data.success) {
        // Remove the deleted log from state
        const currentLogs = get().auditLogs;
        set({
          auditLogs: currentLogs.filter((log) => log.id !== logId),
          auditLogSuccess: "Audit log deleted successfully",
          loadingAuditLog: false,
        });
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete audit log");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete audit log";
      set({
        auditLogError: errorMessage,
        loadingAuditLog: false,
      });
      console.error("❌ Error deleting audit log:", error);
      return false;
    }
  },

  /* =====================================
     CLEAR AUDIT LOGS
  ===================================== */
  clearAuditLogs: () => {
    set({
      auditLogs: [],
      auditLogError: null,
      auditLogSuccess: null,
    });
  },

  /* =====================================
     SET ERROR
  ===================================== */
  setAuditLogError: (error) => {
    set({ auditLogError: error });
  },

  /* =====================================
     CLEAR ERROR
  ===================================== */
  clearAuditLogError: () => {
    set({ auditLogError: null });
  },
}))