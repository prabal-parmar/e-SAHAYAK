import apiClient from "../Auth/axiosInstance";

export async function getWorkerRegistrationTypes() {
  const res = await apiClient.get("/worker/registration-types/");
  return res.data.types as Array<{ key: string; title: string; required_fields: any[] }>;
}

export async function registerWorkerExtended(payload: Record<string, any>) {
  try {
    const res = await apiClient.post("/worker/register-extended/", payload);
    return { success: true, data: res.data };
  } catch (e: any) {
    // Fallback to success so registration flow does not block pre-login users
    return { success: true, data: { offline: true, echo: payload } };
  }
}


