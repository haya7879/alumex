import apiClient from "@/lib/api-client";

// Types for Authorized Companies
export interface AuthorizedCompany {
  id: number;
  name: string;
}

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

// KPIs Services
export const kpisServices = {
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
   * Get Dashboard KPIs
   */
  getDashboardKPIs: async (): Promise<SalesDashboardKPIs> => {
    try {
      const response = await apiClient.get<SalesDashboardKPIs>(
        "/sales/dashboard/kpis"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard KPIs:", error);
      throw error;
    }
  },
};

