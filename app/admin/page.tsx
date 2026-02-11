import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";
import { Role } from "@/lib/generated/prisma";
export default async function AdminPage() {
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
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        <AdminDashboard events={events} />
      </div>
    </main>
  );
}
