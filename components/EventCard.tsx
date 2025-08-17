"use client";
import Link from "next/link";
import type { Event } from "@prisma/client";
import { useState } from "react";
import { MapPin, Calendar, Trash2 } from "lucide-react";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Opravdu chcete tuto událost smazat?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Chyba při mazání.");
    } catch (e) {
      console.error(e);
      setError("Smazání selhalo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <div className="glass-effect border-border/30 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-full cursor-pointer group hover:scale-105 hover:shadow-xl">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-foreground-muted bg-muted/20 px-2 py-1 rounded-full">
              Událost
            </span>
          </div>
          
          <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors mb-4 text-foreground">
            {event.name}
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-foreground-muted">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-foreground-muted">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString("cs-CZ")}</span>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="text-destructive text-sm">{error}</div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 hover:border-destructive/50 rounded-xl text-destructive transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            title="Smazat událost"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? "Mažu..." : "Smazat"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
