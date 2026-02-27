"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";

interface VerificationResult {
  success: boolean;
  message: string;
  ticket?: {
    id: string;
    eventName: string;
    userName: string;
    ticketType: string;
    verifiedAt: Date;
  };
  error?: string;
  status: number;
}

export default function TicketVerifier() {
  const [accessCode, setAccessCode] = useState("");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationResult[]
  >([]);

  const verifyTicket = async () => {
    if (!accessCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: accessCode.trim() }),
      });

      const result = await response.json();
      const verification: VerificationResult = {
        ...result,
        status: response.status,
      };

      setVerificationResult(verification);

      // Přidáme do historie
      if (verification.success || verification.error) {
        setVerificationHistory((prev) => [verification, ...prev.slice(0, 9)]);
      }

      // Vyčistíme input po úspěšném ověření
      if (verification.success) {
        setAccessCode("");
      }
    } catch (error) {
      console.error("Error verifying ticket:", error);
      const errorResult: VerificationResult = {
        success: false,
        message: "Chyba při ověřování",
        error: "Síťová chyba",
        status: 500,
      };
      setVerificationResult(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (result: VerificationResult) => {
    if (result.status === 200) {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    } else if (result.status === 400) {
      return <AlertCircle className="w-8 h-8 text-yellow-500" />;
    } else {
      return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = (result: VerificationResult) => {
    if (result.status === 200) return "border-green-200 bg-green-50";
    if (result.status === 400) return "border-yellow-200 bg-yellow-50";
    return "border-red-200 bg-red-50";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hlavní verifikátor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary-600" />
            Ověření vstupenky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted mb-4">
                Zadejte access code z vstupenky pro ověření
              </p>
            </div>

            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Zadejte access code..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && verifyTicket()}
                className="text-center text-lg font-mono flex-1"
              />

              <Button
                onClick={verifyTicket}
                disabled={loading || !accessCode.trim()}
                className="bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                {loading ? "Ověřuji..." : "Ověřit"}
              </Button>
            </div>

            {verificationResult && (
              <div
                className={`mt-6 p-4 rounded-lg border-2 ${getStatusColor(
                  verificationResult
                )}`}
              >
                <div className="flex items-center justify-center mb-3">
                  {getStatusIcon(verificationResult)}
                </div>

                <div className="text-center">
                  <h3
                    className={`font-semibold text-lg ${
                      verificationResult.success
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {verificationResult.success
                      ? "Vstupenka ověřena!"
                      : "Chyba při ověřování"}
                  </h3>

                  <p className="text-sm text-muted mt-2">
                    {verificationResult.message || verificationResult.error}
                  </p>

                  {verificationResult.ticket && (
                    <div className="mt-4 p-3 bg-card rounded-lg border border-border/40">
                      <div className="grid grid-cols-2 gap-4 text-sm text-main">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-subtle" />
                          <span className="font-medium">Událost:</span>
                          <span>{verificationResult.ticket.eventName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-subtle" />
                          <span className="font-medium">Uživatel:</span>
                          <span>{verificationResult.ticket.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-subtle" />
                          <span className="font-medium">Typ:</span>
                          <span>{verificationResult.ticket.ticketType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-subtle" />
                          <span className="font-medium">Čas:</span>
                          <span>
                            {formatTime(verificationResult.ticket.verifiedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historie ověření */}
      {verificationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Historie ověření</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {verificationHistory.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(result)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result)}
                      <div>
                        <p className="font-medium">
                          {result.success ? "Ověřeno" : "Chyba"}
                        </p>
                        <p className="text-sm text-muted">
                          {result.message || result.error}
                        </p>
                        {result.ticket && (
                          <p className="text-xs text-subtle">
                            {result.ticket.eventName} - {result.ticket.userName}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-subtle">
                      {result.ticket
                        ? formatTime(result.ticket.verifiedAt)
                        : "Nyní"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

