import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: NextRequest) {
  const eventID = request.nextUrl.searchParams.get("eventID");
  if (!eventID) {
    return NextResponse.json(
      { message: "Chybí parametr eventID." },
      { status: 400 }
    );
  }
  const tickets = await prisma.ticket.findMany({
    include: { event: true },
    where: { eventId: eventID },
  });
  return NextResponse.json(tickets);
}
