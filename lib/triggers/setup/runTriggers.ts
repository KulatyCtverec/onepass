import { setupEventInsertTrigger } from "../../triggers/events";

setupEventInsertTrigger()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Chyba při nastavování triggeru:", err);
    process.exit(1);
  });
