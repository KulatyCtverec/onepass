import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** Listingy přihlášeného uživatele (v prodeji), s eventem a počtem lístků. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  const listings = await prisma.listing.findMany({
    where: {
      ownerId: session.user.id,
      status: "IN_SALE",
    },
    include: {
      _count: { select: { tickets: true } },
      tickets: {
        take: 1,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
              image: true,
            },
          },
          tickettype: { select: { name: true, price: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = listings.map((l) => {
    const first = l.tickets[0];
    const event = first?.event;
    const ticketType = first?.tickettype;
    const originalPrice =
      ticketType && ticketType.price >= 1000
        ? ticketType.price / 100
        : ticketType?.price ?? 0;
    return {
      id: l.id,
      eventId: event?.id,
      title: event?.name,
      date: event?.date,
      location: event?.location,
      image: event?.image,
      ticketsOwned: l._count.tickets,
      originalPrice,
      resalePrice: l.price,
    };
  });

  return NextResponse.json(mapped);
}
