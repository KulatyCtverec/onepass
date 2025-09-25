"use client";
import EventCard from "./EventCard";
import type { Event } from "@/lib/generated/prisma/client";
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
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-effect border-border/30 rounded-lg p-8">
          <p className="text-foreground-muted text-lg">
            Žádné události nebyly nalezeny.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">{caption}</h1>
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
