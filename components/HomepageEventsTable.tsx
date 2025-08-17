"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Event, TicketType } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Clock } from "lucide-react";

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
      <Card className="glass-effect border-border/30">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground-muted text-lg mb-6">
            Zatím nejsou k dispozici žádné události
          </p>
          <Link
            href="/create-event"
            className="inline-block glass-button px-6 py-3 rounded-xl text-white hover:scale-105 transition-all duration-300"
          >
            Vytvořit první událost
          </Link>
        </CardContent>
      </Card>
    );
  }

  const displayedEvents = showAll ? events : events.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayedEvents.map((event) => (
          <Card
            key={event.id}
            className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-xl"
            onClick={() => (window.location.href = `/events/${event.id}`)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-foreground-muted bg-muted/20 px-2 py-1 rounded-full">
                  {event.ticketTypes.length} typů
                </span>
              </div>
              <CardTitle className="text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {event.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center space-x-2 text-foreground-muted">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground-muted">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(event.date).toLocaleDateString("cs-CZ")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-foreground-muted">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(event.date).toLocaleTimeString("cs-CZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="pt-3 border-t border-border/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground-muted">
                    Od
                  </span>
                  <span className="text-primary font-semibold">
                    {Math.min(...event.ticketTypes.map((t) => t.price), 0)} Kč
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length > 4 && (
        <div className="text-center pt-6">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300"
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
