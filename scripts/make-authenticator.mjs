import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function makeAuthenticator(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAuthenticator: true },
    });

    console.log(`✅ Uživatel ${user.email} je nyní ověřovatel`);
    console.log(`ID: ${user.id}`);
    console.log(`Jméno: ${user.name || "N/A"}`);
    console.log(`Ověřovatel: ${user.isAuthenticator}`);
    console.log(`Admin: ${user.isAdmin}`);
  } catch (error) {
    if (error.code === "P2025") {
      console.error(`❌ Uživatel s emailem ${email} nebyl nalezen`);
    } else {
      console.error("❌ Chyba:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Získání emailu z argumentů příkazové řádky
const email = process.argv[2];

if (!email) {
  console.log("Použití: node scripts/make-authenticator.mjs <email>");
  console.log("Příklad: node scripts/make-authenticator.mjs user@example.com");
  process.exit(1);
}

makeAuthenticator(email);
