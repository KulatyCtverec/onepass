"use client";
import TicketCard from "./TicketCard";
import type { Ticket, Event, User, TicketType } from "@prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { useSSE } from "@/lib/hooks/useSSE";
import { useState } from "react";

export default function TicketsTable(props: { caption: string }) {
  const [tickets, setTickets] = useState<
    (Ticket & {
      event: Event;
      owner: User | null;
      tickettype: TicketType;
    })[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useInitialFetch<
    (Ticket & {
      event: Event;
      owner: User | null;
      tickettype: TicketType;
    })[]
  >(
    "/api/tickets",
    { value: tickets, setter: setTickets },
    { value: error, setter: setError }
  );

  useSSE<
    Ticket & {
      event: Event;
      owner: User | null;
      tickettype: TicketType;
    }
  >(
    "/api/tickets/stream",
    { value: tickets, setter: setTickets },
    { value: error, setter: setError }
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Nemáte žádné zakoupené lístky.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-main">{props.caption}</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

