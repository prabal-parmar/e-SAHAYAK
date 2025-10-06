import apiClient from "../Auth/axiosInstance";

export const getHeaderStats = async () => {
    try {
        const response = await apiClient.get('/worker/stats/')
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getWorkHistory = async () => {
    try {
        const response = await apiClient.get('/worker/work-history/')
        return response.data
    } catch (error) {
        console.log(error)
    }
}