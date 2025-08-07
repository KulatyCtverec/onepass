"use client";
import { use } from "react";
import type { Event } from "@prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import TicketTypes from "@/components/TicketTypes";
import SeatMap from "@/components/SeatMap";
import Link from "next/link";

export default function EventDetail({
  eventID,
}: {
  eventID: Promise<{ eventID: string }>;
}) {
  const { eventID: id } = use(eventID);
  const record = useInitialFetch<Event>(`/api/events/${id}`);

  if (!record) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-12">
          <p className="text-secondary-400">⏳ Načítám událost...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <Link
          href="/events"
          className="text-primary-400 hover:text-primary-300 transition"
        >
          ← Zpět na události
        </Link>
      </div>

      <div className="bg-black rounded-2xl p-8 border border-secondary-700">
        <h1 className="text-4xl font-bold mb-4">{record.name}</h1>

        <p className="text-lg text-secondary-400 mb-4">
          📍 {record.location} | 📅{" "}
          {new Date(record.date).toLocaleDateString("cs-CZ")}
        </p>

        <p className="text-secondary-300 mb-6">{record.description}</p>

        <div className="flex justify-between mt-20 mb-20">
          <SeatMap />
          <TicketTypes />
        </div>

        <div className="flex justify-center">
          <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-lg transition">
            Koupit vstupenku
          </button>
        </div>
      </div>
    </div>
  );
}
