import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    // Zkontrolovat, zda je uživatel admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Nedostatečná oprávnění" },
        { status: 403 }
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

    // Vytvoření události
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Událost byla úspěšně vytvořena", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Chyba při vytváření události:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
