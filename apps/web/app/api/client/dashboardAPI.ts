import { clientClient } from "./clientClient";

const BASE_URL = "dashboard";

export const userAPI = {
  getDashboard: (userId: string) =>
    clientClient<{ data: any; sucess: string }>(`${BASE_URL}/${userId}`, {
      method: "GET",
    }),
  updateRole: (userId: string, role: string) =>
    clientClient<{ data: any; sucess: string }>(`${BASE_URL}/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};
