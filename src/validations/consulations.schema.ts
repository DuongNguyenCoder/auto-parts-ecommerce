import z from "zod";

export const consulationStatusSchema = z.enum(["PENDING", "PROCESSED"]);

export const createConsulationSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"),
  name: z.string().min(1, "Vui lòng nhập tên của bạn"),
  email: z.string().trim().email("Email không hợp lệ").optional(),
  note: z.string().trim().optional(),
  status: consulationStatusSchema.default("PENDING"),
});

export const updateConsulationSchema = createConsulationSchema.partial();

export const consultationSchema = createConsulationSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type createConsultationDTO = z.infer<typeof createConsulationSchema>;
export type updateConsultationDTO = z.infer<typeof updateConsulationSchema>;
export type Consultation = z.infer<typeof consultationSchema>;
