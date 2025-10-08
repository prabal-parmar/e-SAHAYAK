import apiClient from "../Auth/axiosInstance";

export const getPDFdata = async (id: string) => {
    try {
        const response = await apiClient.get(`/worker/receiptPDF/${id}/`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}