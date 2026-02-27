import { useState, useEffect } from "react";

/**
 * Hook pro debouncing hodnoty (např. vyhledávacího dotazu).
 * @param value Hodnota, která se má debouncovat.
 * @param delay Zpoždění v milisekundách.
 * @returns Debouncovaná hodnota.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

