-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "createdById" TO "ownerId";

-- AlterTable
ALTER TABLE "Ticket" RENAME COLUMN "userid" TO "ownerId";
ALTER TABLE "Ticket" ALTER COLUMN "ownerId" DROP NOT NULL;
