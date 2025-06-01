import Link from "next/link";
import type { Event } from "@prisma/client";
import { useState } from "react";

type EventCardProps = {
  event: Event;
  onDelete?: (id: string) => void; // Volitelný callback pro refresh po smazání
};

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Opravdu chcete tuto událost smazat?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Chyba při mazání.");
      if (onDelete) onDelete(event.id);
    } catch (e) {
      console.error(e);
      setError("Smazání selhalo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900 hover:bg-gray-800 transition flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">{event.name}</h2>
        <p className="text-gray-400">
          📍 {event.location} | 📅{" "}
          {new Date(event.date).toLocaleDateString("cs-CZ")}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="inline-block mt-4 text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
        >
          Detail &gt;
        </Link>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition"
        title="Smazat událost"
      >
        {loading ? "Mažu..." : "Smazat"}
      </button>
    </div>
  );
}
