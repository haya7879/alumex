"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  salesServices,
  CheckProjectNameResponse,
  SalesAgent,
  Section,
  CreateFormRequest,
  CreateFormResponse,
  CreateFollowUpRequest,
  CreateFollowUpResponse,
  CreateMeasurementsRequest,
  CreateMeasurementsResponse,
  FormsListResponse,
  CreateSectionRequest,
  CreateSectionResponse,
  UpdateSectionRequest,
  UpdateSectionResponse,
  DailyMovementsListResponse,
  CreateDailyMovementRequest,
  CreateDailyMovementResponse,
  UpdateDailyMovementStatusRequest,
  UpdateDailyMovementStatusResponse,
  ShowroomVisitsListResponse,
  CreateShowroomVisitRequest,
  CreateShowroomVisitResponse,
  UpdateShowroomVisitStatusRequest,
  UpdateShowroomVisitStatusResponse,
  CreateContractRequest,
  CreateContractResponse,
  CreateQuotationRequest,
  CreateQuotationResponse,
} from "./sales-services";


/**
 * Hook for checking project name
 */
export const useCheckProjectName = () => {
  return useMutation<CheckProjectNameResponse, Error, string>({
    mutationFn: salesServices.checkProjectName,
  });
};

/**
 * Hook for fetching Sales Agents
 */
export const useSalesAgents = () => {
  return useQuery<SalesAgent[]>({
    queryKey: ["sales-agents"],
    queryFn: salesServices.getSalesAgents,
  });
};

/**
 * Hook for fetching Sections
 */
export const useSections = () => {
  return useQuery<Section[]>({
    queryKey: ["sections"],
    queryFn: salesServices.getSections,
  });
};

/**
 * Hook for creating a section
 */
export const useCreateSection = () => {
  return useMutation<CreateSectionResponse, Error, CreateSectionRequest>({
    mutationFn: salesServices.createSection,
  });
};

/**
 * Hook for fetching a single section by ID
 */
export const useSection = (id: number | null) => {
  return useQuery<Section>({
    queryKey: ["section", id],
    queryFn: () => salesServices.getSection(id!),
    enabled: !!id,
  });
};

/**
 * Hook for updating a section
 */
export const useUpdateSection = () => {
  return useMutation<
    UpdateSectionResponse,
    Error,
    { id: number; data: UpdateSectionRequest }
  >({
    mutationFn: ({ id, data }) => salesServices.updateSection(id, data),
  });
};

/**
 * Hook for deleting a section
 */
export const useDeleteSection = () => {
  return useMutation<{ message?: string }, Error, number>({
    mutationFn: (id) => salesServices.deleteSection(id),
  });
};

/**
 * Hook for creating a form
 */
export const useCreateForm = () => {
  return useMutation<CreateFormResponse, Error, CreateFormRequest>({
    mutationFn: salesServices.createForm,
  });
};

/**
 * Hook for creating follow-up notes
 */
export const useCreateFollowUp = () => {
  return useMutation<CreateFollowUpResponse, Error, CreateFollowUpRequest>({
    mutationFn: salesServices.createFollowUp,
  });
};

/**
 * Hook for creating measurements
 */
export const useCreateMeasurements = () => {
  return useMutation<
    CreateMeasurementsResponse,
    Error,
    CreateMeasurementsRequest
  >({
    mutationFn: salesServices.createMeasurements,
  });
};

/**
 * Hook for fetching forms list
 */
export const useForms = (params?: { page?: number; per_page?: number }) => {
  return useQuery<FormsListResponse>({
    queryKey: ["forms", params],
    queryFn: () => salesServices.getForms(params),
  });
};

/**
 * Hook for fetching daily movements list
 */
export const useDailyMovements = (params?: { page?: number; per_page?: number }) => {
  return useQuery<DailyMovementsListResponse>({
    queryKey: ["daily-movements", params],
    queryFn: () => salesServices.getDailyMovements(params),
  });
};

/**
 * Hook for creating a daily movement
 */
export const useCreateDailyMovement = () => {
  return useMutation<CreateDailyMovementResponse, Error, CreateDailyMovementRequest>({
    mutationFn: salesServices.createDailyMovement,
  });
};

/**
 * Hook for updating daily movement status
 */
export const useUpdateDailyMovementStatus = () => {
  return useMutation<
    UpdateDailyMovementStatusResponse,
    Error,
    { id: number; data: UpdateDailyMovementStatusRequest }
  >({
    mutationFn: ({ id, data }) => salesServices.updateDailyMovementStatus(id, data),
  });
};

/**
 * Hook for fetching showroom visits list
 */
export const useShowroomVisits = (params?: { page?: number; per_page?: number }) => {
  return useQuery<ShowroomVisitsListResponse>({
    queryKey: ["showroom-visits", params],
    queryFn: () => salesServices.getShowroomVisits(params),
  });
};

/**
 * Hook for creating a showroom visit
 */
export const useCreateShowroomVisit = () => {
  return useMutation<CreateShowroomVisitResponse, Error, CreateShowroomVisitRequest>({
    mutationFn: salesServices.createShowroomVisit,
  });
};

/**
 * Hook for updating showroom visit status
 */
export const useUpdateShowroomVisitStatus = () => {
  return useMutation<
    UpdateShowroomVisitStatusResponse,
    Error,
    { id: number; data: UpdateShowroomVisitStatusRequest }
  >({
    mutationFn: ({ id, data }) => salesServices.updateShowroomVisitStatus(id, data),
  });
};

/**
 * Hook for creating a contract
 */
export const useCreateContract = () => {
  return useMutation<CreateContractResponse, Error, CreateContractRequest>({
    mutationFn: salesServices.createContract,
  });
};

/**
 * Hook for creating a quotation
 */
export const useCreateQuotation = () => {
  return useMutation<CreateQuotationResponse, Error, CreateQuotationRequest>({
    mutationFn: salesServices.createQuotation,
  });
};

