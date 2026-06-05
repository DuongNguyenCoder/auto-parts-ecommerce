import { AppError } from "@/server/http/app-error";
import { buildPagination } from "@/server/utils/pagination";
import { consultationRepository } from "@/server/repositories/consultations.repository";
import type {
  createConsultationDTO,
  updateConsultationDTO,
} from "@/validations/consulations.schema";
import type { ConsulationStatus } from "@/../prisma/generated/prisma";

export const consultationService = {
  list: async (
    filters?: { status?: ConsulationStatus; search?: string },
    pagination?: { take?: number; skip?: number },
  ) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      consultationRepository.findMany(filters, { take, skip }),
      consultationRepository.count(filters),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
  },

  getById: async (id: number) => {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) {
      throw new AppError("Consultation not found", 404);
    }
    return consultation;
  },

  create: async (data: createConsultationDTO) => {
    return consultationRepository.create(data);
  },

  update: async (id: number, data: updateConsultationDTO) => {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) {
      throw new AppError("Consultation not found", 404);
    }
    return consultationRepository.update(id, data);
  },

  delete: async (id: number) => {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) {
      throw new AppError("Consultation not found", 404);
    }
    return consultationRepository.delete(id);
  },
};
