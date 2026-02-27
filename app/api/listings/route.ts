import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function mapListingToCard(listing: {
  id: string;
  price: number;
  createdAt: Date;
  status: string;
  type: string;
  owner: { id: string; name: string | null; email: string };
  tickets: Array<{
    id: string;
    event: {
      id: string;
      name: string;
      date: Date;
      startTime: string | null;
      location: string;
      venue: string | null;
      category: string | null;
      image: string | null;
    };
    tickettype: { id: string; name: string; price: number };
  }>;
}) {
  const first = listing.tickets[0];
  if (!first) return null;
  const event = first.event;
  const originalPriceCents = first.tickettype.price;
  const originalPrice = originalPriceCents >= 1000 ? originalPriceCents / 100 : originalPriceCents;
  const resalePrice = listing.price;
  const savings = originalPrice - resalePrice;
  return {
    id: listing.id,
    eventTitle: event.name,
    eventId: event.id,
    originalPrice: typeof originalPrice === "number" ? originalPrice : originalPriceCents / 100,
    resalePrice,
    savings,
    date: event.date,
    time: event.startTime || "—",
    location: event.location,
    venue: event.venue,
    category: event.category,
    ticketType: first.tickettype.name,
    quantity: listing.tickets.length,
    seller: {
      name: listing.owner.name || listing.owner.email.split("@")[0],
      verified: true,
      rating: null as number | null,
    },
    listedDate: listing.createdAt,
    image: event.image,
    status: listing.status,
    type: listing.type,
  };
}

export async function GET(request: NextRequest) {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "IN_SALE", type: "OFFER" },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        tickets: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                date: true,
                startTime: true,
                location: true,
                venue: true,
                category: true,
                image: true,
              },
            },
            tickettype: { select: { id: true, name: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = listings
      .map(mapListingToCard)
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return NextResponse.json(mapped);
  } catch (e) {
    console.error("GET /api/listings", e);
    return NextResponse.json(
      { error: "Chyba při načítání nabídek." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { ticketIds, price } = body as { ticketIds?: string[]; price?: number };

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0 || typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { message: "Vyberte alespoň jeden lístek a zadejte cenu." },
        { status: 400 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: { id: { in: ticketIds } },
      include: { event: true, tickettype: true },
    });

    if (tickets.length !== ticketIds.length) {
      return NextResponse.json(
        { message: "Některé lístky nebyly nalezeny." },
        { status: 400 }
      );
    }

    const notOwned = tickets.filter((t) => t.ownerId !== session.user!.id);
    if (notOwned.length > 0) {
      return NextResponse.json(
        { message: "Některé lístky vám nepatří." },
        { status: 403 }
      );
    }

    const alreadyListed = tickets.filter((t) => t.listingId != null);
    if (alreadyListed.length > 0) {
      return NextResponse.json(
        { message: "Některé lístky jsou již v jiné nabídce." },
        { status: 400 }
      );
    }

    const eventId = tickets[0].eventid;
    const ticketTypeId = tickets[0].tickettypeid;
    const sameEventAndType = tickets.every(
      (t) => t.eventid === eventId && t.tickettypeid === ticketTypeId
    );
    if (!sameEventAndType) {
      return NextResponse.json(
        { message: "Všechny lístky musí být stejného typu a události." },
        { status: 400 }
      );
    }

    const allowResale = tickets[0].event.allowResale;
    if (!allowResale) {
      return NextResponse.json(
        { message: "Přeprodej není u této události povolen." },
        { status: 400 }
      );
    }

    const listing = await prisma.$transaction(async (tx) => {
      const created = await tx.listing.create({
        data: {
          price: Math.round(price),
          ownerId: session.user!.id,
        },
      });
      await tx.ticket.updateMany({
        where: { id: { in: ticketIds } },
        data: { listingId: created.id },
      });
      return created;
    });

    const withRelations = await prisma.listing.findUnique({
      where: { id: listing.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        tickets: {
          include: {
            event: true,
            tickettype: true,
          },
        },
      },
    });
    return NextResponse.json(withRelations);
  } catch (e) {
    console.error("POST /api/listings", e);
    return NextResponse.json(
      { error: "Chyba při vytváření nabídky." },
      { status: 500 }
    );
  }
}

