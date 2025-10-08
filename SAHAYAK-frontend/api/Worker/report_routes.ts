import apiClient from "../Auth/axiosInstance";

export const getAllReports = async () => {
    try {
        const response = await apiClient.get('/worker/all-reports/')
        return response.data.data
    } catch (error) {
        console.log(error)
    }
}