import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
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

    if (!listing) {
      return NextResponse.json(
        { error: "Nabídka nebyla nalezena." },
        { status: 404 }
      );
    }

    if (listing.status !== "IN_SALE") {
      return NextResponse.json(
        { error: "Nabídka již není k dispozici." },
        { status: 404 }
      );
    }

    const first = listing.tickets[0];
    if (!first) {
      return NextResponse.json(
        { error: "Nabídka nemá žádné lístky." },
        { status: 404 }
      );
    }

    const event = first.event;
    const originalPriceCents = first.tickettype.price;
    const originalPrice =
      originalPriceCents >= 1000 ? originalPriceCents / 100 : originalPriceCents;

    const payload = {
      id: listing.id,
      status: listing.status,
      type: listing.type,
      price: listing.price,
      createdAt: listing.createdAt,
      eventName: event.name,
      eventId: event.id,
      date: event.date,
      startTime: event.startTime,
      location: event.location,
      venue: event.venue,
      category: event.category,
      image: event.image,
      ticketTypeName: first.tickettype.name,
      originalPrice: typeof originalPrice === "number" ? originalPrice : originalPriceCents / 100,
      quantity: listing.tickets.length,
      seller: {
        name: listing.owner.name || listing.owner.email.split("@")[0],
      },
    };
    return NextResponse.json(payload);
  } catch (e) {
    console.error("GET /api/listings/[id]", e);
    return NextResponse.json(
      { error: "Chyba při načítání nabídky." },
      { status: 500 }
    );
  }
}
