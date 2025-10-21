import adminApi from "../adminAxios";

export const getAttendanceByEmployerAndDate = async (employerId, date) => {
  try {
    const response = await adminApi.get(
      `filter-worker-by-employer-date/${employerId}/?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return { workers: [] };
  }
};
