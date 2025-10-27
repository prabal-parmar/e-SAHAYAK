import adminApi from "../adminAxios";

export const getWorkerData = async (username) => {
  try {
    const response = await adminApi.get(`get-worker-data/${username}/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllWorkers = async () => {
  try {
    const response = await adminApi.get("all-workers/");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getWorkerWorkHistory = async (workerId, date) => {
  try {
    const response = await adminApi.get(
      `filter-worker-work-by-date/${workerId}/?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return { workers: [] };
  }
};

export const getHourWage = async () => {
  try {
    const response = await adminApi.get('hour-wage/');
    return response.data;
  } catch (error) {
    console.log("Error fetching wage:", error);
    return {wages: {hourWage: 0, overtimeWage: 0}}
  }
}

export const updateHourWage = async (hourlyWage, overtimeWage) => {
  try {
    await adminApi.post('hour-wage/', {
      hourWage: hourlyWage, overtimeWage: overtimeWage
    });
  } catch (error) {
    console.log("Error fetching wage:", error);
    return {wages: {hourWage: 0, overtimeWage: 0}}
  }
}

export const allWorkerStatsDayWise = async (days) => {
  try {
    const response = await adminApi.get('stats/', {
      params:{
        time: days
      }
    })
    return response.data
  } catch (error) {
      console.log("Error fetching wage:", error);
      return {shift1_count: 0, shift2_count: 0, overtimeCount: 0}
  }
}
