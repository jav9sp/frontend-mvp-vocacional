import { useQuery } from "@tanstack/react-query";
import { apiZ } from "../../../lib/apiZ";
import { adminKeys } from "../adminKeys";
import { SummaryRespSchema, type SummaryResp } from "./schemas";

export function useAdminPeriodSummary(periodId: number) {
  return useQuery({
    queryKey: adminKeys.periodSummary(periodId),
    queryFn: () =>
      apiZ(
        `/admin/periods/${periodId}/summary`,
        SummaryRespSchema
      ) as Promise<SummaryResp>,
    enabled: Number.isFinite(periodId) && periodId > 0,
  });
}
