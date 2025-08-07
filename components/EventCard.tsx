"use client";
import Link from "next/link";
import type { Event } from "@prisma/client";
import { useState } from "react";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Opravdu chcete tuto událost smazat?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Chyba při mazání.");
    } catch (e) {
      console.error(e);
      setError("Smazání selhalo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <div className="border border-secondary-700 rounded-2xl p-6 bg-black hover:bg-gray-900 transition flex flex-col justify-between h-full cursor-pointer group">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold group-hover:text-primary-400 transition-colors mb-4">
            {event.name}
          </h2>
          <p className="text-secondary-400">
            📍 {event.location} | 📅{" "}
            {new Date(event.date).toLocaleDateString("cs-CZ")}
          </p>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition"
            title="Smazat událost"
          >
            {loading ? "Mažu..." : "Smazat"}
          </button>
        </div>
      </div>
    </Link>
  );
}
