export const adminKeys = {
  all: ["admin"] as const,

  dashboard: () => [...adminKeys.all, "dashboard"] as const,

  periods: () => [...adminKeys.all, "periods"] as const,
  period: (id: number | string) =>
    [...adminKeys.periods(), String(id)] as const,

  periodSummary: (id: number | string) =>
    [...adminKeys.period(id), "summary"] as const,

  periodStudents: (
    id: number | string,
    params: {
      page: number;
      pageSize: number;
      q?: string;
      status?: string;
      course?: string;
    }
  ) =>
    [
      ...adminKeys.period(id),
      "students",
      {
        page: params.page,
        pageSize: params.pageSize,
        q: params.q ?? "",
        status: params.status ?? "",
        course: params.course ?? "",
      },
    ] as const,
};
