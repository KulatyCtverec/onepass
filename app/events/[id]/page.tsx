"use client";

import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

const dummyEvent: Event = {
  id: "1",
  title: "NFT Fest Praha",
  date: "2025-06-20",
  location: "Forum Karlín, Praha",
  description:
    "NFT Fest Praha je jedním z největších festivalů zaměřených na technologie blockchainu a NFT. Připojte se k nám a získejte exkluzivní NFT vstupenky!",
};

export default function EventDetailPage() {
  const { push } = useRouter();
  const id = "1"; // V tomto případě simuluji, že id je '1'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">{dummyEvent.title}</h1>

      <p className="text-lg text-gray-400 mb-4">
        📍 {dummyEvent.location} | 📅{" "}
        {new Date(dummyEvent.date).toLocaleDateString("cs-CZ")}
      </p>

      <p className="text-gray-300 mb-6">{dummyEvent.description}</p>

      <div className="flex justify-center">
        <button
          onClick={() => push(`/events/${id}/mint`)} // Pokud chceš přidat akci na koupit/mint
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg transition"
        >
          Koupit NFT vstupenku
        </button>
      </div>
    </div>
  );
}
