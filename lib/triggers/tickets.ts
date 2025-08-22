import { prisma } from "@/lib/prisma";

export async function setupTicketTriggers() {
  console.log("🔧 Vytvářím triggery pro tickets...");

  try {
    // Trigger pro INSERT - generuje QR kód při vytvoření
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION generate_ticket_qr_insert()
      RETURNS trigger AS $$
      BEGIN
        -- Generujeme QR kód s aktuálním vlastníkem
        NEW.accesscode := encode(
          digest(NEW.id || ':' || NEW.eventid || ':' || NEW.userid || ':' || extract(epoch from NOW())::text, 'sha256'),
          'hex'
        );
        NEW.qrGenerated := NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log("✅ Funkce generate_ticket_qr_insert vytvořena");

    // Trigger pro UPDATE - přegeneruje QR kód při změně vlastníka
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION generate_ticket_qr_update()
      RETURNS trigger AS $$
      BEGIN
        -- Pokud se změnil vlastník, přegenerujeme QR kód
        IF OLD.userid != NEW.userid THEN
          NEW.accesscode := encode(
            digest(NEW.id || ':' || NEW.eventid || ':' || NEW.userid || ':' || extract(epoch from NOW())::text, 'sha256'),
            'hex'
          );
          NEW.qrGenerated := NOW();
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log("✅ Funkce generate_ticket_qr_update vytvořena");

    // Odstraníme staré triggery pokud existují
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS ticket_qr_insert_trigger ON "Ticket";
    `);
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS ticket_qr_update_trigger ON "Ticket";
    `);

    // Vytvoříme triggery
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER ticket_qr_insert_trigger
      BEFORE INSERT ON "Ticket"
      FOR EACH ROW EXECUTE FUNCTION generate_ticket_qr_insert();
    `);
    console.log("✅ Trigger ticket_qr_insert_trigger vytvořen");

    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER ticket_qr_update_trigger
      BEFORE UPDATE ON "Ticket"
      FOR EACH ROW EXECUTE FUNCTION generate_ticket_qr_update();
    `);
    console.log("✅ Trigger ticket_qr_update_trigger vytvořen");

    console.log("🎉 Všechny ticket triggery byly úspěšně nastaveny!");
  } catch (error) {
    console.error("❌ Chyba při vytváření ticket triggerů:", error);
    throw error;
  }
}