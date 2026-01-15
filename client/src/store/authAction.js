import { useAuthStore } from "./auth.store";

export const resetAuthState = () => {
  useAuthStore.setState({
    user: null,
    loadingUser: false,
    checkingAuth: false,
  });
};