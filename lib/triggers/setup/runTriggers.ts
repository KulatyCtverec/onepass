import { setupEventInsertTrigger } from "../events";
import { setupTicketTriggers } from "../tickets";

export async function runTriggers() {
  console.log("🚀 Spouštím databázové triggery...");

  try {
    // Spustíme triggery pro tickets
    console.log("📋 Nastavuji triggery pro tickets...");
    await setupTicketTriggers();
    console.log("✅ Ticket triggery nastaveny úspěšně");

    // Spustíme triggery pro events
    console.log("🎫 Nastavuji triggery pro events...");
    await setupEventInsertTrigger();
    console.log("✅ Event triggery nastaveny úspěšně");

    console.log("🎉 Všechny triggery byly úspěšně nastaveny!");
  } catch (error) {
    console.error("❌ Chyba při nastavování triggerů:", error);
    throw error;
  }
}

// Spustíme triggery pouze pokud je soubor spuštěn přímo
if (require.main === module) {
  runTriggers().catch((error) => {
    console.error("❌ Chyba při spouštění triggerů:", error);
    process.exit(1);
  });
}
