import { useCallback, useEffect, useState } from "react";

type UseForcePeriodicRerenderResult = Readonly<{
  lastRefresh: Date | null;
  toggleIsActive: () => void;
}>;

export function useForcePeriodicRefresh(
  refreshIntervalMs: number
): UseForcePeriodicRerenderResult {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);

  const updateDate = useCallback(() => {
    const newTime = new Date();
    setLastRefresh(newTime);
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const intervalId = window.setInterval(updateDate, refreshIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [updateDate, isActive, refreshIntervalMs]);

  return {
    lastRefresh: isActive ? lastRefresh : null,
    toggleIsActive: () => {
      setIsActive(!isActive);
      updateDate();
    },
  };
}
