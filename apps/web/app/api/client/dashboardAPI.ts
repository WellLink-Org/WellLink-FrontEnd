import { DashboardWidget } from "../../dashboard/page";
import { clientClient } from "./clientClient";

const BASE_URL = "dashboard";

export const dashboardAPI = {
  getDashboard: () =>
    clientClient<{ data: any; sucess: string }>(`${BASE_URL}/:userId`, {
      method: "GET",
    }),
  updateDashboard: (widgets: DashboardWidget[]) =>
    clientClient<{ data: any; sucess: string }>(`${BASE_URL}/widgets`, {
      method: "PATCH",
      body: JSON.stringify({ widgets }),
    }),
  getWidgetData: (dataType: string, days: string) =>
    clientClient<{ data: any; sucess: string }>(
      `${BASE_URL}/:userId/widget-data?dataType=${dataType}&days=${days}`,
      {
        method: "GET",
      },
    ),
};
