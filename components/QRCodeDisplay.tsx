"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";

interface QRCodeDisplayProps {
  ticketId: string;
  eventName: string;
  userName: string;
  eventDate: Date;
  ticketType: string;
}

export default function QRCodeDisplay({
  ticketId,
  eventName,
  userName,
  eventDate,
  ticketType,
}: QRCodeDisplayProps) {
  const [qrData, setQrData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/qr`);
      const data = await response.json();

      if (data.qrString) {
        setQrData(data.qrString);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (qrData) {
      const blob = new Blob([qrData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticketId}.txt`;
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">QR Kód vstupenky</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-600">
            Událost: <span className="font-semibold">{eventName}</span>
          </p>
          <p className="text-sm text-gray-600">
            Uživatel: <span className="font-semibold">{userName}</span>
          </p>
          <p className="text-sm text-gray-600">
            Typ: <span className="font-semibold">{ticketType}</span>
          </p>
          <p className="text-sm text-gray-600">
            Datum:{" "}
            <span className="font-semibold">{formatDate(eventDate)}</span>
          </p>
        </div>

        {qrData ? (
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <code className="text-xs break-all font-mono text-gray-800">
                {qrData}
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-2 mb-4">
              Tento kód můžete skenovat nebo zadat ručně při vstupu
            </p>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Zkopírováno!" : "Kopírovat"}
              </Button>

              <Button
                onClick={downloadQR}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Stáhnout
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">QR kód nebyl vygenerován</p>
          </div>
        )}

        <Button
          onClick={generateQR}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
        >
          {loading ? "Generuji..." : "Vygenerovat QR kód"}
        </Button>
      </CardContent>
    </Card>
  );
}
