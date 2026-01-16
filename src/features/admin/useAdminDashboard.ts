import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiZ } from "../../lib/apiZ";
import { requireAuth } from "../../lib/guards";
import { DashboardSchema, type DashboardResp } from "./dashboard.schema";

export function useAdminDashboard() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const auth = requireAuth("admin");
    setEnabled(Boolean(auth));
  }, []);

  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () =>
      apiZ("/admin/dashboard", DashboardSchema) as Promise<DashboardResp>,
    enabled,
  });
}
