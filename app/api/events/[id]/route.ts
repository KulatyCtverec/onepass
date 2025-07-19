import { NextResponse, NextRequest } from "next/server";
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
    console.log("[API] DELETE /api/events/[id] called with id:", id);

    return NextResponse.json({ message: "Událost byla smazána." });
  } catch (error) {
    console.error("[API] Error deleting event:", error);
    return NextResponse.json(
      { message: "Chyba při mazání události." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // If you want to support filtering, parse query params from request.url here
  const params = await context.params;
  const id = await params.id;
  const events = await prisma.event.findFirst({
    where: { id: id },
  });

  console.log("[API] GET /api/events/[id] called with id:", id);
  return NextResponse.json(events);
}
