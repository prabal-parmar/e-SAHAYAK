import axios from "axios";
import apiClient from "../Auth/axiosInstance";
import Toast from "react-native-toast-message";

type FrontendData = Record<string, any>

export const fetchWorkerProfile = async () => {
    try {
        let response = await apiClient.get('/worker/profile/')
        return response.data.worker
    } catch (error: any) {
        console.log(error)
        Toast.show({
            type: "error",
            text1: "Profile Fetch Failed 😔",
            text2: "Could not load worker profile.",
        });
    }
}

export const updateWorkerProfile = async (data: FrontendData) => {
    try {
        await apiClient.patch('/worker/profile/',
            data
        )
        Toast.show({
            type: "success",
            text1: "Profile Updated ✅",
            text2: "Worker profile updated successfully.",
        });
    } catch (error: any) {
        console.log(error)
        Toast.show({
            type: "error",
            text1: "Profile Update Failed 😔",
            text2: "Could not update worker profile.",
        });
    }
}