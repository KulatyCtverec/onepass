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

    eventSource.onmessage = (event) => {
      const parsedData: SSEMessage<E & { id: string }> = JSON.parse(event.data);
      functionMap[parsedData.type](parsedData.data);
    };

    eventSource.onerror = (err) => {
      console.error("Chyba SSE:", err);
      error.setter("Chyba při komunikaci se serverem.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sseUrl]);

  return { items, error };
}
