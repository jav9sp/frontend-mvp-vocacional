import { z } from "zod";

const AttemptSchema = z
  .object({
    id: z.number(),
    status: z.enum(["in_progress", "finished"]),
    answeredCount: z.number(),
    createdAt: z.iso.datetime().nullable(),
    finishedAt: z.iso.datetime().nullable(),
    periodId: z.number(),
  })
  .nullable();

const EnrollmentSchema = z.object({
  enrollmentId: z.number(),
  enrollmentStatus: z.string(),
  course: z.string().nullable(),
  derivedStatus: z.enum(["not_started", "in_progress", "finished"]),
  createdAt: z.iso.datetime(),
  period: z.object({
    id: z.number(),
    name: z.string(),
    status: z.string(),
    startAt: z.iso.datetime().nullable(),
    endAt: z.iso.datetime().nullable(),
    testId: z.number(),
  }),
  attempt: AttemptSchema,
});

export const StudentDetailRespSchema = z.object({
  ok: z.literal(true),
  student: z.object({
    id: z.number(),
    rut: z.string().nullable(),
    name: z.string(),
    email: z.string().nullable(),
  }),
  enrollments: z.array(EnrollmentSchema),
});

export type StudentDetailResp = z.infer<typeof StudentDetailRespSchema>;
export type EnrollmentRow = StudentDetailResp["enrollments"][number];
