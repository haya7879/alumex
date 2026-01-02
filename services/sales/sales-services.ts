import apiClient from "@/lib/api-client";

// Types for Sales Dashboard KPIs
export interface SalesDashboardKPIs {
  summary: {
    total_forms: number;
    total_quotations: number;
    total_contracts: number;
    total_offers_value: number;
  };
  monthly: {
    quotations: number;
    contracts: number;
  };
  sales_insights: {
    avg_offer_value: number;
    conversion_rate: number;
  };
  pricing_insights: {
    top_sections_by_value: Array<{
      section_name: string;
      value: number;
    }>;
    avg_price_per_section: Array<{
      section_name: string;
      avg_price: number;
    }>;
    negotiated_sections: Array<{
      section_name: string;
      negotiated_count: number;
    }>;
  };
}

// Types for Authorized Companies
export interface AuthorizedCompany {
  id: number;
  name: string;
}

// Types for Sales Agents
export interface SalesAgent {
  id: number;
  name: string;
}

// Types for Sections
export interface Section {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Types for Create Section
export interface CreateSectionRequest {
  name: string;
}

export interface CreateSectionResponse {
  message?: string;
  data?: Section;
}

// Types for Update Section
export interface UpdateSectionRequest {
  name: string;
}

export interface UpdateSectionResponse {
  message?: string;
  data?: Section;
}

// Types for Project Name Check
export interface CheckProjectNameResponse {
  exists: boolean;
  original: {
    id: number;
    form_name: string;
    serial_number: string;
  } | null;
}

// Types for Create Form
export interface CreateFormRequest {
  authorized_company_id: number;
  engineer_name: string;
  sales_agent_id: number;
  form_name: string;
  phone1: string;
  phone2?: string;
  project_type: string;
  project_stage: string;
  entry_date: string;
  address: string;
  parent_id?: number;
}

export interface CreateFormResponse {
  message: string;
  data: {
    id: number;
    serial_number: string;
    form_name: string;
    engineer_name: string;
    phones: {
      phone1: string;
      phone2?: string;
    };
    project: {
      type: string;
      stage: string;
    };
    entry_date: string;
    address: string;
    status: string;
    authorized_company: {
      id: number;
      name: string;
    };
    sales_agent: {
      id: number;
      name: string;
    };
    parent: {
      id: number;
      form_name: string;
      serial_number: string;
    } | null;
  };
}

// Types for Create Follow-Up
export interface CreateFollowUpRequest {
  form_id: number;
  notes: string[];
}

export interface CreateFollowUpResponse {
  message?: string;
  data?: any;
}

// Types for Create Measurements
export interface MeasurementRequest {
  section_id: number;
  width: number;
  height: number;
  qty: number;
  floor: string;
  location: string;
  price_per_meter: number;
  is_selected_for_quote: boolean;
}

export interface CreateMeasurementsRequest {
  form_id: number;
  measurements: MeasurementRequest[];
}

export interface CreateMeasurementsResponse {
  message: string;
}

// Types for Forms List
export interface FollowUpNote {
  note: string;
  user: string;
  date: string;
}

export interface FormData {
  id: number;
  form_name: string;
  serials: {
    current: string;
    parent: string | null;
  };
  status: string;
  entry_date: string;
  quotation: {
    id: number;
    offer_number: string;
    offer_date: string;
    total_value: number;
  } | null;
  follow_ups: FollowUpNote[];
}

export interface FormsListResponse {
  data: FormData[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Types for Daily Movements
export interface DailyMovementData {
  id: number;
  customer_name: string;
  phone: string;
  location: string;
  movement_date: string;
  status: "completed" | "not-completed" | "postponed";
  follow_up_date: string | null;
  sales_user: {
    id: number;
    name: string;
  };
  is_postponed: boolean;
  is_due_follow_up: boolean;
}

export interface DailyMovementsListResponse {
  data: DailyMovementData[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Types for Showroom Visits
export interface ShowroomVisitData {
  id: number;
  customer_name: string;
  phone: string;
  location: string;
  visit_date: string;
  status: string;
  notes: string | null;
  sales_user: {
    id: number;
    name: string;
  };
  has_form: boolean;
}

export interface ShowroomVisitsListResponse {
  data: ShowroomVisitData[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Types for Create Showroom Visit
export interface CreateShowroomVisitRequest {
  customer_name: string;
  location: string;
  phone: string;
  visit_date: string;
  status: string;
  notes?: string;
}

export interface CreateShowroomVisitResponse {
  message?: string;
  data?: ShowroomVisitData;
}

// Types for Update Showroom Visit Status
export interface UpdateShowroomVisitStatusRequest {
  status: string;
  notes?: string;
}

export interface UpdateShowroomVisitStatusResponse {
  message?: string;
  data?: ShowroomVisitData;
}

// Types for Create Daily Movement
export interface CreateDailyMovementRequest {
  location: string;
  customer_name: string;
  phone: string;
  movement_date: string;
  status: "completed" | "not-completed" | "postponed";
  follow_up_date?: string;
}

export interface CreateDailyMovementResponse {
  message?: string;
  data?: DailyMovementData;
}

// Types for Update Daily Movement Status
export interface UpdateDailyMovementStatusRequest {
  status: "completed" | "not-completed" | "postponed";
  follow_up_date?: string;
}

export interface UpdateDailyMovementStatusResponse {
  message?: string;
  data?: DailyMovementData;
}

// Sales Services
export const salesServices = {
  /**
   * Get Sales Dashboard KPIs
   */
  getDashboardKPIs: async (): Promise<SalesDashboardKPIs> => {
    try {
      const response = await apiClient.get<SalesDashboardKPIs>(
        "/sales/dashboard/kpis"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sales dashboard KPIs:", error);
      throw error;
    }
  },

  /**
   * Get Authorized Companies
   */
  getAuthorizedCompanies: async (): Promise<AuthorizedCompany[]> => {
    try {
      const response = await apiClient.get<AuthorizedCompany[]>(
        "/sales/authorized-companies"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch authorized companies:", error);
      throw error;
    }
  },

  /**
   * Get Sales Agents
   */
  getSalesAgents: async (): Promise<SalesAgent[]> => {
    try {
      const response = await apiClient.get<SalesAgent[]>(
        "/sales/sales-agents"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sales agents:", error);
      throw error;
    }
  },

  /**
   * Get Sections
   */
  getSections: async (): Promise<Section[]> => {
    try {
      const response = await apiClient.get<Section[]>(
        "/sales/sections"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      throw error;
    }
  },

  /**
   * Create Section
   */
  createSection: async (data: CreateSectionRequest): Promise<CreateSectionResponse> => {
    try {
      const response = await apiClient.post<CreateSectionResponse>(
        "/sales/sections",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create section:", error);
      throw error;
    }
  },

  /**
   * Get Section by ID
   */
  getSection: async (id: number): Promise<Section> => {
    try {
      const response = await apiClient.get<Section>(
        `/sales/sections/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch section:", error);
      throw error;
    }
  },

  /**
   * Update Section
   */
  updateSection: async (
    id: number,
    data: UpdateSectionRequest
  ): Promise<UpdateSectionResponse> => {
    try {
      const response = await apiClient.put<UpdateSectionResponse>(
        `/sales/sections/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update section:", error);
      throw error;
    }
  },

  /**
   * Delete Section
   */
  deleteSection: async (id: number): Promise<{ message?: string }> => {
    try {
      const response = await apiClient.delete<{ message?: string }>(
        `/sales/sections/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete section:", error);
      throw error;
    }
  },

  /**
   * Check if project name exists
   */
  checkProjectName: async (
    formName: string
  ): Promise<CheckProjectNameResponse> => {
    try {
      const response = await apiClient.get<CheckProjectNameResponse>(
        "/sales/forms/check-project-name",
        {
          params: {
            form_name: formName,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to check project name:", error);
      throw error;
    }
  },

  /**
   * Create a new form
   */
  createForm: async (
    formData: CreateFormRequest
  ): Promise<CreateFormResponse> => {
    try {
      const response = await apiClient.post<CreateFormResponse>(
        "/sales/forms",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create form:", error);
      throw error;
    }
  },

  /**
   * Create follow-up notes
   */
  createFollowUp: async (
    followUpData: CreateFollowUpRequest
  ): Promise<CreateFollowUpResponse> => {
    try {
      const response = await apiClient.post<CreateFollowUpResponse>(
        "/sales/follow-ups",
        followUpData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create follow-up:", error);
      throw error;
    }
  },

  /**
   * Create measurements (bulk add)
   */
  createMeasurements: async (
    measurementsData: CreateMeasurementsRequest
  ): Promise<CreateMeasurementsResponse> => {
    try {
      const response = await apiClient.post<CreateMeasurementsResponse>(
        "/sales/measurements",
        measurementsData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create measurements:", error);
      throw error;
    }
  },

  /**
   * Get forms list
   */
  getForms: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<FormsListResponse> => {
    try {
      const response = await apiClient.get<FormsListResponse>("/sales/forms", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch forms:", error);
      throw error;
    }
  },

  /**
   * Get daily movements list
   */
  getDailyMovements: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<DailyMovementsListResponse> => {
    try {
      const response = await apiClient.get<DailyMovementsListResponse>(
        "/sales/daily-movements",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch daily movements:", error);
      throw error;
    }
  },

  /**
   * Create Daily Movement
   */
  createDailyMovement: async (
    data: CreateDailyMovementRequest
  ): Promise<CreateDailyMovementResponse> => {
    try {
      const response = await apiClient.post<CreateDailyMovementResponse>(
        "/sales/daily-movements",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create daily movement:", error);
      throw error;
    }
  },

  /**
   * Update Daily Movement Status
   */
  updateDailyMovementStatus: async (
    id: number,
    data: UpdateDailyMovementStatusRequest
  ): Promise<UpdateDailyMovementStatusResponse> => {
    try {
      const response = await apiClient.patch<UpdateDailyMovementStatusResponse>(
        `/sales/daily-movements/${id}/status`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update daily movement status:", error);
      throw error;
    }
  },

  /**
   * Get showroom visits list
   */
  getShowroomVisits: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<ShowroomVisitsListResponse> => {
    try {
      const response = await apiClient.get<ShowroomVisitsListResponse>(
        "/sales/showroom-visits",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch showroom visits:", error);
      throw error;
    }
  },

  /**
   * Create Showroom Visit
   */
  createShowroomVisit: async (
    data: CreateShowroomVisitRequest
  ): Promise<CreateShowroomVisitResponse> => {
    try {
      const response = await apiClient.post<CreateShowroomVisitResponse>(
        "/sales/showroom-visits",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create showroom visit:", error);
      throw error;
    }
  },

  /**
   * Update Showroom Visit Status
   */
  updateShowroomVisitStatus: async (
    id: number,
    data: UpdateShowroomVisitStatusRequest
  ): Promise<UpdateShowroomVisitStatusResponse> => {
    try {
      const response = await apiClient.patch<UpdateShowroomVisitStatusResponse>(
        `/sales/showroom-visits/${id}/status`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update showroom visit status:", error);
      throw error;
    }
  },
};

