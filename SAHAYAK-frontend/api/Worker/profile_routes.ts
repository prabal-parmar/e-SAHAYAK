import axios from "axios";
import apiClient from "../Auth/axiosInstance";

type FrontendData = Record<string, any>

export const fetchWorkerProfile = async () => {
    try {
        let response = await apiClient.get('/worker/profile/')
        // console.log(response.data.worker)
        return response.data.worker
    } catch (error) {
        console.log(error)
    }
}

export const updateWorkerProfile = async (data: FrontendData) => {
    try {
        await apiClient.patch('/worker/profile/',
            data
        )
    } catch (error) {
        console.log(error)
    }
}