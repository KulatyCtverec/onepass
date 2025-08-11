import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code required" },
        { status: 400 }
      );
    }

    // Najdeme ticket podle access code
    const ticket = await prisma.ticket.findUnique({
      where: { accesscode: accessCode },
      include: { event: true, user: true, tickettype: true },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 404 }
      );
    }

    // Kontrola, zda už nebyl použit
    if (ticket.used) {
      return NextResponse.json(
        {
          error: "Ticket already used",
          ticket: {
            id: ticket.id,
            eventName: ticket.event.name,
            usedAt: ticket.lastScanned,
          },
        },
        { status: 400 }
      );
    }

    // Kontrola, zda událost ještě neproběhla
    if (new Date() > ticket.event.date) {
      return NextResponse.json(
        {
          error: "Event has already passed",
          ticket: {
            id: ticket.id,
            eventName: ticket.event.name,
            eventDate: ticket.event.date,
          },
        },
        { status: 400 }
      );
    }

    // Označíme ticket jako použitý
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        used: true,
        lastScanned: new Date(),
        scanCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ticket verified successfully",
      ticket: {
        id: ticket.id,
        eventName: ticket.event.name,
        userName: ticket.user.name,
        ticketType: ticket.tickettype.name,
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Ticket verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
