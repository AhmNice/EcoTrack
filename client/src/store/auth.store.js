import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";

const ENDPOINT = "/auth";

const initialState = {
  user: null,
  allUsers: [],
  loadingUser: false,
  checkingAuth: false,
  userSuccess: null,
  userError: null,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,
  getAllUsers: async () => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/users/get-all-users`)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        return
      }
      set({ loadingUser: false, userError: null, userSuccess: data.message, allUsers: data.users })
      return
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An Error occurred"
      toast.error(errMsg)
      set({ loadingUser: false, userError: data.message, userSuccess: null })
      return
    }
  },
  login: async (payload) => {
    set({
      loadingUser: true,
      userSuccess: null,
      userError: null,
    });

    try {
      const { data } = await api.post(`${ENDPOINT}/login`, payload);

      if (!data?.success) {
        const msg = data?.message || "Login failed";
        toast.error(msg);
        set({
          loadingUser: false,
          userError: msg,
        });
        return { success: false, route: null };
      }

      set({
        user: data.user,
        loadingUser: false,
        userSuccess: data.message,
        userError: null,
      });

      const route =
        data.user?.role_name === "user"
          ? "/dashboard"
          : "/admin/dashboard";

      return { success: true, route };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
        userSuccess: null,
      });
      console.error(error)
      return { success: false, route: null };
    }
  },
  register: async (payload) => {
    set({
      loadingUser: true,
      userSuccess: null,
      userError: null,
    });

    try {
      const { data } = await api.post(`${ENDPOINT}/create-user`, payload);

      if (!data?.success) {
        const msg = data?.message || "Registration failed";
        toast.error(msg);
        set({
          loadingUser: false,
          userError: msg,
        });
        return { success: false };
      }

      set({
        loadingUser: false,
        userSuccess: data.message,
        userError: null,
      });

      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to register. Please try again.";

      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
        userSuccess: null,
      });

      return { success: false };
    }
  },
  byAdminRegister: async (payload) => {
    set({
      loadingUser: true,
      userSuccess: null,
      userError: null,
    });

    try {
      const { data } = await api.post(`${ENDPOINT}/admin/create-user`, payload);

      if (!data?.success) {
        const msg = data?.message || "Registration failed";
        toast.error(msg);
        set({
          loadingUser: false,
          userError: msg,
        });
        return { success: false };
      }

      set({
        loadingUser: false,
        userSuccess: data.message,
        userError: null,
      });

      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to register. Please try again.";

      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
        userSuccess: null,
      });

      return { success: false };
    }
  },
  verifyOtp: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/otp-verification`, payload)
      if (!data.success) {
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        toast.error(data.message)
        return
      }
      set({ loadingUser: false, userError: null, userSuccess: data.message })
      toast.success(data.message)
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Unable to verify. Please try again.";

      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
        userSuccess: null,
      });

      return { success: false };
    }
  },
  checkAuth: async () => {
    set({
      loadingUser: true,
      checkingAuth: true,
      userError: null,
      userSuccess: null,
    });

    try {
      const { data } = await api.get(
        `${ENDPOINT}/get-authenticated-user`
      );

      if (!data?.success) {
        set({
          user: null,
          userError: data.message,
        });
        return;
      }

      set({
        user: data.user,
        userSuccess: data.message,
        userError: null,
      });
    } catch (error) {
      set({
        user: null,
      });
    } finally {
      set({
        loadingUser: false,
        checkingAuth: false,
      });
    }
  },
  updateProfile: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.patch(`${ENDPOINT}/update-profile/${payload.user_id}`, payload)
      if (!data.success) {
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        toast.error(data.message)
        return { success: false }
      }
      console.log(data)
      set({ loadingUser: false, userError: null, userSuccess: data.message, user: data.user })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Error while trying to update profile"
      toast.error(errMsg)
      set({ loadingUser: false, userError: errMsg, userSuccess: null })
      return { success: false }
    } finally {
      set({ loadingUser: false })
    }
  },
  getUser: async (user_id) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/users/get-user/${user_id}`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      return { success: true, user: data.user }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "An error occurred"
      toast.error(errMsg)
      return { success: false }
    }
  },
  requestResetPasswordLink: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/request-password-reset-link`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        return { success: false }
      }
      set({ loadingUser: false, userError: null, userSuccess: data.message })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Error while trying to request reset password link"
      toast.error(errMsg)
      set({ loadingUser: false, userError: errMsg, userSuccess: null })
      return { success: false }
    } finally {
      set({ loadingUser: false })
    }
  },
  resetPassword: async (payload) => {
    set({ loadingUser: false, userError: null, userSuccess: null })
    try {
      const { data } = await api.patch(`${ENDPOINT}/reset-password`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        return { success: false }
      }
      toast.success(data.message)
      set({ loadingUser: false, userError: null, userSuccess: data.message })
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Error while trying to change password"
      toast.error(errMsg)
      set({ loadingUser: false, userError: errMsg, userSuccess: null })
      return { success: false }
    } finally {
      set({ loadingUser: false })
    }
  },
  toggleStatus: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })

    try {
      const { data } = await api.patch(
        `${ENDPOINT}/status/toggle/${payload.user_id}`,
        payload
      )

      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message })
        return { success: false }
      }

      const { allUsers } = get()

      set({
        loadingUser: false,
        userError: null,
        userSuccess: data.message,
        allUsers: allUsers.map((user) =>
          user.id === payload.user_id
            ? { ...user, is_active: data.user.is_active }
            : user
        )
      })

      toast.success(data.message)
      return { success: true, user: data.user }

    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "An error occurred"

      console.error(error)
      toast.error(errMsg)

      set({ loadingUser: false, userError: errMsg })
      return { success: false }
    }
  },
  // ================= LOGOUT =================
  logoutUser: async (manual = true) => {
    try {
      const { data } = await api.post(`${ENDPOINT}/logout`);
      console.log(data)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      if (manual) { toast.success(data.message) }
      set({ ...initialState })
      return { success: true }
    } catch (error) {

      console.log(error)
      // ignore network errors
      return { success: false }

    }

  },
}));
