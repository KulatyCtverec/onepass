"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "./ui/button";
import { Event, TicketType } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, Ticket, Clock, Loader2 } from "lucide-react";
import { useSSE } from "@/lib/hooks/useSSE";
import categories from "@/config/constants/categories.json";
import SearchBox from "./SearchBox";
import { useDebounce } from "@/lib/hooks/useDebounce";
const EVENTS_PER_PAGE = 12;

export default function HomepageEventsTable() {
  const [events, setEvents] = useState<
    (Event & { ticketTypes: TicketType[] })[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";

  // Synchronizace stavu vyhledávání s URL parametrem 'q'
  useEffect(() => {
    if (qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
  }, [qParam]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Načítání událostí (včetně vyhledávání a kategorií)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setInitialLoading(true);
        const params = new URLSearchParams({
          take: EVENTS_PER_PAGE.toString(),
          skip: "0",
        });

        if (debouncedSearchQuery) params.append("q", debouncedSearchQuery);
        if (selectedCategory) params.append("category", selectedCategory);
        if (sortBy) params.append("sort", sortBy);

        const response = await fetch(`/api/events?${params.toString()}`);
        if (!response.ok) throw new Error("Chyba při načítání událostí");
        const newEvents = await response.json();
        setEvents(newEvents);
        setHasMore(newEvents.length === EVENTS_PER_PAGE);
        // Pokud vyhledáváme, automaticky chceme vidět výsledky (showAll)
        if (debouncedSearchQuery || selectedCategory) {
          setShowAll(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nastala chyba");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearchQuery, selectedCategory, sortBy]);

  // Real-time updates pomocí SSE
  useSSE<Event & { ticketTypes: TicketType[] }>(
    "/api/events/stream",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );

  // Funkce pro načtení dalších events
  const loadMoreEvents = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        take: EVENTS_PER_PAGE.toString(),
        skip: events.length.toString(),
      });

      if (debouncedSearchQuery) params.append("q", debouncedSearchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);

      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) throw new Error("Chyba při načítání událostí");
      const newEvents = await response.json();

      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents]);
        setHasMore(newEvents.length === EVENTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Chyba při načítání dalších událostí:", error);
      setError("Nepodařilo se načíst další události");
    } finally {
      setLoadingMore(false);
    }
  }, [events.length, loadingMore, hasMore, debouncedSearchQuery, selectedCategory, sortBy]);

  const filteredEvents = events;

  // Počty událostí v kategoriích - memoizováno pro optimalizaci
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((category) => {
      counts[category.value] =
        events?.filter((e) => e.category === category.value).length || 0;
    });
    return counts;
  }, [events]);

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

  if (initialLoading) {
    return (
      <div>
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-main float-left">
              Procházet podle kategorie
            </h2>
          </div>
          <SearchBox
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </section>
        <div className="glass-effect border-border/30 rounded-lg p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
          <p className="text-muted text-lg mb-6">
            Načítám události...
          </p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div>
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-main">
              Procházet podle kategorie
            </h2>

          </div>
          <SearchBox
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </section>
        <div className="glass-effect border-border/30 rounded-lg p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted text-lg mb-6">
            {debouncedSearchQuery || selectedCategory
              ? "Pro zadané filtry nebyly nalezeny žádné události"
              : "Zatím nejsou k dispozici žádné události"}
          </p>
          {debouncedSearchQuery || selectedCategory ? (
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
              variant="outline"
              className="glass-button px-6 py-3 rounded-xl"
            >
              Vymazat filtry
            </Button>
          ) : (
            <Link
              href="/create-event"
              className="inline-block glass-button px-6 py-3 rounded-xl text-main hover:scale-105 transition-all duration-300"
            >
              Vytvořit první událost
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Zobrazujeme prvních 4 events, nebo všechny pokud showAll = true
  const displayedEvents = showAll
    ? filteredEvents
    : filteredEvents.slice(0, EVENTS_PER_PAGE);

  // Tlačítka pro zobrazení více
  const hasAppliedFilters = debouncedSearchQuery || (selectedCategory && selectedCategory !== "all");

  return (
    <div>
      {/* Kategorie pro filtrování */}
      <section className="mb-12">
        <div className="text-left mb-8">
          <p className="text-3xl md:text-4xl font-bold mb-4 text-main">
            Procházet podle kategorie
          </p>
        </div>

        {/* Dynamicky nastavíme počet sloupců podle počtu kategorií */}

        <SearchBox
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </section>

      {/* Filtrované události */}
      <section>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayedEvents.map((event) => (
            <div
              key={event.slug || event.id}
              className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden hover:z-10 transform-gpu rounded-lg"
              style={{ transformOrigin: "center center" }}
              onClick={() => {
                const eventUrl = event.slug
                  ? `/events/${event.slug}`
                  : `/events/${event.id}`;
                window.location.href = eventUrl;
              }}
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
                <div className="glass-effect p-3 rounded-b-lg">
                  {/* Basic info always visible - only name and price */}
                  <h3 className="text-main text-lg line-clamp-2 transition-colors mb-1 font-semibold">
                    {event.name}
                  </h3>

                  {/* Price info always visible */}
                  <div className="flex justify-between items-center pt-1 border-t border-border/20">
                    <span className="text-xs text-muted">Od</span>
                    <span className="text-main font-semibold ">
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
                      <div className="flex items-center space-x-2 text-dim">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-dim">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(event.date).toLocaleDateString("cs-CZ")}
                          </span>
                        </div>
                        {event.category && (
                          <div className="flex items-center space-x-2 text-muted">
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
                      <div className="flex items-center space-x-2 text-dim">
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
        <div className="text-center pt-6 space-y-3 min-h-60">
          {!showAll && filteredEvents && filteredEvents.length > 4 && (
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="glass-button border-primary/30 text-main hover:border-primary/50 hover:scale-105 transition-all duration-300"
            >
              Zobrazit všech {filteredEvents.length} událostí
            </Button>
          )}

          {showAll && (
            <div className="space-y-3">
              {hasMore && (
                <>
                  {loadingMore && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted">
                        Načítám další události...
                      </span>
                    </div>
                  )}
                  {!loadingMore && (
                    <Button
                      onClick={loadMoreEvents}
                      variant="outline"
                      className="glass-button border-primary/30 text-main hover:border-primary/50 hover:scale-105 transition-all duration-300"
                    >
                      Načíst dalších {EVENTS_PER_PAGE}
                    </Button>
                  )}
                </>
              )}
              {!hasMore && events.length > 4 && (
                <p className="text-muted">
                  Zobrazeny všechny dostupné události
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

