"use client";

import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Event, Ticket, TicketType } from "@/lib/generated/prisma/client";
import {
  TrendingUp,
  DollarSign,
  Ticket as TicketIcon,
  ShoppingCart,
  Activity,
} from "lucide-react";

interface AdminDashboardProps {
  events: (Event & {
    ticketTypes: TicketType[];
    tickets: (Ticket & {
      tickettype: TicketType;
    })[];
  })[];
}

export default function AdminDashboard({ events }: AdminDashboardProps) {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateTicketTypeOpen, setIsCreateTicketTypeOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Vypočítat statistiky
  const stats = useMemo(() => {
    const allTickets = events.flatMap((event) => event.tickets);
    const totalTickets = allTickets.length;
    const ticketsInCirculation = allTickets.filter((t) => !t.used).length;
    const usedTickets = allTickets.filter((t) => t.used).length;

    // Celkový obrat (cena lístků v haléřích)
    const totalRevenue = allTickets.reduce((sum, ticket) => {
      return sum + (ticket.tickettype?.price || 0);
    }, 0);

    // Prodeje za poslední týden (fake data - 30% z celkových prodejů)
    const salesLastWeek = Math.floor(totalTickets * 0.3);

    // Prodeje za poslední měsíc (fake data - 70% z celkových prodejů)
    const salesLastMonth = Math.floor(totalTickets * 0.7);

    // Průměrná hodnota lístku
    const averageTicketValue =
      totalTickets > 0 ? totalRevenue / totalTickets : 0;

    // Obrat za poslední týden (fake data)
    const revenueLastWeek = Math.floor(totalRevenue * 0.3);

    // Obrat za poslední měsíc (fake data)
    const revenueLastMonth = Math.floor(totalRevenue * 0.7);

    // Růst prodejů (fake data - +12%)
    const salesGrowth = 12;

    return {
      totalTickets,
      ticketsInCirculation,
      usedTickets,
      totalRevenue,
      salesLastWeek,
      salesLastMonth,
      averageTicketValue,
      revenueLastWeek,
      revenueLastMonth,
      salesGrowth,
    };
  }, [events]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="space-y-8">
      {/* Hlavní statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-border/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Celkový obrat
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Z {stats.totalTickets} prodaných lístků
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Lístky v oběhu
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">
              {stats.ticketsInCirculation}
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              {stats.usedTickets} použito
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Prodeje (tento měsíc)
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">
              {stats.salesLastMonth}
            </div>
            <p className="text-xs text-foreground-muted mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />+
              {stats.salesGrowth}% oproti minulému měsíci
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Průměrná hodnota
            </CardTitle>
            <TicketIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(stats.averageTicketValue)}
            </div>
            <p className="text-xs text-foreground-muted mt-1">Na lístek</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailnější statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">Celkem událostí</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-3xl font-bold text-foreground">
              {events.length}
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              {events.filter((e) => new Date(e.date) > new Date()).length}{" "}
              nadcházejících
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">Celkem prodáno</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-3xl font-bold text-foreground">
              {stats.totalTickets}
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              {stats.salesLastWeek} za poslední týden
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">Obrat (tento měsíc)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-3xl font-bold text-foreground">
              {formatPrice(stats.revenueLastMonth)}
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              {formatPrice(stats.revenueLastWeek)} za poslední týden
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graf prodejů za posledních 7 dní */}
        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">
              Prodeje za posledních 7 dní
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {[85, 120, 95, 145, 180, 165, 135].map((value, index) => {
                const maxValue = 180; // Maximální hodnota z dat
                const chartHeight = 256; // h-64 = 256px
                const barHeight = (value / maxValue) * chartHeight;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-3 max-w-[60px] group relative"
                  >
                    <div
                      className="w-full rounded-t-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg relative"
                      style={{
                        height: `${barHeight}px`,
                        minHeight: "20px",
                        background:
                          "linear-gradient(to top, hsl(217, 91%, 50%), hsl(217, 91%, 60%))",
                      }}
                      title={`${value} lístků`}
                    >
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value}
                      </span>
                    </div>
                    <span className="text-xs text-foreground-muted font-medium">
                      {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"][index]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border/20">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Průměr:</span>
                <span className="text-foreground font-semibold">
                  132 lístků/den
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-foreground-muted">Celkem za týden:</span>
                <span className="text-foreground font-semibold">
                  925 lístků
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graf obratu za posledních 6 měsíců */}
        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">
              Obrat za posledních 6 měsíců
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-64 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(217, 91%, 60%)"
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(217, 91%, 60%)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                {/* Plocha pod křivkou */}
                <path
                  d="M 0,180 Q 66,160 100,140 T 200,90 T 300,70 T 400,50 L 400,180 L 0,180 Z"
                  fill="url(#lineGradient)"
                />
                {/* Křivka */}
                <path
                  d="M 0,180 Q 66,160 100,140 T 200,90 T 300,70 T 400,50"
                  fill="none"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Body */}
                {[
                  { x: 0, y: 180 },
                  { x: 66, y: 160 },
                  { x: 100, y: 140 },
                  { x: 200, y: 90 },
                  { x: 300, y: 70 },
                  { x: 400, y: 50 },
                ].map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="hsl(217, 91%, 60%)"
                    className="hover:r-6 transition-all"
                  />
                ))}
              </svg>
              {/* Měsíce */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-foreground-muted px-2">
                {["Leden", "Únor", "Březen", "Duben", "Květen", "Červen"].map(
                  (month, index) => (
                    <span key={index}>{month}</span>
                  )
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/20">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Celkem:</span>
                <span className="text-foreground font-semibold">
                  {formatPrice(4500000)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graf rozdělení lístků podle typu */}
        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">
              Rozdělení lístků podle typu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {[
                { name: "Standard", value: 45, color: "bg-primary" },
                { name: "VIP", value: 25, color: "bg-purple-500" },
                { name: "Studentské", value: 20, color: "bg-blue-500" },
                { name: "Důchodci", value: 10, color: "bg-green-500" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-foreground-muted">{item.value}%</span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-foreground-muted">
                    Nejprodávanější:
                  </span>
                  <span className="text-foreground font-semibold ml-2">
                    Standard
                  </span>
                </div>
                <div>
                  <span className="text-foreground-muted">
                    Nejvyšší hodnota:
                  </span>
                  <span className="text-foreground font-semibold ml-2">
                    VIP
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graf prodejů vs použité lístky */}
        <Card className="glass-effect border-border/30">
          <CardHeader className="p-6">
            <CardTitle className="text-primary">
              Prodeje vs použité lístky
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-64 flex items-center justify-center relative">
              <svg
                className="w-64 h-64"
                viewBox="0 0 200 200"
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* Prodané lístky - 1,885 */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth="40"
                  strokeDasharray={`${
                    (1885 / (1885 + 1470)) * 502.65
                  } ${502.65}`}
                  strokeDashoffset="0"
                  className="transition-all hover:opacity-90"
                />
                {/* Použité lístky - 1,470 */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="40"
                  strokeDasharray={`${
                    (1470 / (1885 + 1470)) * 502.65
                  } ${502.65}`}
                  strokeDashoffset={`-${(1885 / (1885 + 1470)) * 502.65}`}
                  className="transition-all hover:opacity-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {Math.round((1885 / (1885 + 1470)) * 100)}%
                </span>
                <span className="text-xs text-foreground-muted">Prodané</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border/20 space-y-3">
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm text-foreground font-medium">
                    Prodané
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-foreground font-medium">
                    Použité
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-xs text-foreground-muted mb-1">
                    Celkem prodáno
                  </div>
                  <div className="text-lg font-bold text-foreground">1,885</div>
                  <div className="text-xs text-foreground-muted">lístků</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-xs text-foreground-muted mb-1">
                    Celkem použito
                  </div>
                  <div className="text-lg font-bold text-foreground">1,470</div>
                  <div className="text-xs text-foreground-muted">lístků</div>
                </div>
              </div>
              <div className="text-center pt-2">
                <div className="text-xs text-foreground-muted">
                  Použití: {Math.round((1470 / 1885) * 100)}% z prodaných
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CreateEventForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSuccess();
        window.location.reload();
      }
    } catch (error) {
      console.error("Chyba při vytváření události:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-accent-300">
          Název události
        </Label>
        <Input
          id="name"
          name="name"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-accent-300">
          Popis
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <div>
        <Label htmlFor="date" className="text-accent-300">
          Datum
        </Label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <div>
        <Label htmlFor="location" className="text-accent-300">
          Místo
        </Label>
        <Input
          id="location"
          name="location"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent-600 hover:bg-accent-700 text-white"
      >
        {isLoading ? "Vytvářím..." : "Vytvořit událost"}
      </Button>
    </form>
  );
}

function CreateTicketTypeForm({
  eventId,
  onSuccess,
}: {
  eventId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      price: parseInt(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      eventId,
    };

    try {
      const response = await fetch("/api/admin/ticket-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSuccess();
        window.location.reload();
      }
    } catch (error) {
      console.error("Chyba při vytváření typu lístku:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-accent-300">
          Název typu
        </Label>
        <Input
          id="name"
          name="name"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <div>
        <Label htmlFor="price" className="text-accent-300">
          Cena (Kč)
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <div>
        <Label htmlFor="stock" className="text-accent-300">
          Počet dostupných
        </Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          min="1"
          required
          className="bg-gray-800 border-accent-600/50 text-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent-600 hover:bg-accent-700 text-white"
      >
        {isLoading ? "Vytvářím..." : "Vytvořit typ lístku"}
      </Button>
    </form>
  );
}
