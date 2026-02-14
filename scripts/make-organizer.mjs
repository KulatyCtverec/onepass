import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function makeOrganizer(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: Role.ORGANIZER },
    });

    console.log(`✅ Uživatel ${email} je nyní organizátor`);
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

const email = process.argv[2];

if (!email) {
  console.error("❌ Prosím zadejte email uživatele");
  console.log("Použití: node scripts/make-organizer.mjs user@example.com");
  process.exit(1);
}

makeOrganizer(email);
