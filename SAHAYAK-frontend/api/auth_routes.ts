import axios from "axios"
import * as SecureStore from "expo-secure-store";

async function saveTokens(accessToken: string, refreshToken: string) {
  try {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    console.log("Tokens saved securely");
  } catch (e) {
    console.error("Failed to save tokens", e);
  }
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  return { accessToken, refreshToken };
}

export const employerLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login-employer/', 
            {username: username, password: password}
        )

        saveTokens(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        console.log(error)
    }
} 

export const logoutEmployer = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    // to be added 
}