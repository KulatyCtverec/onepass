import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-primary neon-glow">
                <Image
                  src="/onepass-logo.svg"
                  alt="OnePass Logo"
                  width={48}
                  height={40}
                  className="filter brightness-0 invert"
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
              OnePass
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent neon-text">
                Platforma
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Nejlepší platforma pro správu a prodej vstupenek na události. Objevte koncerty, festivaly, sportovní události a mnohem více.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="glass-button px-8 py-4 rounded-xl text-lg font-medium hover:scale-105 transition-all duration-300"
              >
                Procházet události
              </Link>
              <Link
                href="/create-event"
                className="px-8 py-4 rounded-xl text-lg font-medium bg-gradient-primary text-white hover:scale-105 transition-all duration-300 neon-glow"
              >
                Vytvořit událost
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Table Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Nejbližší události</h2>
            <Link
              href="/events"
              className="text-primary hover:text-primary-dark transition-colors text-lg font-medium"
            >
              Zobrazit všechny →
            </Link>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 backdrop-blur-sm">
            <HomepageEventsTable events={events} />
          </div>
        </div>
      </section>
    </main>
  );
}
