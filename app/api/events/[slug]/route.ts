import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { generateEventSlug, checkEventNameExists } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
      where: { slug: slug },
      include: {
        ticketTypes: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Chyba při načítání události:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nepřihlášený uživatel" },
        { status: 401 }
      );
    }

    if (
      session.user.role !== Role.ADMIN &&
      session.user.role !== Role.ORGANIZER
    ) {
      return NextResponse.json(
        { error: "Nedostatečná oprávnění" },
        { status: 403 }
      );
    }

    // Kontrola, zda je uživatel tvůrcem události
    const existingEvent = await prisma.event.findUnique({
      where: { slug: slug },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena" },
        { status: 404 }
      );
    }

    if (existingEvent.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Nemáte oprávnění upravovat tuto událost" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Získat všechna pole z formData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const venue = formData.get("venue") as string;
    const capacity = formData.get("capacity") as string;
    const address = formData.get("address") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const salesStart = formData.get("salesStart") as string;
    const salesEnd = formData.get("salesEnd") as string;
    const allowResale = formData.get("allowResale") === "true";
    const requireApproval = formData.get("requireApproval") === "true";
    const sendEmails = formData.get("sendEmails") === "true";
    const ticketTypesJson = formData.get("ticketTypes") as string;
    const imageFile = formData.get("image") as File | null;

    // Parsovat ticket types
    const ticketTypes = JSON.parse(ticketTypesJson);

    // Parse date and validate
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { message: "Neplatné datum události." },
        { status: 400 }
      );
    }

    // Check if event with same name already exists on the same day (excluding current event)
    const eventExists = await checkEventNameExists(
      name,
      eventDate,
      existingEvent.id
    );
    if (eventExists) {
      return NextResponse.json(
        { message: "Event se stejným názvem už v daný den existuje." },
        { status: 400 }
      );
    }

    // Generate new slug if name or date changed
    let newSlug = existingEvent.slug;
    if (
      name !== existingEvent.name ||
      eventDate.getTime() !== existingEvent.date.getTime()
    ) {
      newSlug = generateEventSlug(name, eventDate);
    }

    // Zpracovat obrázek, pokud byl nahrán nový
    let imagePath = existingEvent.image;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Vytvořit složku uploads, pokud neexistuje
      const uploadsDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      // Generovat unikátní název souboru
      const timestamp = Date.now();
      const originalName = imageFile.name;
      const extension = originalName.split(".").pop();
      const fileName = `event_${existingEvent.id}_${timestamp}.${extension}`;
      const filePath = join(uploadsDir, fileName);

      // Uložit soubor
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    // Aktualizovat událost
    const updatedEvent = await prisma.event.update({
      where: { slug: slug },
      data: {
        name,
        slug: newSlug,
        description,
        location,
        date: eventDate,
        category,
        venue,
        capacity: capacity ? parseInt(capacity) : null,
        address,
        startTime,
        endTime,
        salesStart: salesStart ? new Date(salesStart) : null,
        salesEnd: salesEnd ? new Date(salesEnd) : null,
        allowResale,
        requireApproval,
        sendEmails,
        image: imagePath,
        updatedAt: new Date(),
      },
    });

    // Aktualizovat ticket types
    // Nejdříve smazat všechny existující
    await prisma.ticketType.deleteMany({
      where: { eventid: existingEvent.id },
    });

    // Vytvořit nové
    for (const ticketType of ticketTypes) {
      await prisma.ticketType.create({
        data: {
          name: ticketType.name,
          price: parseInt(ticketType.price) * 100, // Převést na centy
          stock: parseInt(ticketType.quantity),
          total: parseInt(ticketType.quantity),
          eventid: existingEvent.id,
        },
      });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Chyba při úpravě události:", error);
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
  const { slug } = await params;
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nepřihlášený uživatel" },
        { status: 401 }
      );
    }

    if (
      session.user.role !== Role.ADMIN &&
      session.user.role !== Role.ORGANIZER
    ) {
      return NextResponse.json(
        { error: "Nedostatečná oprávnění" },
        { status: 403 }
      );
    }

    // Kontrola, zda je uživatel tvůrcem události
    const existingEvent = await prisma.event.findUnique({
      where: { slug: slug },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Událost nebyla nalezena" },
        { status: 404 }
      );
    }

    if (existingEvent.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Nemáte oprávnění smazat tuto událost" },
        { status: 403 }
      );
    }

    // Smazat událost (cascade smaže i ticket types)
    await prisma.event.delete({
      where: { slug: slug },
    });

    return NextResponse.json({ message: "Událost byla úspěšně smazána" });
  } catch (error) {
    console.error("Chyba při mazání události:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
