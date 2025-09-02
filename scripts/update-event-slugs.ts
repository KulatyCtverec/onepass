import { PrismaClient } from "../lib/generated/prisma/client";
import { generateEventSlug } from "../lib/utils";

const prisma = new PrismaClient();

async function updateEventSlugs() {
  console.log("🔄 Začínám aktualizaci slugů pro existující eventy...");

  try {
    // Najdi všechny eventy bez slug
    const eventsWithoutSlug = await prisma.event.findMany({
      where: {
        slug: null,
      },
      select: {
        id: true,
        name: true,
        date: true,
      },
    });

    console.log(`📊 Nalezeno ${eventsWithoutSlug.length} eventů bez slug`);

    if (eventsWithoutSlug.length === 0) {
      console.log(
        "✅ Všechny eventy už mají slug. Žádná aktualizace není potřeba."
      );
      return;
    }

    // Aktualizuj každý event
    for (const event of eventsWithoutSlug) {
      const slug = generateEventSlug(event.name, event.date);

      try {
        await prisma.event.update({
          where: { id: event.id },
          data: { slug },
        });

        console.log(`✅ Aktualizován event "${event.name}" -> slug: "${slug}"`);
      } catch (error) {
        console.error(
          `❌ Chyba při aktualizaci eventu "${event.name}":`,
          error
        );

        // Pokud je slug duplicitní, přidej timestamp
        const timestampSlug = `${slug}-${Date.now()}`;
        try {
          await prisma.event.update({
            where: { id: event.id },
            data: { slug: timestampSlug },
          });
          console.log(
            `✅ Aktualizován s timestamp: "${event.name}" -> slug: "${timestampSlug}"`
          );
        } catch (timestampError) {
          console.error(
            `❌ Kritická chyba při aktualizaci eventu "${event.name}":`,
            timestampError
          );
        }
      }
    }

    console.log("🎉 Aktualizace slugů dokončena!");
  } catch (error) {
    console.error("❌ Chyba při aktualizaci slugů:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEventSlugs();
