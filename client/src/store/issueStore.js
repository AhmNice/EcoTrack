import { toast } from 'react-toastify'
import api from '../lib/axios'
import { create } from 'zustand'
const initialState = {
  issues: [],
  issuesError: null,
  issuesSuccess: null,
  loadingIssues: false,
  creatingIssue: false,
  updatingIssue: false,
  deletingIssue: false,
}
const ENDPOINT = '/issues'

export const useIssuesStore = create((set, get) => ({
  ...initialState,
  getAllIssues: async () => {
    set({ loadingIssues: true, issuesError: null, issuesSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/all`)
      if (!data.success) {
        toast.error(data.message)
        return
      }
      set({ loadingIssues: false, issues: data.issues, issuesError: null, issuesSuccess: data.message })
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(errMsg);
      set({
        loadingIssues: false,
        issuesError: errMsg,
        issuesSuccess: null,
      });
    }
  },
  addIssueType: async (issueData) => {
    set({ creatingIssue: true, issuesError: null, issuesSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/create`, issueData)
      if (!data.success) {
        toast.error(data.message)
        return
      }
      toast.success(data.message)
      set({ creatingIssue: false, issuesSuccess: data.message, issuesError: null })
      // Refresh issues list
      get().getAllIssues()
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to create issue. Please try again.";

      toast.error(errMsg);
      set({
        creatingIssue: false,
        issuesError: errMsg,
        issuesSuccess: null,
      });
    }
  },
  updateIssueType: async (payload) => {
    set({ updatingIssue: true, issuesError: null, issuesSuccess: null })
    try {
      const { data } = await api.patch(`${ENDPOINT}/update/${payload.id}`, payload)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      toast.success(data.message)
      set({ updatingIssue: false, issuesSuccess: data.message, issuesError: null })
      // Refresh issues list
      get().getAllIssues()
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to update issue. Please try again.";

      toast.error(errMsg);
      set({
        updatingIssue: false,
        issuesError: errMsg,
        issuesSuccess: null,
      });
      return { success: false }
    }
  },
  deleteIssue: async (id) => {
    set({ deletingIssue: true, issuesError: null, issuesSuccess: null })
    try {
      const { data } = await api.delete(`${ENDPOINT}/delete/${id}`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      toast.success(data.message)
      set({ deletingIssue: false, issuesSuccess: data.message, issuesError: null })
      // Refresh issues list
      get().getAllIssues()
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to delete issue. Please try again.";

      toast.error(errMsg);
      set({
        deletingIssue: false,
        issuesError: errMsg,
        issuesSuccess: null,
      });
      return { success: false }
    }
  },
}))