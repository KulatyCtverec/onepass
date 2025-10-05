import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ role: Role.USER });
    }

    // Zkontrolovat roli uživatele
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return NextResponse.json({ role: user?.role || Role.USER });
  } catch (error) {
    console.error("Chyba při kontrole role:", error);
    return NextResponse.json({ role: Role.USER });
  }
}
