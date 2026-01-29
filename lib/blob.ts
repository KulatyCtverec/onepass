import "server-only";
import { del } from "@vercel/blob";

/**
 * Smaže obrázek z Vercel Blob storage.
 * @param imageUrl – plná URL blobu (např. z event.image)
 * @throws při chybě volání @vercel/blob del
 */
export async function deleteBlobFromStorage(imageUrl: string): Promise<void> {
  await del(imageUrl);
}
