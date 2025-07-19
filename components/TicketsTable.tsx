"use client";
import TicketCard from "./TicketCard";
import type { Ticket } from "@prisma/client";
export default function TicketsTable(props: { tickets: Ticket[] }) {
  const { tickets } = props;
  return (
    <div className="grid gap-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
