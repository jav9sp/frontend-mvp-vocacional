import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { adminKeys } from "../adminKeys";

export function useUpdatePeriodStatus(periodId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (nextStatus: "active" | "closed") => {
      await api(`/admin/periods/${periodId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
    },
    onSuccess: async () => {
      // refresca detail y listados relacionados
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminKeys.periodSummary(periodId) }),
        qc.invalidateQueries({ queryKey: adminKeys.period(periodId) }), // por si agregas otros queries del periodo
        qc.invalidateQueries({ queryKey: adminKeys.periods() }),
        qc.invalidateQueries({ queryKey: adminKeys.dashboard() }),
      ]);
    },
  });
}
