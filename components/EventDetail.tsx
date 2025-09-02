"use client";
import { use } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Share2,
  Heart,
  Ticket,
  Star,
  TrendingUp,
} from "lucide-react";
import type { Event } from "@/lib/generated/prisma/client";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import TicketTypes from "@/components/TicketTypes";
import SeatMap from "@/components/SeatMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketType } from "@/lib/generated/prisma/client";
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
            <p className="text-foreground-muted text-lg">
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
      <div className="glass-effect border-b border-border/20 top-16 z-40">
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
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="aspect-video rounded-2xl overflow-hidden relative group bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating badges */}
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium glass-button border-border/30">
                  Událost
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-primary text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1 inline" />
                  Aktivní
                </span>
              </div>

              {/* Event Image or Placeholder */}
              {record.image ? (
                <img
                  src={record.image} // Direct path to image file
                  alt={record.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Obrázek události</p>
                    <p className="text-sm opacity-70">
                      Zde bude zobrazen obrázek události
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-foreground">
                          4.5
                        </span>
                        <span className="text-sm text-foreground-muted">
                          (0 recenzí)
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      {record.name}
                    </CardTitle>
                    <p className="text-foreground-muted text-lg">
                      Organizováno společností OnePass
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-effect border-border/30 hover:border-blue-400/50"
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
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">
                          {new Date(record.date).toLocaleDateString("cs-CZ", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-foreground-muted">
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
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">
                          {record.location}
                        </p>
                        <p className="text-foreground-muted">Místo konání</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance - placeholder */}
                <div className="glass-effect rounded-xl p-6 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">
                          Účastníci
                        </p>
                        <p className="text-foreground-muted">
                          Informace o účasti budou zobrazeny po spuštění prodeje
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000 w-0" />
                      </div>
                      <p className="text-xs text-foreground-muted mt-1">
                        Prodej ještě nezačal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/30 my-8" />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-medium mb-4 text-foreground">
                    O této události
                  </h3>
                  <p className="text-foreground-muted leading-relaxed text-lg">
                    {record.description}
                  </p>
                </div>

                {/* Features - placeholder */}
                <div>
                  <h3 className="text-xl font-medium mb-6 text-foreground">
                    Co je zahrnuto
                  </h3>
                  <div className="glass-effect rounded-xl p-6 border border-border/20">
                    <div className="text-center text-foreground-muted">
                      <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        Informace o službách
                      </p>
                      <p className="text-sm">
                        Detaily o tom, co je zahrnuto v ceně vstupenky, budou
                        zobrazeny později
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seat Map */}
                <div>
                  <h3 className="text-xl font-medium mb-6 text-foreground">
                    Mapa sedadel
                  </h3>
                  <SeatMap />
                </div>
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
