"use client";
import EventCard from "./EventCard";
import type { Event } from "@prisma/client";
import { useSSE } from "@/lib/hooks/useSSE";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const EVENTS_PER_PAGE = 12;

export default function EventsTable(props: { caption: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { caption } = props;
  const observerTarget = useRef<HTMLDivElement>(null);

  // Načítání počátečních událostí
  useEffect(() => {
    const fetchInitialEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/events?take=${EVENTS_PER_PAGE}&skip=0`
        );
        if (!response.ok) throw new Error("Chyba při načítání událostí");
        const newEvents = await response.json();
        setEvents(newEvents);
        setHasMore(newEvents.length === EVENTS_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nastala chyba");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialEvents();
  }, []);

  // Real-time updates pomocí SSE
  useSSE<Event>(
    "/api/events/stream",
    { value: events, setter: setEvents },
    { value: error, setter: setError }
  );

  // Funkce pro načtení dalších events
  const loadMoreEvents = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(
        `/api/events?take=${EVENTS_PER_PAGE}&skip=${events.length}`
      );
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
  }, [events.length, loadingMore, hasMore]);

  // Intersection Observer pro automatické načítání při scrollu
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreEvents();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMoreEvents]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="glass-effect border-border/30 rounded-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground-muted text-lg">Načítám události...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-effect border-border/30 rounded-lg p-8">
          <p className="text-foreground-muted text-lg">
            Žádné události nebyly nalezeny.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">{caption}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <div key={event.id} className="aspect-[4/3]">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* Lazy loading trigger a tlačítko */}
      <div className="text-center pt-8 space-y-4">
        {hasMore && (
          <>
            <div ref={observerTarget} className="h-10" />
            {loadingMore && (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-foreground-muted">
                  Načítám další události...
                </span>
              </div>
            )}
            {!loadingMore && (
              <Button
                onClick={loadMoreEvents}
                variant="outline"
                className="glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300"
              >
                Načíst dalších {EVENTS_PER_PAGE}
              </Button>
            )}
          </>
        )}
        {!hasMore && events.length >= EVENTS_PER_PAGE && (
          <p className="text-foreground-muted">
            Zobrazeny všechny dostupné události
          </p>
        )}
      </div>
    </div>
  );
}
