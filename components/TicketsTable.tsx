"use client";
import TicketCard from "./TicketCard";
import type { Ticket, Event, User, TicketType } from "@/lib/generated/prisma";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { useSSE } from "@/lib/hooks/useSSE";
import { useState } from "react";

export default function TicketsTable(props: { caption: string }) {
  const [tickets, setTickets] = useState<
    (Ticket & {
      event: Event;
      user: User;
      tickettype: TicketType;
    })[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useInitialFetch<
    (Ticket & {
      event: Event;
      user: User;
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
      user: User;
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
        <p className="text-secondary-400">Nemáte žádné zakoupené lístky.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{props.caption}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="aspect-[4/3]">
            <TicketCard ticket={ticket} />
          </div>
        ))}
      </div>
    </div>
  );
}
