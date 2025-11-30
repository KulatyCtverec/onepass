"use client";

import { MapPin, Calendar, Plus, ChartBar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketplaceSellPage() {
  const userStats = {
    totalTicketsOwned: 12,
    ticketsSold: 8,
    totalEarned: 1250,
    averageRating: 4.9,
  };

  const userOwnedEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "2024-08-20",
      location: "San Francisco",
      ticketsOwned: 2,
      originalPrice: 299,
      resalePrice: 500,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      location: "Central Park, New York",
      ticketsOwned: 1,
      originalPrice: 189,
      resalePrice: 150,
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
    },
  ];

  const sortedUserOwnedEvents = [...userOwnedEvents].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-foreground">
            Prodávat lístky
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Prodejte své lístky na události v bezpečném a důvěryhodném prostředí
          </p>
        </div>

        {/* Search and Filters */}

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex gap-6 items-stretch">
            {/* User Stats */}
            <Card className="glass-effect border-border/30 flex-1">
              <CardHeader className="pt-6">
                <CardTitle className="flex items-center">
                  <ChartBar className="h-5 w-5 mr-2 text-primary" />
                  Moje statistiky
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {userStats.totalTicketsOwned}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Vlastním lístků
                    </div>
                  </div>
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {userStats.ticketsSold}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Prodaných lístků
                    </div>
                  </div>
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {userStats.totalEarned} Kč
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Celkový výdělek
                    </div>
                  </div>
                  <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">
                      {userStats.averageRating}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Průměrné hodnocení
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Sell */}
            <Card className="glass-effect border-border/30 flex-1">
              <CardHeader className="pt-6">
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-primary" />
                  Rychlý prodej
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground-muted text-sm">
                  Vyberte událost z vašeho seznamu nebo přidejte lístek ručně,
                  pokud událost v systému ještě není.
                </p>
                <Button className="w-full glass-button hover:glass-button">
                  <Ticket className="h-4 w-4 mr-2" />
                  Přidat lístek k prodeji
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User's Owned Events */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Moje prodávané lístky
            </h3>
            <p className="text-sm text-foreground-muted mb-4 opacity-70 py-2">
              Přehled všech aktivních nabídek, které jste dali na marketplace.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedUserOwnedEvents.map((event) => (
                <Card
                  key={event.id}
                  className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      {event.title}
                    </h4>
                    <div className="space-y-1 text-sm text-foreground-muted mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {new Date(event.date).toLocaleDateString("cs-CZ")}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-foreground-muted">
                          Celkem prodávám
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {event.ticketsOwned}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground-muted">
                          Původní cena
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {event.originalPrice} Kč
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground-muted">
                          Prodejní cena
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {event.resalePrice} Kč
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedUserOwnedEvents.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Žádné události nenalezeny
                </h3>
                <p className="text-foreground-muted">
                  Zkuste změnit filtry nebo hledaný výraz
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
