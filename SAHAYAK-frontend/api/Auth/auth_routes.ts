import axios from "axios";
import * as SecureStore from "expo-secure-store";
import apiClient, { setAuthCallbacks } from "./axiosInstance";
import Config from "react-native-config";

type RegisterData = Record<string, any>;

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found during token refresh.");
      return null;
    }
    const response = await apiClient.post(`/token/refresh/`, { refresh: refreshToken });
    const newAccess = response.data.access;
    if (newAccess) {
      await SecureStore.setItemAsync("accessToken", newAccess);
      return newAccess;
    }
    throw new Error("No new access token in refresh response.");
  } catch (error: any) {
    console.error("Token refresh failed:", error.response?.status, error.response?.data, error.message);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("role");
  await SecureStore.deleteItemAsync("userId");
  console.log("User logged out.");
};

setAuthCallbacks(refreshAccessToken, logout);

async function saveTokens(accessToken: string, refreshToken: string, role: string, userId: string) {
  try {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("role", role);
    await SecureStore.setItemAsync("userId", userId);
    console.log("Tokens saved securely");
  } catch (e) {
    console.error("Failed to save tokens", e);
  }
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  const role = await SecureStore.getItemAsync("role");
  const userId = await SecureStore.getItemAsync("userId");
  return { accessToken, refreshToken, role, userId };
}

export const employerLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.post(`/login-employer/`, {
      username: username,
      password: password,
    });
    if (response.data.access && response.data.refresh) {
      await saveTokens(response.data.access, response.data.refresh, response.data.role, response.data.userId);
      return { success: true, role: response.data.role };
    }
    // This part should ideally not be reached if backend returns 200 for successful login
    return { success: false, error: response.data?.detail || "Invalid credentials" };
  } catch (error: any) {
    console.error("Employer Login Failed:", error.response?.status, error.response?.data, error.message);
    return { success: false, error: error.response?.data?.detail || "Network error or invalid credentials." };
  }
};

export const workerLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.post(`/login-worker/`, {
      username: username,
      password: password,
    });
    if (response.data.access && response.data.refresh) {
      await saveTokens(response.data.access, response.data.refresh, response.data.role, response.data.userId);
      return { success: true, role: response.data.role };
    }
    return { success: false, error: response.data?.detail || "Invalid credentials" };
  } catch (error: any) {
    console.error("Worker Login Failed:", error.response?.status, error.response?.data, error.message);
    return { success: false, error: error.response?.data?.detail || "Network error or invalid credentials." };
  }
};

export const registerWorker = async (data: RegisterData) => {
  try {
    await apiClient.post(`/register-worker/`, {
      first_name: data["firstName"],
      last_name: data["lastName"],
      username: data["username"],
      password: data["password"],
      gender: data["gender"][0],
      contact_number: data["contactNumber"],
      skill: data["skill"],
      address: data["address"],
    });
    return { success: true };
  } catch (error: any) {
    console.error("Worker Registration Failed:", error.response?.status, error.response?.data, error.message);
    return { success: false, error: error.response?.data?.detail || "Something went wrong" };
  }
};

export const registerEmployer = async (data: RegisterData) => {
  try {
    await apiClient.post(`/register-employer/`, {
      org_name: data["orgName"],
      username: data["username"],
      password: data["password"],
      email: data["email"],
      contact_number: data["contactNumber"],
      location: data["location"],
    });
    return { success: true };
  } catch (error: any) {
    console.error("Employer Registration Failed:", error.response?.status, error.response?.data, error.message);
    return { success: false, error: error.response?.data?.detail || "Something went wrong" };
  }
};

export const changeUserPassword = async (oldPassword: string, newPassword: string) => {
  try {
    await apiClient.patch(`/user/change-password/`, {
      oldPassword,
      newPassword,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Change Password Failed:", error.response?.status, error.response?.data, error.message);
    return { success: false, error: error.response?.data?.detail || "Failed to change password." };
  }
};