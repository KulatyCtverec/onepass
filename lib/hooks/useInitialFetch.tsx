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
        if (!res.ok) throw new Error("Chyba při načítání dat.");
        const json = await res.json();
        setData(json);

        if (items) items.setter(json);
      } catch (e) {
        console.error("Chyba při načítání dat:", e);
        if (error) error.setter("Chyba při komunikaci se serverem:");
      }
      return data;
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
}
