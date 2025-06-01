"use client";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { Event } from "@prisma/client";

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };
  useEffect(() => {
    fetch("/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setError("Chyba při načítání událostí.");
          return [];
        }
        try {
          return await res.json();
        } catch {
          setError("Neplatná odpověď ze serveru.");
          return [];
        }
      })
      .then(setEvents)
      .catch(() => setError("Chyba při komunikaci se serverem."));
  }, []);
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={handleDelete} />
      ))}
    </div>
  );
}
