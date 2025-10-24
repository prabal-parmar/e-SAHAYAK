import apiClient from "../Auth/axiosInstance";
import Toast from "react-native-toast-message";

export const getWorkersWage = async () => {
    try {
        const response = await apiClient.get('/employer/get-workers-salary/')
        return response.data; 
    } catch (error: any) {
        console.log(error);
        Toast.show({
            type: "error",
            text1: "There might be some error!",
            text2: "Please try again.",
        });
    }
}

export const updateWorkerSalaryGiven = async (id: number) => {
    try {
        await apiClient.patch('/employer/update-worker-salary-status/', {
            id: id
        })
        return true;
    } catch (error: any) {
        console.log(error)
        return false;
    }
}