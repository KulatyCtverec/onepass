"use client";
import { use } from "react";
import type { Event } from "@/lib/generated/prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import TicketTypes from "@/components/TicketTypes";
import SeatMap from "@/components/SeatMap";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventID: string }>;
}) {
  const { eventID } = use(params);
  const record = useInitialFetch<Event>(`/api/events/${eventID}`);
  if (!record) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        ⏳ Načítám událost...
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">{record.name}</h1>

      <p className="text-lg text-gray-400 mb-4">
        📍 {record.location} | 📅{" "}
        {new Date(record.date).toLocaleDateString("cs-CZ")}
      </p>

      <p className="text-gray-300 mb-6">{record.description}</p>

      <div className="flex justify-between mt-20 mb-20">
        <SeatMap /> <TicketTypes />
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg transition">
          Koupit vstupenku
        </button>
      </div>
    </div>
  );
}
