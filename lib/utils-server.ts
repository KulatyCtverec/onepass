import "server-only";
import { prisma } from "./prisma";

/**
 * Kontroluje, zda už existuje event se stejným názvem v daný den
 */
export async function checkEventNameExists(
  name: string,
  date: Date,
  excludeId?: string
): Promise<boolean> {
  const existingEvent = await prisma.event.findFirst({
    where: {
      name,
      date: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
  return !!existingEvent;
}
