"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Plus, ChartBar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TicketForSale = {
  id: string;
  event: {
    id: string;
    name: string;
    date: string;
    startTime: string | null;
    location: string;
    image: string | null;
    allowResale: boolean;
  };
  tickettype: { id: string; name: string; price: number };
};

type Group = {
  key: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  ticketTypeName: string;
  ticketTypeId: string;
  tickets: TicketForSale[];
};

function groupTickets(tickets: TicketForSale[]): Group[] {
  const map = new Map<string, TicketForSale[]>();
  for (const t of tickets) {
    const key = `${t.event.id}:${t.tickettype.id}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  const groups: Group[] = [];
  map.forEach((tickets, key) => {
    const t = tickets[0];
    groups.push({
      key,
      eventId: t.event.id,
      eventName: t.event.name,
      eventDate: t.event.date,
      ticketTypeName: t.tickettype.name,
      ticketTypeId: t.tickettype.id,
      tickets,
    });
  });
  return groups.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );
}

export default function MarketplaceSellPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    ticketsInSale: number;
    moneyToReceive: number;
    moneySold: number;
  } | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketsForSale, setTicketsForSale] = useState<TicketForSale[]>([]);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [selectedCountByKey, setSelectedCountByKey] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetch("/api/sell/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.ticketsInSale !== undefined) setStats(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/sell/listings")
      .then((r) => r.json())
      .then(setMyListings)
      .catch(() => setMyListings([]));
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
    setSelectedGroupKey(null);
    setSelectedCountByKey({});
    fetch("/api/tickets/for-sale")
      .then((r) => r.json())
      .then((list: TicketForSale[]) => {
        setTicketsForSale(list);
      })
      .catch(() => setTicketsForSale([]));
  };

  const groups = groupTickets(ticketsForSale);
  const onlyResale = groups.filter((g) =>
    g.tickets.every((t) => t.event.allowResale),
  );

  const goToCreateListing = () => {
    if (!selectedGroupKey) return;
    const g = onlyResale.find((x) => x.key === selectedGroupKey);
    if (!g) return;
    const count = Math.min(
      selectedCountByKey[selectedGroupKey] ?? 0,
      g.tickets.length,
    );
    if (count <= 0) return;
    const ids = g.tickets.slice(0, count).map((t) => t.id);
    setDialogOpen(false);
    router.push(
      `/marketplace/create-listing?tickets=${encodeURIComponent(ids.join(","))}`,
    );
  };

  const totalSelected = selectedGroupKey
    ? Math.min(
        selectedCountByKey[selectedGroupKey] ?? 0,
        onlyResale.find((g) => g.key === selectedGroupKey)?.tickets.length ?? 0,
      )
    : 0;

  const handlePlus = (g: Group) => {
    setSelectedGroupKey(g.key);
    setSelectedCountByKey((prev) => ({
      ...prev,
      [g.key]: Math.min(g.tickets.length, (prev[g.key] ?? 0) + 1),
    }));
  };

  const handleMinus = (g: Group) => {
    const current = selectedCountByKey[g.key] ?? 0;
    if (current <= 1) return;
    setSelectedCountByKey((prev) => ({
      ...prev,
      [g.key]: Math.max(0, current - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-foreground">
            Prodávat lístky
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Prodejte své lístky na události v bezpečném a důvěryhodném prostředí
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start ">
            <ChartBar className="h-5 w-5 mr-2 text-primary" />
            <div className="text-xl font-semibold text-foreground">
              Moje statistiky
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <Card className="glass-effect border-border/30 flex-1 order-2">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats?.ticketsInSale ?? "—"}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Lístků v prodeji
                    </div>
                  </div>
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats?.moneyToReceive != null
                        ? `${stats.moneyToReceive} Kč`
                        : "—"}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Získáte při prodeji
                    </div>
                  </div>
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {stats?.moneySold != null ? `${stats.moneySold} Kč` : "—"}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Peníze prodané (po eventu)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Moje prodávané lístky
                </h3>
                <p className="text-sm text-foreground-muted mb-4 opacity-70 py-2">
                  Přehled všech aktivních nabídek na marketplace.
                </p>
              </div>
              <Button
                className="py-6 rounded-xl text-xl font-medium bg-gradient-primary text-white hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 neon-glow"
                onClick={openDialog}
              >
                <Ticket className="h-6 w-6 mr-2" />
                Přidat lístek k prodeji
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myListings.map((item) => (
                <Link href={`/marketplace/listings/${item.id}`} key={item.id}>
                  <Card className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer h-full overflow-hidden">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <Ticket className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        {item.title}
                      </h4>
                      <div className="space-y-1 text-sm text-foreground-muted mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {item.date
                            ? new Date(item.date).toLocaleDateString("cs-CZ")
                            : "—"}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {item.location}
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <div>
                          <div className="text-xs text-foreground-muted">
                            V prodeji
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {item.ticketsOwned}{" "}
                            {item.ticketsOwned === 1 ? "lístek" : "lístků"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-foreground-muted">
                            Vaše cena
                          </div>
                          <div className="text-lg font-bold text-foreground">
                            {item.resalePrice} Kč
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {myListings.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Žádné aktivní nabídky
                </h3>
                <p className="text-foreground-muted">
                  Klikněte na „Přidat lístek k prodeji“ a vyberte lístky.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dialog-solid-bg max-w-lg max-h-[85vh] overflow-y-auto border border-neutral-600/80 shadow-xl">
          <DialogHeader>
            <DialogTitle>Vyberte lístky k prodeji</DialogTitle>
            <DialogDescription>
              Klikněte na skupinu pro výběr. Vyberte právě jednu skupinu a počet
              lístků. Při kliknutí na + se skupina rovnou vybere.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {onlyResale.length === 0 && ticketsForSale.length > 0 && (
              <p className="text-sm text-amber-600">
                U vašich událostí není povolen přeprodej.
              </p>
            )}
            {ticketsForSale.length === 0 && (
              <p className="text-sm text-foreground-muted">
                Nemáte žádné lístky k dispozici k prodeji (všechny mohou být již
                v nabídce).
              </p>
            )}
            {onlyResale.map((g) => {
              const isSelected = selectedGroupKey === g.key;
              const count = selectedCountByKey[g.key] ?? 0;
              return (
                <div
                  key={g.key}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (count > 0) {
                        setSelectedGroupKey(null);
                        setSelectedCountByKey((prev) => ({
                          ...prev,
                          [g.key]: 0,
                        }));
                      } else {
                        setSelectedGroupKey(g.key);
                        setSelectedCountByKey((prev) => ({
                          ...prev,
                          [g.key]: 1,
                        }));
                      }
                    }
                  }}
                  onClick={() => {
                    if (count > 0) {
                      setSelectedGroupKey(null);
                      setSelectedCountByKey((prev) => ({
                        ...prev,
                        [g.key]: 0,
                      }));
                    } else {
                      setSelectedGroupKey(g.key);
                      setSelectedCountByKey((prev) => ({
                        ...prev,
                        [g.key]: 1,
                      }));
                    }
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-[0_0_16px_rgba(59,130,246,0.3)]"
                      : "border-neutral-600/70 bg-white/[0.06] hover:border-primary/30"
                  }`}
                >
                  <div className="font-medium text-foreground">
                    {g.eventName}
                  </div>
                  <div className="text-sm text-foreground-muted mb-2">
                    {g.ticketTypeName} • {g.tickets.length}{" "}
                    {g.tickets.length === 1 ? "lístek" : "lístků"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-muted">
                      Přeprodat:
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded !border-neutral-600/80 hover:bg-white/[0.06]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMinus(g);
                      }}
                      disabled={count <= 0}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {count}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded !border-neutral-600/80 hover:bg-white/[0.06]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlus(g);
                      }}
                      disabled={count >= g.tickets.length}
                    >
                      +
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="!border-neutral-600/80">
              Zrušit
            </Button>
            <Button
              onClick={goToCreateListing}
              disabled={totalSelected === 0}
              className="bg-gradient-primary text-white neon-glow"
            >
              Prodat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
