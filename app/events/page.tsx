"use client";
import { useSSE } from "@/lib/hooks/useSSE";
import type { Event } from "@/lib/generated/prisma/client";
import EventsTable from "@/components/EventsTable";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { useState } from "react";
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  useInitialFetch<Event[]>(
    "/api/events",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );
  useSSE<Event>(
    "/api/events/stream",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Události</h1>
      <EventsTable events={events} />
    </div>
  );
}
