"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Ticket as TicketIcon,
  Copy,
  Download,
  QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  TicketType,
  Event,
  User as UserType,
} from "@prisma/client";

export default function TicketCard({
  ticket,
}: {
  ticket: Ticket & {
    event: Event;
    owner: UserType | null;
    tickettype: TicketType;
  };
}) {
  const [qrData, setQrData] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Automaticky načteme QR kód z ticket.accesscode (generovaný triggerem)
  useEffect(() => {
    setQrData(ticket.accesscode || "");
  }, [ticket.accesscode]);

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${ticket.id}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
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

  if (!ticket.event || !ticket.tickettype) {
    return (
      <Card className="h-full glass-effect border-border/30">
        <CardContent className="p-4">
          <p className="text-muted">Načítání...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-main line-clamp-1">
            {ticket.event.name}
          </CardTitle>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
              ticket.used
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {ticket.used ? "Použito" : "Aktivní"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Informace o události */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-muted">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">{formatDate(ticket.event.date)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{ticket.event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted">
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {(ticket.owner?.name || ticket.owner?.email) ?? "—"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted">
            <TicketIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">{ticket.tickettype.name}</span>
          </div>
        </div>

        {/* Cena */}
        <div className="text-center py-3 bg-gradient-card rounded-lg border border-border/20">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(ticket.tickettype.price)}
          </p>
        </div>

        {/* QR kód */}
        <div className="mt-auto pt-2">
          <div className="p-4 bg-gradient-card rounded-lg border border-border/20">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                <QrCode className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-main">
                  QR Kód pro vstup
                </h4>
              </div>
              {qrData ? (
                <div
                  ref={qrRef}
                  className="bg-white p-4 rounded-lg border border-border/20 inline-block"
                >
                  <QRCodeSVG
                    value={qrData}
                    size={160}
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
              ) : (
                <div className="bg-background-secondary p-8 rounded-lg border-2 border-dashed border-border/40 inline-block">
                  <p className="text-subtle text-sm">QR kód se generuje...</p>
                </div>
              )}
            </div>

            {/* Tlačítka pro kopírování a stažení */}
            {qrData && (
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs glass-button"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "Zkopírováno!" : "Kopírovat"}
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
        </div>
      </CardContent>
    </Card>
  );
}

