"use client";

import { useQuery } from "@tanstack/react-query";
import { kpisServices, AuthorizedCompany, SalesDashboardKPIs } from "./kpis-services";

/**
 * Hook for fetching Authorized Companies
 */
export const useAuthorizedCompanies = () => {
  return useQuery<AuthorizedCompany[]>({
    queryKey: ["authorized-companies"],
    queryFn: kpisServices.getAuthorizedCompanies,
  });
};

/**
 * Hook for fetching Dashboard KPIs
 */
export const useDashboardKPIs = () => {
  return useQuery<SalesDashboardKPIs>({
    queryKey: ["dashboard-kpis"],
    queryFn: kpisServices.getDashboardKPIs,
  });
};

