import { useQuery } from "@tanstack/react-query";
import { apiZ } from "../../../lib/apiZ";
import { DashboardSchema, type DashboardResp } from "./dashboard.schema";
import { adminKeys } from "../adminKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () =>
      apiZ("/admin/dashboard", DashboardSchema) as Promise<DashboardResp>,
  });
}
