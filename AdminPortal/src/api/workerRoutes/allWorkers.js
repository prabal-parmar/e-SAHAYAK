import adminApi from "../adminAxios";

export const getWorkerData = async (username) => {
  try {
    const response = await adminApi.get(`get-worker-data/${username}/`);
    return response.data.worker;
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
