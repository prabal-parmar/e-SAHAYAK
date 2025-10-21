import adminApi from "./adminAxios";

export const fetchAllPendingReports = async () => {
  try {
    const response = await adminApi.get("all-pending-reports/");
    return response.data.reports;
  } catch (error) {
    throw error;
  }
};

export const fetchAllResolvedReports = async () => {
  try {
    const response = await adminApi.get("all-resolved-reports/");
    return response.data.reports;
  } catch (error) {
    throw error;
  }
};

export const resolveReportWithMessage = async (reportId, message) => {
  try {
    const response = await adminApi.post("resolve-complaint/", {
      id: reportId,
      response: message,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
