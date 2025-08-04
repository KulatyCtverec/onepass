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
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">{caption}</h1>
        <div className="grid gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
