import { prisma } from "@/lib/prisma";

const TICKET_POOL_BATCH_SIZE = 500;

export type CreateEventWithTicketTypesData = {
  name: string;
  slug: string;
  description: string;
  date: Date;
  location: string;
  image?: string | null;
  category?: string | null;
  venue?: string | null;
  capacity?: number | null;
  address?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  salesStart?: Date | null;
  salesEnd?: Date | null;
  allowResale: boolean;
  requireApproval: boolean;
  sendEmails: boolean;
  ownerId: string;
  ticketTypes: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
};

/**
 * Vytvoří Event a všechny TicketTypes v jedné transakci. Tickety se negenerují.
 */
export async function createEventWithTicketTypes(
  data: CreateEventWithTicketTypesData
) {
  const { ticketTypes, ...eventData } = data;
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        name: eventData.name,
        slug: eventData.slug,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        image: eventData.image,
        category: eventData.category,
        venue: eventData.venue,
        capacity: eventData.capacity,
        address: eventData.address,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        salesStart: eventData.salesStart,
        salesEnd: eventData.salesEnd,
        allowResale: eventData.allowResale,
        requireApproval: eventData.requireApproval,
        sendEmails: eventData.sendEmails,
        ownerId: eventData.ownerId,
      },
    });

    const createdTypes = [];
    for (const tt of ticketTypes) {
      if (!tt.name || tt.price == null || tt.quantity == null) continue;
      const ticketType = await tx.ticketType.create({
        data: {
          name: tt.name,
          price: tt.price,
          stock: tt.quantity,
          total: tt.quantity,
          eventid: event.id,
        },
      });
      createdTypes.push(ticketType);
    }

    return { event, ticketTypes: createdTypes };
  });
}

/**
 * Spustí asynchronní generování ticket poolu (fire-and-forget).
 * Volá přímo generateTicketPoolForEvent – žádné HTTP/URL.
 */
export function scheduleTicketPoolGeneration(eventId: string): void {
  void generateTicketPoolForEvent(eventId).catch((err) => {
    console.error("[scheduleTicketPoolGeneration] failed:", err);
  });
}

/**
 * Pro daný event doplní pool ticketů: pro každý TicketType vytvoří chybějící tickety (ownerId: null) v dávkách.
 */
export async function generateTicketPoolForEvent(
  eventId: string
): Promise<void> {
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventid: eventId },
  });

  for (const tt of ticketTypes) {
    const targetCount = tt.stock;
    const currentCount = await prisma.ticket.count({
      where: { tickettypeid: tt.id, ownerId: null },
    });
    let toCreate = targetCount - currentCount;
    if (toCreate <= 0) continue;

    while (toCreate > 0) {
      const batchSize = Math.min(toCreate, TICKET_POOL_BATCH_SIZE);
      for (let i = 0; i < batchSize; i++) {
        await prisma.ticket.create({
          data: {
            eventid: eventId,
            tickettypeid: tt.id,
            ownerId: null,
            accesscode: crypto.randomUUID(),
          },
        });
      }
      toCreate -= batchSize;
    }
  }
}

/**
 * Po editaci eventu srovná pool: dogeneruje chybějící tickety nebo smaže přebytečné (jen bez ownera).
 */
export async function syncTicketPoolForEvent(eventId: string): Promise<void> {
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventid: eventId },
  });

  for (const tt of ticketTypes) {
    const targetCount = tt.stock;
    const poolTickets = await prisma.ticket.findMany({
      where: { tickettypeid: tt.id, ownerId: null },
      select: { id: true },
    });
    const currentPoolCount = poolTickets.length;

    if (targetCount > currentPoolCount) {
      const toCreate = targetCount - currentPoolCount;
      const batchSize = Math.min(toCreate, TICKET_POOL_BATCH_SIZE);
      let remaining = toCreate;
      while (remaining > 0) {
        const size = Math.min(remaining, batchSize);
        for (let i = 0; i < size; i++) {
          await prisma.ticket.create({
            data: {
              eventid: eventId,
              tickettypeid: tt.id,
              ownerId: null,
              accesscode: crypto.randomUUID(),
            },
          });
        }
        remaining -= size;
      }
    } else if (targetCount < currentPoolCount) {
      const toDelete = currentPoolCount - targetCount;
      const idsToDelete = poolTickets.slice(0, toDelete).map((t) => t.id);
      await prisma.ticket.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }
  }
}

