import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://sram-thi7.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.post("/login-employer/")
  .then((res) => console.log("✅ Backend reachable", res.status))
  .catch((err) => console.error("❌ Backend unreachable:", err.response?.status, err.message));

let onRefreshAccessToken: (() => Promise<string | null>) | null = null;
let onLogout: (() => Promise<void>) | null = null;

export const setAuthCallbacks = (refreshCb: () => Promise<string | null>, logoutCb: () => Promise<void>) => {
  onRefreshAccessToken = refreshCb;
  onLogout = logoutCb;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("401 Unauthorized received, attempting token refresh.");
      originalRequest._retry = true;
      if (onRefreshAccessToken && onLogout) {
        try {
          const newAccess = await onRefreshAccessToken();
          if (newAccess) {
            await SecureStore.setItemAsync("accessToken", newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            console.log("Token refreshed successfully, retrying original request.");
            return apiClient(originalRequest);
          } else {
            console.error("Token refresh failed: No new access token received. User may need to log in again.");
            await onLogout();
          }
        } catch (refreshError: any) {
          console.error("Error during token refresh attempt:", refreshError.response?.status, refreshError.response?.data, refreshError.message);
          await onLogout();
        }
      } else {
        console.error("Auth callbacks not set in axiosInstance. Cannot refresh token or logout.");
      }
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
