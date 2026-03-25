import { apiClient } from "./client";

const BASE_URL = "health";

export const healthApi = {
  getNames: () =>
    apiClient<string[]>(`${BASE_URL}/get-names`, {
      method: "GET",
    }),

  // createName: (name: string) =>
  //   apiClient<{ id: number; name: string }>("/api/health", {
  //     method: "POST",
  //     body: JSON.stringify({ name }),
  //   }),

  // updateName: (id: number, name: string) =>
  //   apiClient(`/api/health/${id}`, {
  //     method: "PATCH",
  //     body: JSON.stringify({ name }),
  //   }),

  // deleteName: (id: number) =>
  //   apiClient(`/api/health/${id}`, {
  //     method: "DELETE",
  //   }),
};
