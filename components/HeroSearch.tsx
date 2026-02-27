"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Calendar, MapPin } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Event, TicketType } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSearch(props: React.ComponentProps<"div">) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Event & { ticketTypes: TicketType[] })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          take: "5",
        });
        const response = await fetch(`/api/events?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Scrollovat k sekci events a nastavit tam vyhledávání by bylo ideální, 
      // ale pro teď jen přesměrujeme nebo necháme uživatele vybrat z dropdownu.
      // Pokud chce uživatel "všechny výsledky", můžeme ho poslat na sekci s query v URL.
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
        // Zde by bylo fajn nějak předat query do HomepageEventsTable, 
        // ale to vyžaduje sdílený state nebo URL params.
        router.push(`/?q=${encodeURIComponent(query)}#events`);
      }
    }
  };

  return (
    <div className={props.className}>
      <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Hledat události, umělce..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-4 py-6 bg-background/40 backdrop-blur-xl border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg shadow-2xl"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors hidden sm:block"
        >
          Hledat
        </button>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/40 rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
          <div className="p-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
              Události a výsledky
            </h3>
            <div className="space-y-1">
              {results.length > 0 ? (
                results.map((event) => (
                  <Link
                    key={event.id}
                    href={event.slug ? `/events/${event.slug}` : `/events/${event.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border/40">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                          <Search className="w-6 h-6 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-main truncate transition-colors">
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString("cs-CZ")}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-muted">
                  Nebyly nalezeny žádné výsledky pro "{query}"
                </div>
              )}
            </div>
          </div>
          {results.length > 0 && (
            <div className="p-2 border-t border-border/40 bg-white/5">
              <Link
                href={`/?q=${encodeURIComponent(query)}#events`}
                className="block w-full py-2 text-center text-sm text-main hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Zobrazit všech {results.length >= 5 ? "výsledky" : results.length}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  </div>);
}

