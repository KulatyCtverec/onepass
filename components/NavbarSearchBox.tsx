"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Calendar, MapPin } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Event, TicketType } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NavbarSearchBox = () => {
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
      router.push(`/?q=${encodeURIComponent(query)}#events`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-muted group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Hledat události..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-background/20 backdrop-blur-md border-border/30 rounded-xl focus:border-primary/50 transition-all text-sm"
        />
      </form>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-background border border-border/40 rounded-xl shadow-2xl overflow-hidden z-60">
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
              Výsledky hledání
            </h3>
            <div className="space-y-0.5">
              {results.length > 0 ? (
                results.map((event) => (
                  <Link
                    key={event.id}
                    href={event.slug ? `/events/${event.slug}` : `/events/${event.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-foreground/5 rounded-lg transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-border/40">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Search className="w-4 h-4 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-main truncate transition-colors">
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
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
                <div className="p-4 text-center text-xs text-muted">
                  Nebyly nalezeny žádné výsledky
                </div>
              )}
            </div>
          </div>
          {results.length > 0 && (
            <div className="p-2 border-t border-border/40 bg-foreground/5">
              <Link
                href={`/?q=${encodeURIComponent(query)}#events`}
                className="block w-full py-1 text-center text-sm text-main hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Zobrazit všechny výsledky
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearchBox;

