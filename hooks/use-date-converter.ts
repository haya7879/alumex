import { useCallback } from "react";

/**
 * Custom hook for converting date formats
 * Converts dates from DD/MM/YYYY to YYYY-MM-DD format for API usage
 * Formats dates from API format (YYYY-MM-DD) to display format (DD/MM/YYYY)
 */
export function useDateConverter() {
  /**
   * Converts date from DD/MM/YYYY or YYYY-MM-DD to YYYY-MM-DD format
   * @param dateString - Date string in DD/MM/YYYY or YYYY-MM-DD format
   * @returns Date string in YYYY-MM-DD format
   */
  const convertDateToAPIFormat = useCallback((dateString: string): string => {
    if (!dateString) return "";
    
    // If already in YYYY-MM-DD format, validate and return
    if (dateString.includes("-") && dateString.split("-").length === 3) {
      const [year, month, day] = dateString.split("-");
      if (year && month && day && year.length === 4) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return dateString;
    }
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    
    return dateString;
  }, []);

  /**
   * Formats date from API format (YYYY-MM-DD) to display format (DD/MM/YYYY)
   * @param dateString - Date string in YYYY-MM-DD format (can be null)
   * @returns Date string in DD/MM/YYYY format
   */
  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  /**
   * Formats date from Date object to DD/MM/YYYY format
   * @param date - Date object
   * @returns Date string in DD/MM/YYYY format
   */
  const formatDateToDisplay = useCallback((date: Date | undefined): string => {
    if (!date) return "";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  /**
   * Parses date from DD/MM/YYYY or YYYY-MM-DD string to Date object
   * @param dateString - Date string in DD/MM/YYYY or YYYY-MM-DD format
   * @returns Date object or undefined if invalid
   */
  const parseDateFromString = useCallback((dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    // Try DD/MM/YYYY format first
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    // Try YYYY-MM-DD format (from HTML date input)
    const parts2 = dateString.split("-");
    if (parts2.length === 3) {
      const [year, month, day] = parts2;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined;
  }, []);

  return {
    convertDateToAPIFormat,
    formatDate,
    formatDateToDisplay,
    parseDateFromString,
  };
}

