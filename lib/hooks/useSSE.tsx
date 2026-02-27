import { useEffect } from "react";
import type { StateWithSetter, SSEMessage } from "@/lib/hooks/hookTypes/types";

export function useSSE<E extends { id: string }>(
  sseUrl: string,
  items: StateWithSetter<E[]>,
  error: StateWithSetter<string | null>
) {
  const handleCreate = (parsedData: E) => {
    items.setter((prev: E[]) => {
      if (
        !prev.some(
          (item: E) => item.id === (parsedData as E & { id: string }).id
        )
      ) {
        return [...prev, parsedData];
      }
      return prev;
    });
  };

  const handleUpdate = (parsedData: E & { id: string }) => {
    items.setter((prev: E[]) =>
      prev.map((item: E & { id: string }) =>
        item.id === parsedData.id ? { ...item, ...parsedData } : item
      )
    );
  };
  const handleDelete = (parsedData: E & { id: string }) => {
    items.setter((prev: E[]) =>
      prev.filter((item: E & { id: string }) => item.id !== parsedData.id)
    );
  };

  const functionMap = {
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
  };

  useEffect(() => {
    const eventSource = new EventSource(sseUrl);
    let hasError = false;

    eventSource.onmessage = (event) => {
      try {
        const parsedData: SSEMessage<E & { id: string }> = JSON.parse(
          event.data
        );
        functionMap[parsedData.type](parsedData.data);
        // Pokud se zpráva podaří zpracovat, vymaž chybu
        if (hasError) {
          hasError = false;
          error.setter(null);
        }
      } catch (e) {
        console.error("Chyba při zpracování SSE zprávy:", e);
      }
    };

    eventSource.onerror = (err) => {
      // EventSource automaticky reconnectuje, takže jen logujeme
      // Zavřeme připojení pouze pokud je readyState CLOSED (3)
      if (eventSource.readyState === EventSource.CLOSED) {
        console.error("Chyba SSE: připojení bylo uzavřeno", err);
        // Nastavíme chybu pouze pokud už nebyla nastavena (např. z useInitialFetch)
        if (!hasError) {
          hasError = true;
          // Nepřepisujeme chybu z useInitialFetch, pokud už existuje
          error.setter((prev) => prev || "Chyba při komunikaci se serverem.");
        }
        eventSource.close();
      } else {
        // Při reconnectu jen logujeme, EventSource se pokusí znovu připojit
        console.warn("SSE reconnect...", eventSource.readyState);
      }
    };

    eventSource.onopen = () => {
      // Když se připojení otevře, vymaž chyby
      if (hasError) {
        hasError = false;
        error.setter(null);
      }
    };

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sseUrl]);

  return { items, error };
}

