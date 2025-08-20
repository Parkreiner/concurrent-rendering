import { useEffect, useReducer, useState } from "react";

type UseForcePeriodicRerenderResult = Readonly<{
  active: boolean;
  toggleActive: () => void;
}>;

export function useForcePeriodicRerender(
  refreshIntervalMs: number
): UseForcePeriodicRerenderResult {
  const [, forceRerender] = useReducer((v) => !v, false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const intervalId = setInterval(forceRerender, refreshIntervalMs);
    return () => clearInterval(intervalId);
  }, [isActive, refreshIntervalMs]);

  return {
    active: isActive,
    toggleActive: () => setIsActive(!isActive),
  };
}
