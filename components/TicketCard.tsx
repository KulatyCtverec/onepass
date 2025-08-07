import Link from "next/link";
import type { Ticket } from "@prisma/client";
import { useState } from "react";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Opravdu chcete tuto událost smazat?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Chyba při mazání.");
    } catch (e) {
      console.error(e);
      setError("Smazání selhalo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/events/${ticket.id}`} className="block h-full">
      <div className="border border-secondary-700 rounded-2xl p-6 bg-black hover:bg-gray-900 transition flex flex-col justify-between h-full cursor-pointer group">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold group-hover:text-primary-400 transition-colors mb-4">
            {ticket.price}
          </h2>
          <p className="text-secondary-400">
            📍 {} | 📅 {ticket.owner}
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
