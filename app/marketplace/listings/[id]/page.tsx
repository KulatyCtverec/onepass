"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import categories from "@/config/constants/categories.json";
import { useSession } from "next-auth/react";

function getCategoryLabel(category: string | null) {
  if (!category) return "—";
  const categoryObj = categories.find(
    (c: { value: string; label: string }) =>
      c.value.toLowerCase() === category.toLowerCase(),
  );
  return categoryObj ? categoryObj.label : category;
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [listing, setListing] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [quantityToBuy, setQuantityToBuy] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/listings/${id}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!cancelled) {
          setListing(ok ? data : null);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setListing(null);
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (listing?.quantity != null && quantityToBuy > listing.quantity) {
      setQuantityToBuy(listing.quantity);
    }
  }, [listing?.quantity, quantityToBuy]);

  if (!loaded) {
    return (
      <main className="min-h-screen text-foreground py-8">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-foreground-muted mx-auto mb-4 animate-pulse" />
            <p className="text-foreground-muted">Načítám nabídku...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!listing?.id) {
    return (
      <main className="min-h-screen text-foreground py-8">
        <div className="container mx-auto px-6">
          <Link href="/marketplace">
            <Button variant="ghost" className="glass-button border-border/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na přeprodej lístků
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-foreground-muted">
              Nabídka nebyla nalezena nebo již není k dispozici.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const quantity = listing.quantity ?? 0;
  const maxSelect = Math.max(1, quantity);
  const effectiveQty = Math.min(quantityToBuy, maxSelect);
  const imageSrc = listing.image || "/placeholder.jpg";
  const savings =
    listing.originalPrice != null && listing.price != null
      ? listing.originalPrice - listing.price
      : null;
  const isOwner = !!session?.user?.id && listing.ownerId === session.user.id;

  return (
    <main className="min-h-screen text-foreground py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link href="/marketplace">
            <Button
              variant="ghost"
              className="glass-button border-border/30 hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na přeprodej lístků
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          {listing.eventName}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video rounded-2xl overflow-hidden relative group bg-gradient-card border border-border/20">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-1" />
              <div className="absolute top-4 left-4 z-2">
                <div className="px-2 py-1 bg-primary/20 backdrop-blur-sm rounded text-xs text-white border border-primary/30">
                  {getCategoryLabel(listing.category)}
                </div>
              </div>
              {savings != null && savings > 0 && (
                <div className="absolute top-4 right-4 z-2">
                  <div className="px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded text-xs text-emerald-300">
                    Ušetříte {savings} Kč
                  </div>
                </div>
              )}
              <Image
                src={imageSrc}
                alt={listing.eventName || "Event"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <Card className="bg-gradient-card border-border/20">
              <CardHeader className="px-6 py-4">
                Typ lístku:
                {listing.ticketTypeName && (
                  <p className="text-xl font-bold text-foreground">
                    {listing.ticketTypeName}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-6">
                <div className="space-y-3 text-sm text-foreground-muted">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary shrink-0" />
                    {listing.date
                      ? new Date(listing.date).toLocaleDateString("cs-CZ", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
                    {listing.startTime ?? "—"}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary shrink-0" />
                    <span>{listing.location ?? "—"}</span>
                  </div>
                  {listing.venue && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary shrink-0" />
                      <span>{listing.venue}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4  border-border/30">
                  <span className="text-sm text-foreground-muted">
                    Prodejce: {listing.seller?.name ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-gradient-card border-border/20">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg text-foreground-muted">
                      Původní cena
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {listing.originalPrice != null
                        ? `${listing.originalPrice} Kč`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg text-foreground-muted">
                      Prodejní cena
                    </span>
                    <span className="text-lg font-semibold text-primary">
                      {listing.price != null ? `${listing.price} Kč` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg text-foreground-muted">
                      Celkem:
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {(listing.price ?? 0) * effectiveQty} Kč
                    </span>
                  </div>
                  {quantity > 1 && (
                    <div className="flex justify-between items-baselin gap-2 py-2">
                      <label className="text-lg font-medium text-foreground">
                        Počet lístků:
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="quantity-step-btn rounded-full glass-button"
                          onClick={() =>
                            setQuantityToBuy((q) => Math.max(1, q - 1))
                          }
                          disabled={effectiveQty <= 1}
                        >
                          −
                        </Button>
                        <span className="w-10 text-center font-medium text-xl pb-1">
                          {effectiveQty}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="quantity-step-btn rounded-full glass-button"
                          onClick={() =>
                            setQuantityToBuy((q) => Math.min(maxSelect, q + 1))
                          }
                          disabled={effectiveQty >= maxSelect}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {isOwner ? (
                  <span
                    className="block w-full"
                    title="Vlastník lístku nemůže lístek koupit"
                  >
                    <Button
                      disabled
                      className="w-full px-8 py-4 rounded-xl text-lg font-medium bg-muted text-muted-foreground cursor-not-allowed"
                      size="lg"
                    >
                      <Ticket className="h-5 w-5 mr-2" />
                      Koupit lístek{effectiveQty > 1 ? "y" : ""}
                    </Button>
                  </span>
                ) : (
                  <Link
                    href={`/checkout?listingId=${listing.id}&quantity=${effectiveQty}`}
                    className="block w-full"
                  >
                    <Button
                      className="w-full px-8 py-4 rounded-xl text-lg font-medium bg-gradient-primary text-white hover:scale-[1.02] transition-all duration-300 neon-glow"
                      size="lg"
                    >
                      <Ticket className="h-5 w-5 mr-2" />
                      {effectiveQty > 1 ? "Koupit lístky" : "Koupit lístek"}
                    </Button>
                  </Link>
                )}

                <p className="text-xs text-foreground-muted text-center">
                  Bezpečná transakce přes OnePass. Peníze zpět při problémech.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
