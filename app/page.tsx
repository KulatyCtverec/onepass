import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomepageEventsTable from "@/components/HomepageEventsTable";

export default async function Home() {
  // Načíst první 4 události pro homepage
  const events = await prisma.event.findMany({
    take: 4,
    orderBy: { date: "asc" },
    include: {
      ticketTypes: true,
    },
  });

  return (
    <main className="min-h-screen text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">🎟 OnePass</h1>
          <p className="text-lg md:text-xl text-secondary-400 mb-8">
            Nejlepší platforma pro správu a prodej vstupenek na události
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 transition text-white"
            >
              Procházet události
            </Link>
            <Link
              href="/create-event"
              className="px-6 py-3 rounded-2xl bg-secondary-700 hover:bg-secondary-600 transition"
            >
              Vytvořit událost
            </Link>
          </div>
        </div>

        {/* Events Table Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Nejbližší události</h2>
            <Link
              href="/events"
              className="text-accent-400 hover:text-accent-300 transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>

          <HomepageEventsTable events={events} />
        </div>
      </div>
    </main>
  );
}
