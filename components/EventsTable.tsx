"use client";
import EventCard from "./EventCard";
import type { Event } from "@prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { useSSE } from "@/lib/hooks/useSSE";
import { useState } from "react";

export default function EventsTable(props: { caption: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { caption } = props;
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
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-400">Žádné události nebyly nalezeny.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{caption}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <div key={event.id} className="aspect-[4/3]">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
