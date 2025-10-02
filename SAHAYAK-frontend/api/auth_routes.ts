import axios from "axios"
import * as SecureStore from "expo-secure-store";

async function saveTokens(accessToken: string, refreshToken: string, role: string) {
  try {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("role", role);
    console.log("Tokens saved securely");
  } catch (e) {
    console.error("Failed to save tokens", e);
  }
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  const role = await SecureStore.getItemAsync("role");
  return { accessToken, refreshToken, role };
}

export const employerLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login-employer/', 
            {username: username, password: password}
        )
        if (response.data.access && response.data.refresh){
            saveTokens(response.data.access, response.data.refresh, response.data.role)
            return response
        }
        else{
            console.log("Invalid credentials")
        }
    } catch (error) {
        console.log(error)
    }
} 

export const workerLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login-worker/', 
            {username: username, password: password}
        )
        if (response.data.access && response.data.refresh){
            saveTokens(response.data.access, response.data.refresh, response.data.role)
            return response
        }
        else{
            console.log("Invalid credentials")
        }
    } catch (error) {
        console.log(error)
    }
}

export const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("role");
    // to be added 
}

type RegisterData = Record<string, any>;
export const registerWorker = async (data: RegisterData) => {
    try {
        await axios.post('http://127.0.0.1:8000/api/register-worker/',
            {
             first_name: data["firstName"], 
             last_name: data["lastName"],
             username: data["username"],
             password: data["password"],
             gender: data["gender"][0],
             contact_number: data["contactNumber"],
             skill: data["skill"],
             address: data["address"]
            }
        )
        console.log("Worker Registered successfully!")
    } catch (error) {
        console.log(error)
    }
}

export const registerEmployer = async (data: RegisterData) => {
    try {
        await axios.post('http://127.0.0.1:8000/api/register-employer/',
            {
             org_name: data["orgName"],
             username: data["username"],
             password: data["password"],
             email: data["email"],
             contact_number: data["contactNumber"],
             location: data["location"]
            }
        )
        console.log("Employer Registered successfully!")
    } catch (error) {
        console.log(error)
    }
}