import axios from "axios";
import { toast } from "react-toastify";
import { resetAuthState } from "../store/authAction";
import { useAuthStore } from "../store/auth.store";
// Create axios instance

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5800",
  withCredentials: true,
});

// Define guest/public routes
const guestPages = [
  "/",
  "/login",
  "/signup",
  "/reset-password",
  "/request-password-reset",
  "/verify-otp",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const currentPath = window.location.pathname;
    const requestUrl = error?.config?.url || "";

    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/get-authenticated-user");

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      if (!guestPages.includes(currentPath)) {
        toast.warn(message || "Session expired, please login again.");
      }
      const { logoutUser } = useAuthStore.getState()
      await logoutUser(false)
      resetAuthState();
    }

    return Promise.reject(error);
  }
);



export default api;
