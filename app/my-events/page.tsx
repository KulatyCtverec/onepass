"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, TicketType } from "@/lib/generated/prisma/client";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<
    (Event & { ticketTypes: TicketType[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!session.user?.isAdmin) {
      router.push("/");
      return;
    }

    fetchMyEvents();
  }, [session, status, router]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events/my-events");

      if (!response.ok) {
        throw new Error("Nepodařilo se načíst události");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala chyba");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (
      !confirm("Opravdu chcete smazat tuto událost? Tato akce je nevratná.")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se smazat událost");
      }

      // Odebrat událost ze seznamu
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nastala chyba při mazání");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="glass-effect border-border/30">
          <CardContent className="p-12 text-center">
            <p className="text-destructive text-lg">
              Nemáte oprávnění k přístupu na tuto stránku.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
          Mé události
        </h1>
        <p className="text-foreground-muted text-lg">
          Spravujte své vytvořené události
        </p>
      </div>

      {error && (
        <Card className="glass-effect border-destructive/30 mb-6">
          <CardContent className="p-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 overflow-hidden"
          >
            {/* Event Image */}
            <div className="relative w-full h-48 overflow-hidden">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-xl line-clamp-2 text-white">
                {event.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Event Details */}
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("cs-CZ")}
                  </span>
                </div>
                {event.venue && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              {/* Ticket Types Summary */}
              <div className="pt-2 border-t border-white/20">
                <p className="text-xs text-white/60 mb-2">Typy vstupenek:</p>
                <div className="space-y-1">
                  {event.ticketTypes?.map((ticketType) => (
                    <div
                      key={ticketType.id}
                      className="flex justify-between text-sm text-white/80"
                    >
                      <span>{ticketType.name}</span>
                      <span className="text-primary font-medium">
                        {ticketType.price / 100} Kč
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button asChild size="sm" className="flex-1 glass-button">
                  <Link href={`/events/${event.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Zobrazit
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 glass-button border-primary/30 text-primary hover:border-primary/50"
                >
                  <Link href={`/edit-event/${event.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Upravit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass-button border-destructive/30 text-destructive hover:border-destructive/50"
                  onClick={() => deleteEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Smazat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <Card className="glass-effect border-border/30">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground-muted text-lg mb-6">
              Zatím jste nevytvořili žádné události
            </p>
            <Button asChild className="glass-button">
              <Link href="/create-event">Vytvořit první událost</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
