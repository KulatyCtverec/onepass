import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateEventSlug } from "@/lib/utils";
import { checkEventNameExists } from "@/lib/utils-server";
import { Role } from "@prisma/client";
import {
  createEventWithTicketTypes,
  scheduleTicketPoolGeneration,
} from "@/lib/events/handleEventWithTickets";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nepřihlášený uživatel" },
        { status: 401 }
      );
    }

    if (
      session.user.role !== Role.ADMIN &&
      session.user.role !== Role.ORGANIZER
    ) {
      console.warn(
        "[POST /api/events] 403: uživatel nemá roli ORGANIZER/ADMIN. role=",
        session.user.role
      );
      return NextResponse.json(
        {
          error: "Nedostatečná oprávnění",
          message:
            "Vytvářet události mohou pouze uživatelé s rolí Organizátor nebo Admin. Požádejte správce o změnu role.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Extract basic event data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const category = formData.get("category") as string;
    const venue = formData.get("venue") as string;
    const capacity = formData.get("capacity") as string;
    const address = formData.get("address") as string;
    const salesStart = formData.get("salesStart") as string;
    const salesEnd = formData.get("salesEnd") as string;
    const allowResale = formData.get("allowResale") === "true";
    const requireApproval = formData.get("requireApproval") === "true";
    const sendEmails = formData.get("sendEmails") === "true";
    const image = formData.get("image") as string;

    // Extract ticket types
    const ticketTypesJson = formData.get("ticketTypes") as string;
    const ticketTypes = JSON.parse(ticketTypesJson);

    // Validate required fields
    if (!name || !description || !date || !venue || !capacity || !address) {
      return NextResponse.json(
        { message: "Všechna povinná pole musí být vyplněná." },
        { status: 400 }
      );
    }

    // Parse date and validate
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { message: "Neplatné datum události." },
        { status: 400 }
      );
    }

    // Check if event with same name already exists on the same day
    const eventExists = await checkEventNameExists(name, eventDate);
    if (eventExists) {
      return NextResponse.json(
        { message: "Event se stejným názvem už v daný den existuje." },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = generateEventSlug(name, eventDate);

    const { event } = await createEventWithTicketTypes({
      name,
      slug,
      description,
      date: eventDate,
      location: `${venue}, ${address}`,
      image: image ?? null,
      category: category || null,
      venue: venue || null,
      capacity: parseInt(capacity),
      address: address || null,
      startTime: startTime || null,
      endTime: endTime || null,
      salesStart: salesStart ? new Date(salesStart) : null,
      salesEnd: salesEnd ? new Date(salesEnd) : null,
      allowResale,
      requireApproval,
      sendEmails,
      ownerId: session.user.id,
      ticketTypes: ticketTypes
        .filter(
          (tt: { name?: string; price?: string; quantity?: string }) =>
            tt.name && tt.price != null && tt.quantity != null
        )
        .map((tt: { name: string; price: string; quantity: string }) => ({
          name: tt.name,
          price: Math.round(parseFloat(tt.price) * 100),
          quantity: parseInt(tt.quantity),
        })),
    });

    scheduleTicketPoolGeneration(event.id);

    return NextResponse.json(
      {
        message: "Událost vytvořena úspěšně.",
        eventId: event.id,
        slug: event.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating event:", error);
    return NextResponse.json(
      { message: "Chyba při vytváření události." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("take") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Načteme events s paginací a ticketTypes
    const events = await prisma.event.findMany({
      take: Math.min(take, 50), // Maximálně 50 najednou
      skip: skip,
      orderBy: { date: "asc" },
      include: {
        ticketTypes: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[API] Error fetching events:", error);
    return NextResponse.json(
      { error: "Chyba při načítání událostí" },
      { status: 500 }
    );
  }
}
