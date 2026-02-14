"use client";

import { useState } from "react";
import { Ticket, Calendar, Clock, MapPin, Users } from "lucide-react";
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
    (x: { value: string }) => x.value.toLowerCase() === category?.toLowerCase()
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
      (a, b) => (a.resalePrice ?? 0) - (b.resalePrice ?? 0)
    ),
  }));
}

export default function ListingsByEvent(props: {
  sortedListings: Listing[];
}) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const groups = groupByEvent(props.sortedListings);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Dostupné nabídky
      </h2>
      <p className="text-sm text-foreground-muted opacity-70">
        Skupiny podle události — klikněte pro zobrazení nabídek
      </p>

      <div className="space-y-4">
        {groups.map((group) => {
          const isExpanded = expandedEventId === group.eventId;
          const byType = groupByTicketType(group.listings);

          return (
            <Card
              key={group.eventId}
              className="overflow-hidden glass-effect border-border/30"
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
                        className={`transform transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </CardContent>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/30 p-4 space-y-6">
                  {byType.map(({ ticketType, listings: typeListings }) => (
                    <div key={ticketType}>
                      <h4 className="text-sm font-semibold text-foreground-muted mb-3 uppercase tracking-wider">
                        {ticketType}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/30 text-left text-foreground-muted">
                              <th className="py-2 pr-4">Prodejce</th>
                              <th className="py-2 pr-4">Cena za lístek</th>
                              <th className="py-2 pr-4">Počet</th>
                              <th className="py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {typeListings.map((listing) => (
                              <tr
                                key={listing.id}
                                className="border-b border-border/10 hover:bg-muted/10"
                              >
                                <td className="py-3 pr-4">
                                  {listing.seller?.name ?? "—"}
                                </td>
                                <td className="py-3 pr-4 font-semibold text-primary">
                                  {listing.resalePrice} Kč
                                </td>
                                <td className="py-3 pr-4">
                                  {listing.quantity ?? 1}
                                </td>
                                <td className="py-3">
                                  <Link
                                    href={`/marketplace/listings/${listing.id}`}
                                  >
                                    <Button size="sm" variant="outline">
                                      <Ticket className="h-4 w-4 mr-1" />
                                      Koupit
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
