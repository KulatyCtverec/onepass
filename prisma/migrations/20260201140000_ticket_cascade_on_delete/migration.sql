-- DropForeignKey (Ticket -> Event, Ticket -> TicketType)
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_eventid_fkey";
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_tickettypeid_fkey";

-- AddForeignKey with ON DELETE CASCADE
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tickettypeid_fkey" FOREIGN KEY ("tickettypeid") REFERENCES "TicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
