import adminApi from "../adminAxios";

export const getAllEmployers = async () => {
  try {
    const response = await adminApi.get("all-employers/");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEmployerData = async (username) => {
  try {
    const response = await adminApi.get(`get-employer-data/${username}/`);
    return response.data.employer;
  } catch (error) {
    console.log(error);
  }
};
