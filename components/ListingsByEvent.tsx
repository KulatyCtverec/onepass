"use client";

import { useState } from "react";
import { Ticket, Calendar, Clock, MapPin, Users, Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import categories from "@/config/constants/categories.json";

type Listing = {
  id: string;
  eventTitle?: string;
  eventId?: string;
  ticketType?: string;
  resalePrice?: number;
  originalPrice?: number;
  quantity?: number;
  date?: string;
  time?: string;
  location?: string;
  venue?: string;
  category?: string;
  image?: string;
  savings?: number;
  seller?: { name?: string; rating?: number };
};

function getCategoryLabel(category: string) {
  const c = categories.find(
    (x: { value: string }) => x.value.toLowerCase() === category?.toLowerCase(),
  );
  return c ? (c as { label: string }).label : category;
}

function groupByEvent(listings: Listing[]) {
  const map = new Map<string, Listing[]>();
  for (const l of listings) {
    const key = l.eventId ?? l.eventTitle ?? l.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return Array.from(map.entries()).map(([eventId, items]) => {
    const first = items[0];
    return {
      eventId,
      eventTitle: first?.eventTitle ?? "—",
      date: first?.date,
      time: first?.time,
      location: first?.location,
      venue: first?.venue,
      category: first?.category,
      image: first?.image,
      listings: items,
    };
  });
}

function groupByTicketType(listings: Listing[]) {
  const map = new Map<string, Listing[]>();
  for (const l of listings) {
    const key = l.ticketType ?? "—";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return Array.from(map.entries()).map(([ticketType, items]) => ({
    ticketType,
    listings: [...items].sort(
      (a, b) => (a.resalePrice ?? 0) - (b.resalePrice ?? 0),
    ),
  }));
}

export default function ListingsByEvent(props: { sortedListings: Listing[] }) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const groups = groupByEvent(props.sortedListings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Dostupné nabídky
          </h2>
          <p className="text-sm text-foreground-muted opacity-70">
            Skupiny podle události — klikněte pro zobrazení nabídek
          </p>
        </div>
        <Link
          href="/marketplace/sell"
          className="px-6 py-3 rounded-xl text-base font-medium bg-gradient-primary text-white hover:-translate-y-1 transition-all duration-300 neon-glow"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Prodej mých lístků
        </Link>
      </div>
      <div className="space-y-4">
        {groups.map((group) => {
          const isExpanded = expandedEventId === group.eventId;
          const byType = groupByTicketType(group.listings);

          return (
            <Card
              key={group.eventId}
              className="overflow-hidden glass-effect border-border/30 gap-0"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() =>
                  setExpandedEventId(isExpanded ? null : group.eventId)
                }
              >
                <div className="flex flex-col md:flex-row">
                  <div className="aspect-video md:aspect-auto md:w-48 relative shrink-0">
                    <Image
                      src={group.image || "/placeholder.jpg"}
                      alt={group.eventTitle}
                      className="object-cover w-full h-full"
                      width={400}
                      height={250}
                    />
                    <div className="absolute top-2 left-2">
                      <div className="px-2 py-1 bg-primary/20 backdrop-blur-sm rounded text-xs text-white border border-primary/30">
                        {getCategoryLabel(group.category ?? "")}
                      </div>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {group.eventTitle}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-foreground-muted">
                        {group.date && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                            {new Date(group.date).toLocaleDateString("cs-CZ")}
                          </span>
                        )}
                        {group.time && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1.5 text-primary" />
                            {group.time}
                          </span>
                        )}
                        {group.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                            <span className="truncate max-w-[200px]">
                              {group.location}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-foreground-muted">
                        {group.listings.length}{" "}
                        {group.listings.length === 1 ? "nabídka" : "nabídek"}
                      </span>
                      <span
                        className={`inline-block transition-transform duration-300 ease-out ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </CardContent>
                </div>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pt-4 px-4 pb-4 space-y-6 bg-primary/20 border-t border-neutral-500/70">
                    {byType.map(({ ticketType, listings: typeListings }) => (
                      <div
                        key={ticketType}
                        className="p-4 space-y-3 bg-card/30"
                      >
                        <h4 className="text-xl font-semibold text-foreground pb-2 border-b border-neutral-600/80">
                          {ticketType}
                        </h4>
                        <div className="space-y-0 overflow-hidden rounded-xl">
                          <div className="grid grid-cols-[1fr_120px_70px_100px] gap-0 border-b border-neutral-600/50">
                            <div className="pl-4 pr-3 py-2 text-sm text-foreground-muted text-left border-r border-neutral-600/40">
                              Prodejce
                            </div>
                            <div className="px-3 py-2 text-sm text-foreground-muted text-center border-r border-neutral-600/40">
                              Cena za lístek
                            </div>
                            <div className="px-3 py-2 text-sm text-foreground-muted text-center border-r border-neutral-600/40">
                              Počet
                            </div>
                            <div className="px-3 py-2 text-sm text-foreground-muted text-center">
                              Koupit
                            </div>
                          </div>
                          {typeListings.map((listing, index) => (
                            <Link
                              key={listing.id}
                              href={`/marketplace/listings/${listing.id}`}
                              className={`grid grid-cols-[1fr_120px_70px_100px] gap-0 items-center py-3.5 transition-colors no-underline ${
                                index % 2 === 0
                                  ? "bg-white/[0.04] hover:bg-white/[0.07]"
                                  : "bg-white/[0.08] hover:bg-white/[0.11]"
                              }`}
                            >
                              <div className="pl-4 pr-3 text-left text-foreground font-medium truncate" title={listing.seller?.name ?? "—"}>
                                {listing.seller?.name ?? "—"}
                              </div>
                              <div className="px-3 text-center font-semibold text-primary">
                                {listing.resalePrice} Kč
                              </div>
                              <div className="px-3 text-center text-foreground-muted text-sm">
                                {listing.quantity ?? 1}×
                              </div>
                              <div className="px-3 flex justify-center">
                                <span className="inline-flex items-center justify-center rounded-lg bg-primary/20 text-primary px-3 py-1.5 text-sm font-medium">
                                  <Ticket className="h-4 w-4 mr-1.5" />
                                  Koupit
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <Ticket className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Žádné lístky nenalezeny
          </h3>
          <p className="text-foreground-muted">
            Zkuste změnit filtry nebo hledaný výraz
          </p>
        </div>
      )}
    </div>
  );
}
