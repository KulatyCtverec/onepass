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
      <Card className="h-full">
        <CardContent className="p-4">
          <p className="text-gray-500">Načítání...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {ticket.event.name}
          </CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              ticket.used
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {ticket.used ? "Použito" : "Aktivní"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informace o události */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(ticket.event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{ticket.event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{ticket.user.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TicketIcon className="w-4 h-4" />
            <span>{ticket.tickettype.name}</span>
          </div>
        </div>

        {/* Cena */}
        <div className="text-center py-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(ticket.tickettype.price)}
          </p>
        </div>

        {/* QR kód tlačítko */}
        <Button
          onClick={() => setShowQR(!showQR)}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          {showQR ? "Skrýt QR kód" : "Zobrazit QR kód"}
        </Button>

        {/* QR kód */}
        {showQR && (
          <div className="mt-4">
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
