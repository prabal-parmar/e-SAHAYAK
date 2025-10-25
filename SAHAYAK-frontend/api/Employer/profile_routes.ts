import apiClient from "../Auth/axiosInstance";

type FrontendData = Record<string, any>
export const getEmployerProfile = async () => {
    try {
        const response = await apiClient.get('/employer/profile/')
        // console.log(response)
        return response.data.employer
    } catch (error) {
        console.log(error)
    }
}

export const updateEmployerProfile = async (data: FrontendData) => {
    try {
        await apiClient.patch('/employer/profile/', {
            org_name: data["org_name"],
            contact_number: data["contact_number"],
            location: data["location"]
        })
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const fetchReportsCount = async () => {
    try {
        const response = await apiClient.get('/employer/worker-reports/');

        return response.data.reports;
    } catch (error) {
        
    }
}