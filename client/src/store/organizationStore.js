import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";
const initialState = {
  organizations: [],
  loadingOrganization: false,
  orgError: null,
  orgSuccess: null
}
const ENDPOINT = 'organizations'
export const useOrganizationStore = create((set, get) => ({
  ...initialState,
  getAllOrganization: async () => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/get-all-organizations`)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        return
      }
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message, organizations: data.data })
      return
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      console.error(errMsg)
      toast.error(errMsg)
      return
    }
  },
  addOrganization: async (payload) => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/create`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        return { success: false }
      }
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      console.error(errMsg)
      toast.error(errMsg)
      return { success: false }
    }
  },
  updateOrganization: async (org_id, payload) => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.patch(`${ENDPOINT}/update-organizations/${org_id}`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        return { success: false }
      }
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      console.error(error)
      toast.error(errMsg)
      return { success: false }
    }
  },
  deleteOrganization: async (org_id) => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.delete(`${ENDPOINT}/delete-organizations/${org_id}`)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        return { success: false }
      }
      const { organizations } = get()
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message, organizations: organizations.filter((org) => org.id !== org_id) })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      console.error(error)
      toast.error(errMsg)
      return { success: false }
    }
  },
  addUserToOrg: async (payload) => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/add-user-to-organization/${payload.organization_id}`, payload)
      if (!data.success) {
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        toast.error(data.message)
        return { success: false }
      }
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      set({ loadingOrganization: false, orgError: errMsg, orgSuccess: null })
      console.log(error)
      const errMsg = error?.response?.data?.message || error.message || "An error occurred"
      toast.error(errMsg)
      return { success: false }
    }
  },
  getOrgData: async (organization_id) => {
    set({ loadingOrganization: true, orgError: null, orgSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/get-organization-details/${organization_id}`)
      if (!data.success) {
        set({ loadingOrganization: false, orgError: data.message, orgSuccess: null })
        toast.error(data.message)
        return { success: false, data: null }
      }
      set({ loadingOrganization: false, orgError: null, orgSuccess: data.message })
      return { success: true, data: data.organization }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      console.error(errMsg)
      toast.error(errMsg)
      set({ loadingOrganization: false, orgError: errMsg, orgSuccess: null })
      return { success: false, data: null }
    }
  }
}))