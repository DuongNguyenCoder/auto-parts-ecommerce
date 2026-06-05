import { prisma } from "@/server/prisma";
import type { ConsulationStatus } from "@/../prisma/generated/prisma";
import type {
  createConsultationDTO,
  updateConsultationDTO,
} from "@/validations/consulations.schema";

const consultationSelect = {
  id: true,
  phone: true,
  name: true,
  email: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ConsultationRecord = Awaited<
  ReturnType<typeof consultationRepository.findById>
>;

export const consultationRepository = {
  findById: (id: number) =>
    prisma.consulation.findUnique({
      where: { id },
      select: consultationSelect,
    }),

  findMany: (
    filters?: { status?: ConsulationStatus; search?: string },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.consulation.findMany({
      where: {
        status: filters?.status,
        OR: filters?.search
          ? [
              {
                phone: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
      select: consultationSelect,
      orderBy: { createdAt: "desc" },
      take: pagination?.take,
      skip: pagination?.skip,
    }),

  count: (filters?: { status?: ConsulationStatus; search?: string }) =>
    prisma.consulation.count({
      where: {
        status: filters?.status,
        OR: filters?.search
          ? [
              {
                phone: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
    }),

  create: (data: createConsultationDTO) =>
    prisma.consulation.create({
      data,
      select: consultationSelect,
    }),

  update: (id: number, data: updateConsultationDTO) =>
    prisma.consulation.update({
      where: { id },
      data,
      select: consultationSelect,
    }),

  delete: (id: number) =>
    prisma.consulation.delete({
      where: { id },
      select: consultationSelect,
    }),
};
