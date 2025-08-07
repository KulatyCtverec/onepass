import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Zkontrolovat, zda je uživatel admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  // Načíst události vytvořené tímto adminem
  const events = await prisma.event.findMany({
    where: { createdById: session.user.id },
    include: {
      ticketTypes: true,
      tickets: {
        include: {
          user: true,
          tickettype: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          👑 Admin Dashboard
        </h1>

        <AdminDashboard events={events} />
      </div>
    </main>
  );
}
