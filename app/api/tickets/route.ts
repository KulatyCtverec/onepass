import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/lib/generated/prisma";
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
        user: true,
        tickettype: true,
      },
      where: {
        userid: session.user.id,
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
      user: true,
      tickettype: true,
    },
    where: {
      eventid: eventID,
      userid: session.user.id,
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
  const { eventid, userid, tickettypeid } = body;

  if (!eventid || !tickettypeid) {
    return NextResponse.json(
      { message: "Chybí povinné parametry: eventid, tickettypeid" },
      { status: 400 }
    );
  }

  const ticket = await prisma.ticket.create({
    data: {
      eventid,
      userid: userid || session.user.id,
      tickettypeid,
      accesscode: crypto.randomUUID(),
      used: false,
      createtime: new Date(),
      lastScanned: null,
      qrGenerated: new Date(),
      scanCount: 0,
    },
  });
  return NextResponse.json(ticket);
}
