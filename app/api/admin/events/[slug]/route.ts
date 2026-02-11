import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    // Zkontrolovat, zda událost existuje a patří tomuto adminovi
    const { slug } = await params;
    const existingEvent = await prisma.event.findFirst({
      where: {
        slug: slug,
        ownerId: session.user.id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena nebo nemáte oprávnění" },
        { status: 404 }
      );
    }

    const { name, description, date, location } = await request.json();

    // Validace
    if (!name || !description || !date || !location) {
      return NextResponse.json(
        { error: "Všechna pole jsou povinná" },
        { status: 400 }
      );
    }

    // Aktualizace události
    const event = await prisma.event.update({
      where: { id: existingEvent.id },
      data: {
        name,
        description,
        date: new Date(date),
        location,
      },
    });

    return NextResponse.json(
      { message: "Událost byla úspěšně aktualizována", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chyba při aktualizaci události:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    // Zkontrolovat, zda událost existuje a patří tomuto adminovi
    const { slug } = await params;
    const existingEvent = await prisma.event.findFirst({
      where: {
        slug: slug,
        ownerId: session.user.id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena nebo nemáte oprávnění" },
        { status: 404 }
      );
    }

    // Smazat všechny lístky a typy lístků související s událostí

    await prisma.ticket.deleteMany({
      where: { eventid: existingEvent.id },
    });

    await prisma.ticketType.deleteMany({
      where: { eventid: existingEvent.id },
    });

    // Smazat událost
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });

    return NextResponse.json(
      { message: "Událost byla úspěšně smazána" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chyba při mazání události:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
