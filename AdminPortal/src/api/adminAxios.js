import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin/"; // Adjust if your backend runs on a different port

const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem("admin_refresh_token");
        const response = await axios.post(`${API_URL}login/refresh/`, { refresh: refresh_token });
        if (response.data.access) {
          localStorage.setItem("admin_access_token", response.data.access);
          adminApi.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token:", refreshError);
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = async (username, password) => {
  const response = await adminApi.post("login/", { username, password });
  if (response.data.access) {
    localStorage.setItem("admin_access_token", response.data.access);
    localStorage.setItem("admin_refresh_token", response.data.refresh);
  }
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};

export const getAdminAccessToken = () => {
  return localStorage.getItem("admin_access_token");
};

export const getAdminRefreshToken = () => {
  return localStorage.getItem("admin_refresh_token");
};

export default adminApi;
