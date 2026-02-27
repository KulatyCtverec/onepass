"use client";
import { use } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Heart,
  Ticket,
} from "lucide-react";
import type { Event } from "@prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import TicketTypes from "@/components/TicketTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketType } from "@prisma/client";
import Link from "next/link";
interface EventWithTypes extends Event {
  ticketTypes: TicketType[];
}
export default function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const record = useInitialFetch<EventWithTypes>(`/api/events/${slug}`);

  if (!record) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted text-lg">
              ⏳ Načítám událost...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-6 py-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="glass-button border-border/30 hover:border-blue-400/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zpět na události
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="aspect-video rounded-2xl overflow-hidden relative group bg-gradient-card border border-border/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Event Image or Placeholder */}
              {record.image ? (
                <div className="relative w-full h-full">
                  {/* Blur background */}
                  <Image
                    src={record.image}
                    fill
                    alt={record.name}
                    className="w-full h-full object-cover blur-sm scale-110"
                  />
                  {/* Main image */}
                  <Image
                    src={record.image}
                    fill
                    alt={record.name}
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted">
                    <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      Chybí obrázek události
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-main via-dim to-dim bg-clip-text text-transparent">
                      {record.name}
                    </CardTitle>
                    <p className="text-muted text-lg">
                      Organizováno společností OnePass
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-effect border-border/30 hover:border-blue-400/50 hover:text-blue-400"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-effect border-border/30 hover:border-red-400/50 hover:text-red-400"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-effect rounded-xl p-6 border border-border/20">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <Calendar className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-main">
                          {new Date(record.date).toLocaleDateString("cs-CZ", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-muted">
                          {new Date(record.date).toLocaleTimeString("cs-CZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-effect rounded-xl p-6 border border-border/20">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <MapPin className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-main">
                          {record.location}
                        </p>
                        <p className="text-muted">Místo konání</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/30 my-8" />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-medium mb-4 text-main">
                    O této události
                  </h3>
                  <p className="text-muted leading-relaxed text-lg">
                    {record.description}
                  </p>
                </div>

                {/* Seat Map 
                <div>
                  <h3 className="text-xl font-medium mb-6 text-main">
                    Mapa sedadel
                  </h3>
                  <SeatMap />
                </div>
                */}
              </CardContent>
            </Card>
          </div>

          {/* Ticket Purchase */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-gradient-card border-border/20">
              <CardContent>
                <TicketTypes
                  ticketTypes={record.ticketTypes}
                  eventName={record.name}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

