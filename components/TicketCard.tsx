"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Ticket as TicketIcon,
  Copy,
  Download,
} from "lucide-react";
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
  const [qrData, setQrData] = useState<string>("");

  // Automaticky načteme QR kód z ticket.accesscode (generovaný triggerem)
  useEffect(() => {
    setQrData(ticket.accesscode || "");
  }, [ticket.accesscode]);

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        // Můžeme přidat toast notifikaci
        console.log("QR kód zkopírován do schránky");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const downloadQR = () => {
    if (qrData) {
      const blob = new Blob([qrData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticket.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

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

        {/* QR kód - automaticky generovaný triggerem */}
        <div className="mt-4 p-4 bg-gradient-card rounded-lg border border-border/20">
          <div className="text-center mb-3">
            <h4 className="text-sm font-semibold text-foreground mb-2">QR Kód pro vstup</h4>
            {qrData ? (
              <div className="bg-white p-3 rounded-lg border border-border/20">
                <code className="text-xs break-all font-mono text-gray-800 font-bold">
                  {qrData}
                </code>
              </div>
            ) : (
              <div className="bg-gray-100 p-3 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">
                  QR kód se generuje automaticky...
                </p>
              </div>
            )}
          </div>

          {/* Tlačítka pro kopírování a stažení */}
          {qrData && (
            <div className="flex gap-2 justify-center">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs glass-button"
              >
                <Copy className="w-3 h-3" />
                Kopírovat
              </Button>

              <Button
                onClick={downloadQR}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs glass-button"
              >
                <Download className="w-3 h-3" />
                Stáhnout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
