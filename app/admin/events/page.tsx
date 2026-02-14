import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminEventsList from "@/components/AdminEventsList";
import { Role } from "@prisma/client";

export default async function AdminEventsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Zkontrolovat, zda je uživatel admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== Role.ADMIN) {
    redirect("/");
  }

  // Načíst události vytvořené tímto adminem
  const events = await prisma.event.findMany({
    where: { ownerId: session.user.id },
    include: {
      ticketTypes: true,
      tickets: {
        include: {
          owner: true,
          tickettype: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Administrace událostí</h1>
          <a
            href="/create-event"
            className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Vytvořit novou událost
          </a>
        </div>

        <AdminEventsList events={events} />
      </div>
    </main>
  );
}
