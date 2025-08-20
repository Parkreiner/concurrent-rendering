import { useCallback, useEffect, useReducer, useState } from "react";

type UseForcePeriodicRerenderResult = Readonly<{
  isActive: boolean;
  lastRenderIso: string | null;
  toggleIsActive: () => void;
}>;

export function useForcePeriodicRerender(
  refreshIntervalMs: number
): UseForcePeriodicRerenderResult {
  const [lastRenderIso, setLastRenderIso] = useState("");
  const [isActive, setIsActive] = useState(false);

  const updateIso = useCallback(() => {
    const newIso = new Date().toISOString();
    setLastRenderIso(newIso);
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const intervalId = window.setInterval(updateIso, refreshIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [updateIso, isActive, refreshIntervalMs]);

  return {
    isActive,
    lastRenderIso: isActive ? lastRenderIso : null,
    toggleIsActive: () => {
      setIsActive(!isActive);
      updateIso();
    },
  };
}
