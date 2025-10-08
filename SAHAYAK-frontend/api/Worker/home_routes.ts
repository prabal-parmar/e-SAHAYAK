import apiClient from "../Auth/axiosInstance";

export const markSatisfiedTo5DaysData = async () => {
    try {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const date = today.getDate()

        // console.log(year, month, date)
        await apiClient.post('/worker/mark-prev-5-days/', {
            year,
            month,
            date
        })
        return true;
    }
    catch (error) {
        console.log(error)
        return false
    }
}

export const recentWorkResonseStatus = async () => {
    try {
        const response = await apiClient.get('/worker/pending-response-data/')
        return response.data

    } catch (error) {
        console.log(error)
    }
}

export const updateResponse = async (id: any, newStatus: string, reason: string, message: string) => {
    try {
        const response = await apiClient.post('/worker/worker-response-to-attendance/', {
            id: id,
            status: newStatus,
            reason: reason,
            message: message
        })
        // console.log(response.data.error, response.data.message)
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}
    