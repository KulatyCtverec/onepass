"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CreateListingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketsParam = searchParams.get("tickets") ?? "";
  const ticketIds = useMemo(
    () =>
      ticketsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [ticketsParam]
  );

  const [tickets, setTickets] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketIds.length === 0) {
      setLoaded(true);
      return;
    }
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((all: any[]) => {
        const mine = (Array.isArray(all) ? all : []).filter((t) =>
          ticketIds.includes(t.id)
        );
        setTickets(mine);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [ticketIds]);

  const first = tickets[0];
  const eventName = first?.event?.name ?? "—";
  const ticketTypeName = first?.tickettype?.name ?? "—";
  const originalPrice =
    first?.tickettype?.price != null
      ? first.tickettype.price >= 1000
        ? first.tickettype.price / 100
        : first.tickettype.price
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const num = parseInt(price, 10);
    if (!Number.isFinite(num) || num < 0) {
      setError("Zadejte platnou cenu v Kč.");
      return;
    }
    if (ticketIds.length === 0) {
      setError("Žádné lístky nebyly vybrány.");
      return;
    }
    setSubmitting(true);
    fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketIds, price: num }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
      })
      .then(() => {
        router.push("/marketplace/sell");
      })
      .catch((err) => {
        setSubmitting(false);
        setError(
          err?.message ?? err?.error ?? "Nepodařilo se vytvořit nabídku."
        );
      });
  };

  if (!loaded) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <Ticket className="w-12 h-12 text-muted mx-auto mb-4 animate-pulse" />
          <p className="text-muted">Načítám...</p>
        </div>
      </div>
    );
  }

  if (ticketIds.length === 0 || tickets.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Link href="/marketplace/sell">
          <Button variant="ghost" className="glass-button border-border/30 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zpět
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted">
            Žádné lístky k prodeji. Vyberte lístky na stránce Prodávat lístky.
          </p>
          <Link href="/marketplace/sell">
            <Button className="mt-4">Přejít na Prodávat lístky</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/marketplace/sell">
        <Button variant="ghost" className="glass-button border-border/30 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět
        </Button>
      </Link>

      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-main mb-2">
          Vytvořit nabídku
        </h1>
        <p className="text-muted mb-8 text-base">
          {eventName} • {ticketTypeName} • {tickets.length}{" "}
          {tickets.length === 1 ? "lístek" : "lístků"}
        </p>

        <Card className="bg-gradient-card border-border/20">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base">
                  Cena za kus (Kč)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={originalPrice != null ? String(originalPrice) : ""}
                  className="text-base h-12"
                />
                {originalPrice != null && (
                  <p className="text-base text-muted">
                    Původní cena: {originalPrice} Kč
                  </p>
                )}
              </div>
              {error && (
                <p className="text-base text-destructive">{error}</p>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="px-10 py-5 text-lg font-medium bg-gradient-primary text-primary-foreground neon-glow hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
              >
                {submitting ? "Vytvářím..." : "Vytvořit nabídku"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-8 text-center">
          <Ticket className="w-12 h-12 text-muted mx-auto mb-4 animate-pulse" />
          <p className="text-muted">Načítám...</p>
        </div>
      }
    >
      <CreateListingForm />
    </Suspense>
  );
}

