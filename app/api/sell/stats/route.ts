import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** Statistiky pro stránku Prodávat lístky: lístky v prodeji, peníze z aktivních listingů, peníze prodané (po eventu). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  const myListingsInSale = await prisma.listing.findMany({
    where: {
      ownerId: session.user.id,
      status: "IN_SALE",
    },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  const ticketsInSale = myListingsInSale.reduce((acc, l) => acc + l._count.tickets, 0);
  const moneyToReceive = myListingsInSale.reduce(
    (acc, l) => acc + l.price * l._count.tickets,
    0
  );

  // Peníze prodané = zatím bez tabulky prodejů; po ukončení eventu by šly vyplácet. Pro teď 0.
  const moneySold = 0;

  return NextResponse.json({
    ticketsInSale,
    moneyToReceive,
    moneySold,
  });
}
