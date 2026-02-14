import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function createTickets() {
  const userid = "cmfzw28vm0000552o39exyi20";
  const eventid = "cmhi4zfbf000755m04f0c8vup";
  const tickettypeid = "cmhi4zfcs000b55m048budzbf";

  try {
    console.log("Vytvářím 3 lístky...");

    // Deaktivujeme trigger
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Ticket" DISABLE TRIGGER ticket_qr_insert_trigger;
    `);

    try {
      for (let i = 1; i <= 3; i++) {
        // Generujeme accesscode pomocí SHA256 hashe
        const timestamp = Date.now() + i;
        const uniqueString = `${eventid}:${userid}:${tickettypeid}:${timestamp}:${i}`;
        const accesscode = crypto
          .createHash("sha256")
          .update(uniqueString)
          .digest("hex");

        const now = new Date().toISOString();

        // Vytvoříme lístek pomocí raw SQL
        const result = await prisma.$executeRawUnsafe(
          `
          INSERT INTO "Ticket" (id, eventid, userid, tickettypeid, accesscode, used, createtime, "lastScanned", "qrGenerated", "scanCount")
          VALUES (
            gen_random_uuid()::text,
            $1::text,
            $2::text,
            $3::text,
            $4::text,
            false,
            $5::timestamp,
            NULL,
            $5::timestamp,
            0
          )
          RETURNING id, accesscode;
        `,
          eventid,
          userid,
          tickettypeid,
          accesscode,
          now
        );

        const ticket = await prisma.ticket.findFirst({
          where: { accesscode },
          select: { id: true },
        });

        console.log(
          `✅ Lístek ${i} vytvořen:`,
          ticket?.id,
          `(accesscode: ${accesscode.substring(0, 16)}...)`
        );
      }
    } finally {
      // Znovu aktivujeme trigger
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Ticket" ENABLE TRIGGER ticket_qr_insert_trigger;
      `);
    }

    console.log("✅ Všechny lístky byly úspěšně vytvořeny!");
  } catch (error) {
    console.error("❌ Chyba při vytváření lístků:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTickets();
