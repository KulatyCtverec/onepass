import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const eventID = request.nextUrl.searchParams.get("eventID");
  const session = await auth();

  if (!eventID) {
    return NextResponse.json(
      { message: "Chybí parametr eventID." },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Nepřihlášený uživatel." },
      { status: 401 }
    );
  }

  const tickets = await prisma.ticket.findMany({
    include: { event: true },
    where: {
      eventid: eventID,
      userid: session.user.id,
    },
  });

  return NextResponse.json(tickets);
}
