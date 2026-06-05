import type { Consultation } from "@/validations/consulations.schema";
import type { ConsultationRecord } from "@/server/repositories/consultations.repository";

export function mapConsultationRecord(
  data: ConsultationRecord | null | undefined,
): Consultation | null {
  if (!data) return null;

  return {
    id: data.id,
    phone: data.phone,
    name: data.name,
    email: data.email ?? undefined,
    note: data.note ?? undefined,
    status: data.status,
    createdAt:
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt),
    updatedAt:
      data.updatedAt instanceof Date
        ? data.updatedAt
        : new Date(data.updatedAt),
  };
}

export function mapConsultationRecords(
  data: (ConsultationRecord | null | undefined)[],
): Consultation[] {
  return data
    .map(mapConsultationRecord)
    .filter((item): item is Consultation => item !== null);
}

export function mapConsultationListResponse(response: {
  items?: (ConsultationRecord | null | undefined)[];
  pagination?: any;
}) {
  return {
    items: mapConsultationRecords(response.items ?? []),
    pagination: response.pagination,
  };
}
