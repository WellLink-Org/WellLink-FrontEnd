import { clientClient } from "./clientClient";

const BASE_URL = "health";

export const healthApi = {
  getNames: () =>
    clientClient<string[]>(`${BASE_URL}/get-names`, {
      method: "GET",
    }),
};
