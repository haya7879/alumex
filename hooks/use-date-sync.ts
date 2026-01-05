import { useEffect, useState } from "react";
import { useDateConverter } from "./use-date-converter";

/**
 * Custom hook for syncing date string with Date object
 * Automatically updates Date object when date string changes
 */
export function useDateSync(dateString: string) {
  const { parseDateFromString } = useDateConverter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (dateString) {
      const parsedDate = parseDateFromString(dateString);
      setSelectedDate(parsedDate);
    }
  }, [dateString, parseDateFromString]);

  return {
    selectedDate,
    setSelectedDate,
  };
}

