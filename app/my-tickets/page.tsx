"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Ticket = {
  id: string;
  eventTitle: string;
  date: string;
  location: string;
  nftMinted: boolean;
};

const dummyTickets: Ticket[] = [
  {
    id: "1",
    eventTitle: "NFT Fest Praha",
    date: "2025-06-20",
    location: "Forum Karlín, Praha",
    nftMinted: true,
  },
  {
    id: "2",
    eventTitle: "Blockchain Meetup Brno",
    date: "2025-07-12",
    location: "Impact Hub, Brno",
    nftMinted: false,
  },
  {
    id: "3",
    eventTitle: "Crypto Music Night",
    date: "2025-08-03",
    location: "ROXY, Praha",
    nftMinted: true,
  },
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulace načítání lístků z API nebo blockchainu
  useEffect(() => {
    setTimeout(() => {
      setTickets(dummyTickets); // Tady bys mohl nahradit pravými daty z API
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
        <p className="text-gray-400">
          Nemáte žádné zakoupené nebo mintnuté lístky.
        </p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-800 rounded-2xl p-6 bg-gray-900 hover:bg-gray-800 transition"
            >
              <h2 className="text-2xl font-semibold">{ticket.eventTitle}</h2>
              <p className="text-gray-400">
                📍 {ticket.location} | 📅{" "}
                {new Date(ticket.date).toLocaleDateString("cs-CZ")}
              </p>
              <p
                className={`mt-2 text-sm ${
                  ticket.nftMinted ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {ticket.nftMinted ? "Mintnuto jako NFT" : "Nezaloženo jako NFT"}
              </p>
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
