import apiClient from "../Auth/axiosInstance";

export const getWorkersWage = async () => {
    try {
        const response = await apiClient.get('/employer/get-workers-salary/')
        return response.data; 
    } catch (error) {
        console.log(error);
    }
}

export const updateWorkerSalaryGiven = async (id: number) => {
    try {
        await apiClient.patch('/employer/update-worker-salary-status/', {
            id: id
        })
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}