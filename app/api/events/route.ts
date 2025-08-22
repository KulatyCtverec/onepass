import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  console.log("[API] POST /api/events called with request:", request);

  try {
    const formData = await request.formData();

    // Extract basic event data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const category = formData.get("category") as string;
    const venue = formData.get("venue") as string;
    const capacity = formData.get("capacity") as string;
    const address = formData.get("address") as string;
    const salesStart = formData.get("salesStart") as string;
    const salesEnd = formData.get("salesEnd") as string;
    const allowResale = formData.get("allowResale") === "true";
    const requireApproval = formData.get("requireApproval") === "true";
    const sendEmails = formData.get("sendEmails") === "true";

    // Extract ticket types
    const ticketTypesJson = formData.get("ticketTypes") as string;
    const ticketTypes = JSON.parse(ticketTypesJson);

    // TODO: PŘED NASÁZENÍM DO PRODUKCE - migrovat na Vercel Blob Storage
    // Aktuálně ukládáme lokálně do public/uploads/ pro development
    // V produkci použít: https://vercel.com/docs/storage/vercel-blob

    // Handle image - save to local filesystem (development only)
    const imageFile = formData.get("image") as File | null;
    let imagePath = null;

    if (imageFile) {
      try {
        // Check file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          console.warn(
            `[API] Image too large: ${imageFile.size} bytes, max: ${maxSize} bytes`
          );
          return NextResponse.json(
            { message: "Obrázek je příliš velký. Maximální velikost je 5MB." },
            { status: 400 }
          );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = imageFile.name.split(".").pop();
        const filename = `event-${timestamp}.${fileExtension}`;
        const filePath = join(uploadsDir, filename);

        // Save file to filesystem
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Store relative path in database (not binary data)
        imagePath = `/uploads/${filename}`;
        console.log(`[API] Image saved: ${filePath} -> ${imagePath}`);
      } catch (imageError) {
        console.error("[API] Error saving image:", imageError);
        return NextResponse.json(
          { message: "Chyba při ukládání obrázku." },
          { status: 500 }
        );
      }
    }

    // Validate required fields
    if (!name || !description || !date || !venue || !capacity || !address) {
      console.warn("[API] POST /api/events - missing required fields");
      return NextResponse.json(
        { message: "Všechna povinná pole musí být vyplněná." },
        { status: 400 }
      );
    }

    // Create event with image path (not binary data)
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location: `${venue}, ${address}`, // Combine venue and address for backward compatibility
        image: imagePath, // Store file path, not binary data
        category,
        venue,
        capacity: parseInt(capacity),
        address,
        startTime,
        endTime,
        salesStart: salesStart ? new Date(salesStart) : null,
        salesEnd: salesEnd ? new Date(salesEnd) : null,
        allowResale,
        requireApproval,
        sendEmails,
      },
    });

    // Create ticket types for this event
    for (const ticketType of ticketTypes) {
      if (ticketType.name && ticketType.price && ticketType.quantity) {
        await prisma.ticketType.create({
          data: {
            name: ticketType.name,
            price: Math.round(parseFloat(ticketType.price) * 100), // Convert to cents
            stock: parseInt(ticketType.quantity),
            total: parseInt(ticketType.quantity),
            eventid: event.id,
          },
        });
      }
    }

    console.log("[API] Event created successfully:", { name, date, venue });
    return NextResponse.json(
      { message: "Událost vytvořena úspěšně.", eventId: event.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating event:", error);
    return NextResponse.json(
      { message: "Chyba při vytváření události." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("take") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Načteme events s paginací a ticketTypes
    const events = await prisma.event.findMany({
      take: Math.min(take, 50), // Maximálně 50 najednou
      skip: skip,
      orderBy: { date: "asc" },
      include: {
        ticketTypes: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[API] Error fetching events:", error);
    return NextResponse.json(
      { error: "Chyba při načítání událostí" },
      { status: 500 }
    );
  }
}
