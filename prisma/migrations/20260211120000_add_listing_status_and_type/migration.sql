-- CreateEnum (pokud už existují, nic se nestane – žádné mazání dat)
DO $$ BEGIN
  CREATE TYPE "ListingStatus" AS ENUM ('IN_SALE', 'SOLD');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ListingType" AS ENUM ('OFFER', 'REQUEST');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable: přidání sloupců s DEFAULT – stávající řádky dostanou výchozí hodnotu
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "status" "ListingStatus" NOT NULL DEFAULT 'IN_SALE';

ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "type" "ListingType" NOT NULL DEFAULT 'OFFER';
