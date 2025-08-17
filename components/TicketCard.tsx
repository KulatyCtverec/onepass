"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Ticket as TicketIcon,
  QrCode,
} from "lucide-react";
import QRCodeDisplay from "./QRCodeDisplay";
import {
  Ticket,
  TicketType,
  Event,
  User as UserType,
} from "@/lib/generated/prisma";

export default function TicketCard({
  ticket,
}: {
  ticket: Ticket & {
    event: Event;
    user: UserType;
    tickettype: TicketType;
  };
}) {
  const [showQR, setShowQR] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price / 100); // price je v haléřích
  };

  if (!ticket.event || !ticket.user || !ticket.tickettype) {
    return (
      <Card className="h-full glass-effect border-border/30">
        <CardContent className="p-4">
          <p className="text-foreground-muted">Načítání...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {ticket.event.name}
          </CardTitle>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              ticket.used
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {ticket.used ? "Použito" : "Aktivní"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informace o události */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(ticket.event.date)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <MapPin className="w-4 h-4" />
            <span>{ticket.event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <User className="w-4 h-4" />
            <span>{ticket.user.name}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <TicketIcon className="w-4 h-4" />
            <span>{ticket.tickettype.name}</span>
          </div>
        </div>

        {/* Cena */}
        <div className="text-center py-4 bg-gradient-card rounded-lg border border-border/20">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(ticket.tickettype.price)}
          </p>
        </div>

        {/* QR kód tlačítko */}
        <Button
          onClick={() => setShowQR(!showQR)}
          variant="outline"
          className="w-full glass-button border-primary/30 text-primary hover:border-primary/50 hover:scale-105 transition-all duration-300"
        >
          <QrCode className="w-4 h-4" />
          {showQR ? "Skrýt QR kód" : "Zobrazit QR kód"}
        </Button>

        {/* QR kód */}
        {showQR && (
          <div className="mt-4 p-4 bg-gradient-card rounded-lg border border-border/20">
            <QRCodeDisplay
              ticketId={ticket.id}
              eventName={ticket.event.name}
              userName={ticket.user.name || "Unknown"}
              eventDate={ticket.event.date}
              ticketType={ticket.tickettype.name}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
