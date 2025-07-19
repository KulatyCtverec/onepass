"use client";
import { useSSE } from "@/lib/hooks/useSSE";
import type { Ticket } from "@/lib/generated/prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { use, useState } from "react";
import TicketsTable from "@/components/TicketsTable";
export default function Page({
  params,
}: {
  params: Promise<{ eventID: string }>;
}) {
  const { eventID } = use(params);
  const [tickets, setEvents] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  useInitialFetch<Ticket[]>(
    "/api/tickets?eventID=" + eventID,
    { value: tickets, setter: setEvents },
    { value: error, setter: setError }
  );

  useSSE<Ticket>(
    "/api/tickets/stream",
    { value: tickets, setter: setEvents },
    { value: error, setter: setError }
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Události</h1>
      <TicketsTable tickets={tickets} />
    </div>
  );
}
