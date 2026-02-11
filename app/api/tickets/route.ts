import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const eventID = request.nextUrl.searchParams.get("eventID");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  // Pokud není eventID, vrať všechny lístky přihlášeného uživatele
  if (!eventID) {
    const tickets = await prisma.ticket.findMany({
      include: {
        event: true,
        owner: true,
        tickettype: true,
      },
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createtime: "desc",
      },
    });

    return NextResponse.json(tickets);
  }

  // Pokud je eventID, vrať lístky pro konkrétní událost
  const tickets = await prisma.ticket.findMany({
    include: {
      event: true,
      owner: true,
      tickettype: true,
    },
    where: {
      eventid: eventID,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { eventid, tickettypeid } = body;

  if (!eventid || !tickettypeid) {
    return NextResponse.json(
      { message: "Chybí povinné parametry: eventid, tickettypeid" },
      { status: 400 }
    );
  }

  const ticket = await prisma.$transaction(async (tx) => {
    const poolTicket = await tx.ticket.findFirst({
      where: {
        eventid,
        tickettypeid,
        ownerId: null,
      },
    });
    if (!poolTicket) {
      return null;
    }
    return tx.ticket.update({
      where: { id: poolTicket.id },
      data: { ownerId: session.user.id },
    });
  });

  if (!ticket) {
    return NextResponse.json(
      {
        message:
          "Žádný volný lístek v poolu. Vstupenky se možná ještě generují, nebo jsou vyprodány.",
      },
      { status: 409 }
    );
  }

  return NextResponse.json(ticket);
}
