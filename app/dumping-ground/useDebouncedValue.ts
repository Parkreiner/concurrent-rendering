import { useEffect, useState } from "react";

export function useDebounedValue<T>(value: T, debounceIntervalMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebounced(value);
    }, debounceIntervalMs);
    return () => window.clearTimeout(timeoutId);
  }, [value, debounceIntervalMs]);

  return debounced;
}
