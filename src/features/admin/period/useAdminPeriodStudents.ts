import { useQuery } from "@tanstack/react-query";
import { apiZ } from "../../../lib/apiZ";
import { adminKeys } from "../adminKeys";
import { StudentsRespSchema, type StudentsResp } from "./schemas";

type StudentsQuery = {
  page: number;
  pageSize: number;
  q?: string;
  status?: "" | "not_started" | "in_progress" | "finished";
  course?: string;
};

function buildStudentsQueryString(params: StudentsQuery) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("pageSize", String(params.pageSize));
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.status) sp.set("status", params.status);
  if (params.course) sp.set("course", params.course);
  return sp.toString();
}

export function useAdminPeriodStudents(
  periodId: number,
  params: StudentsQuery
) {
  const qs = buildStudentsQueryString(params);

  return useQuery({
    queryKey: adminKeys.periodStudents(periodId, params),
    queryFn: () =>
      apiZ(
        `/admin/periods/${periodId}/students?${qs}`,
        StudentsRespSchema
      ) as Promise<StudentsResp>,
    enabled: Number.isFinite(periodId) && periodId > 0,
    placeholderData: (prev) => prev,
  });
}
