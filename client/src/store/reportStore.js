import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";

const initialState = {
  reports: [],
  allReports: [],
  loadingReport: false,
  reportError: null,
  reportSuccess: null,
};

const ENDPOINT = "/reports";

export const useReportStore = create((set, get) => ({
  ...initialState,

  createReport: async (payload) => {
    try {
      set({
        loadingReport: true,
        reportError: null,
        reportSuccess: null,
      });

      const { data } = await api.post(
        `${ENDPOINT}/create-report`,
        payload
      );
      if (!data.success) {
        toast.error(data.message)
        set({ loadingReport: false, reportError: data.message, reportSuccess: null })
        return
      }
      toast.success(data.message)
      set((state) => ({
        reports: [data.report, ...state.reports],
        loadingReport: false,
        reportSuccess: "Report created successfully",
      }));

      return { success: true, data };

    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create report";

      set({
        loadingReport: false,
        reportError: message,
      });

      toast.error(message)
      throw error
    } finally {
      set({ loadingReport: false })
    }
  },
  getAllReports: async () => {
    set({ loadingReport: true, reportError: null, reportSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/all-reports`)
      if (!data.success) {
        set({ loadingReport: false, reportError: data.message, reportSuccess: null })
        toast.error(data.message)
        return
      }
      set({ loadingReport: false, reportSuccess: data.message, reportError: null, allReports: data.reports })
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get your reports";

      set({
        loadingReport: false,
        reportError: message,
      });

      toast.error(message)
      throw error
    } finally {
      set({ loadingReport: false })
    }
  },
  fetchMyReports: async () => {
    set({ loadingReport: true, reportError: null, reportSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/my-reports`)
      if (!data.success) {
        set({ loadingReport: false, reportError: data.message, reportSuccess: null })
        toast.error(data.message)
        return
      }
      set({ loadingReport: false, reportSuccess: data.message, reportError: null, reports: data.reports })
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get your reports";

      set({
        loadingReport: false,
        reportError: message,
      });

      toast.error(message)
      throw error
    } finally {
      set({ loadingReport: false })
    }
  },
  getReport: async (report_id) => {
    try {
      const { data } = await api.get(`${ENDPOINT}/get-report/${report_id}`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false, message: data.message }
      }
      return { success: true, message: data.message, report: data.report }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get your reports";

      set({
        loadingReport: false,
        reportError: message,
      });

      toast.error(message)
      throw error
    }
  },
  deleteReport: async (report_id) => {
    try {
      const { data } = await api.delete(`${ENDPOINT}/delete-my-report/${report_id}`)
      console.log(data)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }

      toast.success(data.message)

      return { success: true }
    } catch (error) {
      console.log(error)
      const message =
        error.response?.data?.message || error.message || "Failed to delete your reports";

      set({
        loadingReport: false,
        reportError: message,
      });

      toast.error(message)
      throw error
    }
  },
  assignReport: async ({ report_id, org_id }) => {
    set({
      loadingReport: true,
      reportError: null,
      reportSuccess: null,
    });

    try {
      const { data } = await api.patch(
        `${ENDPOINT}/assign-report/${report_id}/${org_id}`
      );

      if (!data.success) {
        toast.error(data.message);
        set({
          loadingReport: false,
          reportError: data.message,
          reportSuccess: null,
        });
        return { success: false };
      }

      toast.success(data.message);

      set({
        loadingReport: false,
        reportError: null,
        reportSuccess: data.message,
      });

      return {
        success: true,
        report: data.report,
      };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "An error occurred";

      toast.error(errMsg);

      set({
        loadingReport: false,
        reportError: errMsg,
        reportSuccess: null,
      });

      console.error(error);
      return { success: false };
    }
  },
  resolveReport: async (payload) => {
    set({ loadingReport: true, reportError: null, reportSuccess: null })
    try {
      const { data } = await api.patch(`${ENDPOINT}/update-report/${payload.report_id}`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingReport: false, reportError: data.message, reportSuccess: null })
        return { success: false }
      }
      toast.success(data.message)
      set({ loadingReport: false, reportError: null, reportSuccess: data.message })
      return { success: true }

    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingReport: false,
        reportError: errMsg,
        reportSuccess: null,
      });
      console.error(error);
      return { success: false }

    }
  },
  massResolveReport: async (reportIds) => {

  },
  resetReportState: () =>
    set({
      loadingReport: false,
      reportError: null,
      reportSuccess: null,
    }),
}));
