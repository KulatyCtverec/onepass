import { useEffect, useState } from "react";
import type { StateWithSetter } from "@/lib/hooks/hookTypes/types";

export function useInitialFetch<T>(
  apiUrl: string,
  items?: StateWithSetter<T>,
  error?: StateWithSetter<string | null>
) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || errorData.error || "Chyba při načítání dat."
          );
        }
        const json = await res.json();
        setData(json);

        if (items) items.setter(json);
        // Vymaž chybu při úspěšném načtení
        if (error) error.setter(null);
      } catch (e) {
        console.error("Chyba při načítání dat:", e);
        if (error) {
          const errorMessage =
            e instanceof Error ? e.message : "Chyba při načítání dat.";
          error.setter(errorMessage);
        }
      }
      return data;
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
}
