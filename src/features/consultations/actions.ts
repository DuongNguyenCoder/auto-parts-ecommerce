"use server";

import { consultationService } from "@/server/services/consultations.service";
import {
  mapConsultationListResponse,
  mapConsultationRecord,
} from "./mappers/consultation.mapper";
import type { ConsulationStatus } from "@/../prisma/generated/prisma";
import type {
  createConsultationDTO,
  updateConsultationDTO,
} from "@/validations/consulations.schema";

export async function listConsultations(
  filters?: { status?: ConsulationStatus; search?: string },
  pagination?: { take?: number; skip?: number },
) {
  const result = await consultationService.list(filters, pagination);
  return mapConsultationListResponse(result);
}

export async function getConsultationById(id: number) {
  const result = await consultationService.getById(id);
  return mapConsultationRecord(result);
}

export async function createConsultation(data: createConsultationDTO) {
  const result = await consultationService.create(data);
  return mapConsultationRecord(result);
}

export async function updateConsultation(
  id: number,
  data: updateConsultationDTO,
) {
  const result = await consultationService.update(id, data);
  return mapConsultationRecord(result);
}

export async function deleteConsultation(id: number) {
  const result = await consultationService.delete(id);
  return mapConsultationRecord(result);
}
