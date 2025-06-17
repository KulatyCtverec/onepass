import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    await prisma.event.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Událost byla smazána." });
  } catch (error) {
    console.error("[API] Error deleting event:", error);
    return NextResponse.json(
      { message: "Chyba při mazání události." },
      { status: 500 }
    );
  }
}
