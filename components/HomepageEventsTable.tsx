"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Event, TicketType } from "@/lib/generated/prisma/client";
import Link from "next/link";

interface HomepageEventsTableProps {
  events: (Event & {
    ticketTypes: TicketType[];
  })[];
}

export default function HomepageEventsTable({
  events,
}: HomepageEventsTableProps) {
  const [showAll, setShowAll] = useState(false);

  if (events.length === 0) {
    return (
      <Card className="bg-black border-secondary-700">
        <CardContent className="p-8 text-center">
          <p className="text-secondary-400 text-lg">
            Zatím nejsou k dispozici žádné události
          </p>
          <Link
            href="/create-event"
            className="inline-block mt-4 bg-accent-600 hover:bg-accent-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Vytvořit první událost
          </Link>
        </CardContent>
      </Card>
    );
  }

  const displayedEvents = showAll ? events : events.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayedEvents.map((event) => (
          <Card
            key={event.id}
            className="bg-black border-secondary-700 hover:border-accent-600 transition-colors cursor-pointer"
            onClick={() => (window.location.href = `/events/${event.id}`)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg line-clamp-2">
                {event.name}
              </CardTitle>
              <p className="text-secondary-400 text-sm">📍 {event.location}</p>
              <p className="text-secondary-400 text-sm">
                📅 {new Date(event.date).toLocaleDateString("cs-CZ")}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <span className="text-secondary-400 text-sm">
                  Typy lístků: {event.ticketTypes.length}
                </span>
                <span className="text-accent-400 text-sm font-semibold">
                  Od {Math.min(...event.ticketTypes.map((t) => t.price), 0)} Kč
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length > 4 && (
        <div className="text-center mt-6">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-accent-600 text-accent-400 hover:bg-accent-600 hover:text-white"
          >
            {showAll
              ? "Zobrazit méně"
              : `Zobrazit všech ${events.length} událostí`}
          </Button>
        </div>
      )}
    </div>
  );
}
