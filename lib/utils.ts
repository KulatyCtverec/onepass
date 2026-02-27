import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generuje unikátní slug z názvu eventu a data konání
 * @param name - název eventu
 * @param date - datum konání
 * @returns slug ve formátu "nazev-eventu-YYYY-MM-DD"
 */
export function generateEventSlug(name: string, date: Date): string {
  // Normalizace názvu - odstranění diakritiky a speciálních znaků
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // odstranění diakritiky
    .replace(/[^a-z0-9\s-]/g, "") // pouze písmena, čísla, mezery a pomlčky
    .replace(/\s+/g, "-") // mezery na pomlčky
    .replace(/-+/g, "-") // více pomlček na jednu
    .trim();

  // Formátování data
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${normalizedName}-${year}-${month}-${day}`;
}


