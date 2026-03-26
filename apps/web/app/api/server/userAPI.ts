import { serverClient } from "./serverClient";

const BASE_URL = "users";

export const userAPI = {
  getUserById: (userId: string) =>
    serverClient<{ data: any; sucess: string }>(`${BASE_URL}/${userId}`, {
      method: "GET",
    }),
  updateRole: (userId: string, role: string) =>
    serverClient<{ data: any; sucess: string }>(`${BASE_URL}/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};
