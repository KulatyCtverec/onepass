"use client";
import EventCard from "./EventCard";
import type { Event } from "@prisma/client";
export default function EventsTable(props: { events: Event[] }) {
  const { events } = props;
  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
