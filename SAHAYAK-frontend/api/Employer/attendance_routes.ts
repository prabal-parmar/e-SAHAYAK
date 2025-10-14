import apiClient from "../Auth/axiosInstance";

const API_URL = "http://127.0.0.1:8000/api";

type FrontendData = Record<string, any>
export const markClockInTime = async (data: FrontendData) => {
    try {
        await apiClient.post(`/employer/work/mark-entry-time/`,
            {
                worker: data.workerUsername,
                entry_time: data.clockInTime,
                shift: data.shift,
                description: data.description,
                date: data.date
            }
        )
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const markClockOutTime = async (data: FrontendData) => {
    try {
        await apiClient.post(`/employer/work/mark-leaving-time/`,
            {
                worker: data.workerUsername,
                leaving_time: data.clockOutTime,
                description: data.description
            }
        )
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getAllWorkers = async () => {
    try {
        const response = await apiClient.get(`/employer/all-workers/`)
        return response.data.workers
    } catch (error) {
        console.log(error)
    }
}

export const getAllWorkersWorking = async () => {
    try {
        const response = await apiClient.get(`/employer/worker-working/`)
        return response.data.workers
    } catch (error) {
        console.log(error)
    }
}

export const addFullAttendanceData = async (data: FrontendData) => {
    try {
        const response = await apiClient.post('/employer/work/mark-attendance-data/', 
            {
                worker: data?.worker,
                entry_time: data?.entry_time,
                leaving_time: data?.leaving_time,
                shift: data?.shift,
                description: data?.description,
                date: data?.date,
                overtime: data?.overtime,
                overtime_entry_time: data?.overtime_entry_time,
                overtime_leaving_time: data?.overtime_entry_time,
            }
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const markOvertimeClockInTime = async (data: FrontendData) => {
    try {
        await apiClient.post('/employer/work/mark-overtime-start-time/', 
            {
                worker: data?.workerUsername,
                overtime: true,
                overtime_entry_time: data?.clockInTime
            }
        )
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const markOvertimeClockOutTime = async (data: FrontendData) => {
    try {
        const response = await apiClient.post('/employer/work/mark-overtime-end-time/',
            {
                worker: data?.workerUsername,
                overtime_leaving_time: data?.clockOutTime
            }
        )
        // console.log(response.data)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const fetchAttendanceDataByDate = async (data: FrontendData) => {
    try {
        const response = await apiClient.get('/employer/filter-attendance-data/', 
            {
                params: {
                    day: data.day,
                    month: data.month,
                    year: data.year
                }
            }
        )
        return response.data.data
    } catch (error) {
        console.log(error)
    }
}