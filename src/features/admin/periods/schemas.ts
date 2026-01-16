import { z } from "zod";

export const PeriodStatusSchema = z.enum(["draft", "active", "closed"]);

export const PeriodTestSchema = z
  .object({
    id: z.number(),
    name: z.string().optional(),
    key: z.string().optional(),
    version: z.string().optional(),
  })
  .optional();

export const PeriodRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: PeriodStatusSchema.or(z.string()), // por si backend manda otros estados
  startAt: z.string().nullable(),
  endAt: z.string().nullable(),
  createdAt: z.string(),
  studentsCount: z.number(),
  finishedCount: z.number(),
  test: PeriodTestSchema,
});

export const PeriodsRespSchema = z.object({
  ok: z.boolean(),
  organization: z.object({
    id: z.number(),
    name: z.string(),
  }),
  periods: z.array(PeriodRowSchema),
});

export type PeriodRow = z.infer<typeof PeriodRowSchema>;
export type PeriodsResp = z.infer<typeof PeriodsRespSchema>;
