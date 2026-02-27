import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** Lístky přihlášeného uživatele, které nejsou v žádném listingu (lze přidat k prodeji). Lístky s listingId jsou „v přeprodeji“ a nelze je přidat do jiného listingu. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      ownerId: session.user.id,
      listingId: null,
    },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          date: true,
          startTime: true,
          location: true,
          image: true,
          allowResale: true,
        },
      },
      tickettype: { select: { id: true, name: true, price: true } },
    },
    orderBy: [{ event: { date: "asc" } }, { createtime: "asc" }],
  });

  return NextResponse.json(tickets);
}

