import apiClient from "../Auth/axiosInstance";
import Toast from "react-native-toast-message";

export const markSatisfiedTo5DaysData = async () => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();

        await apiClient.post('/worker/mark-prev-5-days/', {
            year,
            month,
            date
        });

        return true;
    }
    catch (error: any) {
        console.log(error);
        return false;
    }
}

export const recentWorkResonseStatus = async () => {
    try {
        const response = await apiClient.get('/worker/pending-response-data/');
        return response.data;

    } catch (error: any) {
        console.log(error);
        Toast.show({
            type: "error",
            text1: "Something Went Wrong!",
        });
    }
}

export const updateResponse = async (id: any, newStatus: string, reason: string, message: string) => {
    try {
        const response = await apiClient.post('/worker/worker-response-to-attendance/', {
            id: id,
            status: newStatus,
            reason: reason,
            message: message
        });
        return true;
    } catch (error: any) {
        console.log(error);
        Toast.show({
            type: "error",
            text1: "Something Went Wrong!",
        });
        return false;
    }
}

export const getCalenderDataByMonth = async (month: number, year: number) => {
    try {
        const response = await apiClient.get('/worker/monthly-attendance/',
            {
                params: {
                    month, year
                }
            }
        );
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
}

export const getAttendanceDetailsByDate = async (date: string) => {
    try {
        const response = await apiClient.get('/worker/filter-attendance-data/',
            {
                params: {
                    date: date
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.log(error);
        Toast.show({
            type: "error",
            text1: "Something Went Wrong!",
        });
    }
}
    