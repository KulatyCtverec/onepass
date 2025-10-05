import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    // Zkontrolovat, zda má uživatel admin nebo organizer roli
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== Role.ADMIN && user?.role !== Role.ORGANIZER) {
      return NextResponse.json(
        { error: "Nedostatečná oprávnění" },
        { status: 403 }
      );
    }

    const { name, price, stock, eventId } = await request.json();

    // Validace
    if (!name || !price || !stock || !eventId) {
      return NextResponse.json(
        { error: "Všechna pole jsou povinná" },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: "Cena nemůže být záporná" },
        { status: 400 }
      );
    }

    if (stock < 1) {
      return NextResponse.json(
        { error: "Počet lístků musí být alespoň 1" },
        { status: 400 }
      );
    }

    // Zkontrolovat, zda událost existuje a patří tomuto adminovi
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        createdById: session.user.id,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena nebo nemáte oprávnění" },
        { status: 404 }
      );
    }

    // Vytvoření typu lístku
    const ticketType = await prisma.ticketType.create({
      data: {
        name,
        price,
        stock,
        total: stock,
        eventid: eventId,
      },
    });

    return NextResponse.json(
      { message: "Typ lístku byl úspěšně vytvořen", ticketType },
      { status: 201 }
    );
  } catch (error) {
    console.error("Chyba při vytváření typu lístku:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
