import { z } from "zod";

export const DashboardSchema = z.object({
  ok: z.boolean(),
  kpis: z.object({
    totalPeriods: z.number(),
    activePeriods: z.number(),
    totalStudents: z.number(),
    totalFinished: z.number(),
  }),
  periods: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      status: z.enum(["draft", "active", "closed"]),
      startAt: z.string().nullable(),
      endAt: z.string().nullable(),
      createdAt: z.string(),
      studentsCount: z.number(),
      finishedCount: z.number(),
      completionPct: z.number(),
    })
  ),
});

export type DashboardResp = z.infer<typeof DashboardSchema>;
