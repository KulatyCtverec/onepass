// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 py-12">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Vstupenky budoucnosti.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Vytvářej, prodávej a spravuj vstupenky jako NFT. Žádné podvody, žádné
          scalpingy - jen blockchainová jistota.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/events"
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Prohlédnout události
          </Link>
          <Link
            href="/create-event"
            className="px-6 py-3 rounded-2xl border border-white hover:bg-white hover:text-black transition"
          >
            Vytvořit událost
          </Link>
        </div>
      </div>
    </main>
  );
}
