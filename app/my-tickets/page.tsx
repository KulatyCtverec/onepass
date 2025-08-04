"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Ticket } from "@/lib/generated/prisma/client";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulace načítání lístků z API nebo blockchainu
  useEffect(() => {
    setTimeout(() => {
      setTickets([]); // Tady bys mohl nahradit pravými daty z API
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Načítání vašich lístků...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Moje lístky</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-400">Nemáte žádné zakoupené lístky.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-800 rounded-2xl p-6 bg-gray-900 hover:bg-gray-800 transition"
            >
              <button
                onClick={() => router.push(`/events/${ticket.id}`)}
                className="inline-block mt-4 text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
              >
                Detail lístku
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
