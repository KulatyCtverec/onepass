import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("[API] POST /api/events called with request:", request);

  const { name, date, location, description } = await request.json();

  if (!name || !date || !location || !description) {
    console.warn("[API] POST /api/events - missing fields");
    return NextResponse.json(
      { message: "Všechna pole musí být vyplněná." },
      { status: 400 }
    );
  }

  try {
    await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        description,
      },
    });
    console.log("[API] Event created:", { name, date, location });
    return NextResponse.json(
      { message: "Událost vytvořena." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating event:", error);
    return NextResponse.json({ message: "Chyba serveru." }, { status: 500 });
  }
}

export async function GET() {
  // If you want to support filtering, parse query params from request.url here
  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}
