import { PrismaClient, Role } from "../lib/generated/prisma/client/index.js";

const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN },
    });

    console.log(`✅ Uživatel ${email} je nyní admin`);
    console.log(`ID: ${user.id}`);
    console.log(`Jméno: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
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

// Získat email z argumentů
const email = process.argv[2];

if (!email) {
  console.error("❌ Prosím zadejte email uživatele");
  console.log("Použití: node scripts/make-admin.mjs user@example.com");
  process.exit(1);
}

makeAdmin(email);
