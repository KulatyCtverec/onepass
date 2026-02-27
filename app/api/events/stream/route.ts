import { Client } from "pg";

// Nastavení runtime na nodejs, protože SSE a pg klient potřebují Node prostředí
export const runtime = "nodejs"; // 👈 nutné pro SSE + pg

// Handler pro GET požadavek na /api/events/stream
export async function GET() {
  // Vytvoření nového PostgreSQL klienta s connection stringem z .env
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  // Připojení ke PostgreSQL databázi
  await client.connect();

  // Začneme poslouchat na kanálu "events_channel" (musí být nastaven v DB pomocí NOTIFY)
  await client.query("LISTEN events_channel");

  // TextEncoder pro převod textu na streamované byty
  const encoder = new TextEncoder();

  // Vytvoření ReadableStream pro Server-Sent Events (SSE)
  const stream = new ReadableStream({
    // Funkce, která se spustí při startu streamu
    start(controller) {
      // Pošleme klientovi první zprávu (nastaví interval reconnectu na 1s)
      controller.enqueue(encoder.encode("retry: 1000\n\n"));

      // Typ notifikace z PostgreSQL
      interface Notification {
        channel: string;
        payload?: string;
        processId: number;
      }

      // Když přijde notifikace z DB, pošleme ji klientovi jako SSE zprávu
      client.on("notification", (msg: Notification) => {
        // Kontrola, zda payload existuje - pokud ne, přeskočíme notifikaci
        if (msg.payload) {
          controller.enqueue(encoder.encode(`data: ${msg.payload}\n\n`));
        }
      });
    },
    // Funkce, která se spustí při ukončení streamu (např. odpojení klienta)
    cancel() {
      client.end();
    },
  });

  // Vrátíme odpověď typu "text/event-stream" (SSE) s naším streamem
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

