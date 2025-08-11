import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Nepřihlášený uživatel." },
        { status: 401 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        userid: session.user.id,
      },
      include: {
        event: {
          select: {
            name: true,
            date: true,
            location: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        tickettype: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createtime: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return NextResponse.json(
      { message: "Chyba při načítání vstupenek." },
      { status: 500 }
    );
  }
}
