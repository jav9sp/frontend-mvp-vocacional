import { useQuery } from "@tanstack/react-query";
import { apiZ } from "../../../lib/apiZ";
import { adminKeys } from "../adminKeys";
import { PeriodsRespSchema, type PeriodsResp } from "./schemas";

export function useAdminPeriods() {
  return useQuery({
    queryKey: adminKeys.periods(),
    queryFn: () =>
      apiZ("/admin/periods", PeriodsRespSchema) as Promise<PeriodsResp>,
  });
}
