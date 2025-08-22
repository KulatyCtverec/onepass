"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Event, TicketType } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Clock, Loader2, Filter } from "lucide-react";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { useSSE } from "@/lib/hooks/useSSE";

export default function HomepageEventsTable() {
  const [events, setEvents] = useState<
    (Event & { ticketTypes: TicketType[] })[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Načítáme events pomocí useInitialFetch
  useInitialFetch<(Event & { ticketTypes: TicketType[] })[]>(
    "/api/events",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );

  // Real-time updates pomocí SSE
  useSSE<Event & { ticketTypes: TicketType[] }>(
    "/api/events/stream",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );

  // Kategorie pro filtrování
  const categories = [
    { name: "Všechny", key: "all", icon: "✨", count: events?.length || 0 },
    {
      name: "Hudba",
      key: "music",
      icon: "🎵",
      count: events?.filter((e) => e.category === "music").length || 0,
    },
    {
      name: "Sport",
      key: "sports",
      icon: "⚽",
      count: events?.filter((e) => e.category === "sports").length || 0,
    },
    {
      name: "Divadlo",
      key: "theater",
      icon: "🎭",
      count: events?.filter((e) => e.category === "theater").length || 0,
    },
    {
      name: "Komedie",
      key: "comedy",
      icon: "😂",
      count: events?.filter((e) => e.category === "comedy").length || 0,
    },
    {
      name: "Jídlo",
      key: "food",
      icon: "🍷",
      count: events?.filter((e) => e.category === "food").length || 0,
    },
    {
      name: "Technologie",
      key: "technology",
      icon: "💻",
      count: events?.filter((e) => e.category === "technology").length || 0,
    },
    {
      name: "Jiné",
      key: "other",
      icon: "✨",
      count: events?.filter((e) => e.category === "other").length || 0,
    },
  ];

  // Filtrované events podle kategorie
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events?.filter((event) => event.category === selectedCategory) || [];

  // Funkce pro načtení dalších events
  const loadMoreEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events?take=20&skip=${events.length}`);
      const newEvents = await response.json();

      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents]);
        setShowAll(true);
      }
    } catch (error) {
      console.error("Chyba při načítání dalších událostí:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="glass-effect border-border/30 rounded-lg p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
          <Ticket className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-destructive text-lg mb-6">
          Chyba při načítání událostí: {error}
        </p>
      </div>
    );
  }

  // Loading stav když se events načítají
  if (!events || events.length === 0) {
    return (
      <div className="glass-effect border-border/30 rounded-lg p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <Ticket className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground-muted text-lg mb-6">
          {!events
            ? "Načítám události..."
            : "Zatím nejsou k dispozici žádné události"}
        </p>
        {!events ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Link
            href="/create-event"
            className="inline-block glass-button px-6 py-3 rounded-xl text-white hover:scale-105 transition-all duration-300"
          >
            Vytvořit první událost
          </Link>
        )}
      </div>
    );
  }

  // Zobrazujeme první 4 events, nebo všechny pokud showAll = true
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 4);

  return (
    <div>
      {/* Kategorie pro filtrování */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Procházet podle kategorie
          </h2>
          <p className="text-foreground-muted text-lg">
            Najděte události, které vás zajímají
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div
              key={category.key}
              className={`group cursor-pointer transition-all duration-300 hover:scale-105 text-center p-4 rounded-lg border border-border/30 ${
                selectedCategory === category.key
                  ? "bg-primary/20 text-primary border-primary/50"
                  : "bg-background/50 hover:bg-primary/10 hover:border-primary/30"
              }`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <div className="text-2xl mb-2 filter drop-shadow-lg">
                {category.icon}
              </div>
              <h3 className="font-medium mb-1 text-foreground text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-foreground-muted">
                {category.count} událostí
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filtrované události */}
      <section>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {selectedCategory === "all"
                ? "Všechny události"
                : `${
                    categories.find((c) => c.key === selectedCategory)?.name
                  } události`}
            </h2>
            <p className="text-foreground-muted">
              Nenechte si ujít tyto úžasné nadcházející události
            </p>
          </div>
          {selectedCategory !== "all" && (
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("all")}
              className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Zobrazit všechny události
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden hover:z-10 transform-gpu rounded-lg"
              style={{ transformOrigin: "center center" }}
              onClick={() => (window.location.href = `/events/${event.id}`)}
            >
              {/* Event Image - dynamically sized to fit card */}
              <div className="relative w-full h-72 overflow-hidden rounded-lg">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Ticket className="w-16 h-16 text-primary/40" />
                  </div>
                )}
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Event Info - positioned over image, expands on hover */}
              <div className="relative -mt-20 transition-all duration-300 group-hover:-mt-16">
                {/* Background strip for better text readability */}
                <div className="bg-black/90 p-3 rounded-b-lg">
                  {/* Basic info always visible - only name and price */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <h3 className="text-white text-lg line-clamp-2 group-hover:text-primary transition-colors mb-1 font-semibold">
                    {event.name}
                  </h3>

                  {/* Price info always visible */}
                  <div className="flex justify-between items-center pt-1 border-t border-white/20">
                    <span className="text-xs text-white/70">Od</span>
                    <span className="text-primary font-semibold ">
                      {event.ticketTypes && event.ticketTypes.length > 0
                        ? Math.min(...event.ticketTypes.map((t) => t.price)) /
                          100
                        : 0}{" "}
                      Kč
                    </span>
                  </div>

                  {/* Additional info - appears on hover */}
                  <div className="max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-40 space-y-2">
                    {/* Location and date info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white/80">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(event.date).toLocaleDateString("cs-CZ")}
                          </span>
                        </div>
                        {event.category && (
                          <div className="flex items-center space-x-2 text-white/70">
                            <span className="text-xs uppercase tracking-wide">
                              {event.category === "music" && "🎵"}
                              {event.category === "sports" && "⚽"}
                              {event.category === "theater" && "🎭"}
                              {event.category === "comedy" && "😂"}
                              {event.category === "food" && "🍷"}
                              {event.category === "technology" && "💻"}
                              {event.category === "other" && "✨"}
                            </span>
                            <span className="text-xs uppercase tracking-wide">
                              {event.category === "music" && "Hudba"}
                              {event.category === "sports" && "Sport"}
                              {event.category === "theater" && "Divadlo"}
                              {event.category === "comedy" && "Komedie"}
                              {event.category === "food" && "Jídlo"}
                              {event.category === "technology" && "Tech"}
                              {event.category === "other" && "Jiné"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-white/80">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleTimeString("cs-CZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Additional details */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tlačítka pro zobrazení více */}
        <div className="text-center pt-6 space-y-3">
          {!showAll && filteredEvents && filteredEvents.length > 4 && (
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300"
            >
              Zobrazit všech {filteredEvents.length} událostí
            </Button>
          )}

          {showAll && filteredEvents && filteredEvents.length > 4 && (
            <div className="space-y-3">
              <Button
                onClick={() => setShowAll(false)}
                variant="outline"
                className="glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300"
              >
                Zobrazit méně
              </Button>

              <Button
                onClick={loadMoreEvents}
                disabled={loading}
                variant="outline"
                className="glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300 ml-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Načítám...
                  </>
                ) : (
                  "Načíst dalších 20"
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
