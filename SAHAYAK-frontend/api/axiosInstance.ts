// apiClient.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./auth_routes"; // your refresh function

const API_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        error.config.headers["Authorization"] = `Bearer ${newAccess}`;
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
