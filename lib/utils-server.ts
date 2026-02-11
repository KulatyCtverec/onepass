import "server-only";
import { prisma } from "./prisma";

/**
 * Vrací základní URL aplikace (bez koncového lomítka).
 * Použij vždy tuto funkci místo natvrdo zadané domény při volání vlastního API z backendu.
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXTAUTH_URL)
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

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
