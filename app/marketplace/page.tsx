"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  TrendingUp,
  DollarSign,
  Shield,
  Ticket,
  Plus,
  ChartBar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [resalePrice, setResalePrice] = useState("");

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
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
    },
  ];

  const resaleListings = [
    {
      id: "1",
      eventTitle: "Summer Music Festival 2024",
      originalPrice: 199,
      resalePrice: 180,
      savings: 19,
      date: "2024-07-15",
      time: "18:00",
      location: "Central Park, New York",
      venue: "Great Lawn",
      category: "Music",
      ticketType: "VIP Experience",
      quantity: 2,
      seller: {
        name: "Sarah M.",
        rating: 4.9,
        sales: 23,
        verified: true,
      },
      listedDate: "2024-06-20",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop",
      features: ["VIP lounge access", "Priority entry", "Complimentary drinks"],
      trending: true,
    },
    {
      id: "2",
      eventTitle: "Broadway Musical: Hamilton",
      originalPrice: 150,
      resalePrice: 175,
      savings: -25,
      date: "2024-07-25",
      time: "20:00",
      location: "Broadway Theater, New York",
      venue: "Richard Rodgers Theatre",
      category: "Theater",
      ticketType: "Orchestra",
      quantity: 2,
      seller: {
        name: "Mike R.",
        rating: 4.7,
        sales: 12,
        verified: true,
      },
      listedDate: "2024-06-18",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      trending: false,
    },
  ];

  const categories = [
    { name: "Všechny", key: "all", icon: "✨" },
    { name: "Hudba", key: "music", icon: "🎵" },
    { name: "Sport", key: "sports", icon: "⚽" },
    { name: "Divadlo", key: "theater", icon: "🎭" },
    { name: "Komedie", key: "comedy", icon: "😂" },
    { name: "Jídlo", key: "food", icon: "🍷" },
    { name: "Technologie", key: "technology", icon: "💻" },
  ];

  const filteredListings = resaleListings.filter((listing) => {
    const matchesSearch =
      listing.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      listing.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.resalePrice - b.resalePrice;
      case "price-high":
        return b.resalePrice - a.resalePrice;
      case "newest":
        return (
          new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Marketplace
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Nakupujte a prodávejte lístky na události v bezpečném a důvěryhodném
            prostředí
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground-muted" />
              <Input
                placeholder="Hledat události nebo lokace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 glass-effect border-border/30 focus:border-primary/50"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-border/30">
                {categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
                <SelectValue placeholder="Řadit podle" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-border/30">
                <SelectItem value="newest">Nejnovější</SelectItem>
                <SelectItem value="oldest">Nejstarší</SelectItem>
                <SelectItem value="price-low">Cena: od nejnižší</SelectItem>
                <SelectItem value="price-high">Cena: od nejvyšší</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="buy" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 glass-effect border-border/30">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Nakupovat lístky
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Prodávat lístky
            </TabsTrigger>
          </TabsList>

          {/* Buy Tab */}
          <TabsContent value="buy" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 glass-effect border-border/30 hover:border-primary/50 overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.eventTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4">
                      <div className="px-2 py-1 bg-primary/20 backdrop-blur-sm rounded text-xs text-white border border-primary/30">
                        {listing.category}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4">
                      {listing.trending ? (
                        <div className="px-2 py-1 bg-gradient-to-r from-primary to-secondary rounded text-xs text-white flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </div>
                      ) : listing.savings > 0 ? (
                        <div className="px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded text-xs text-green-400 border border-green-500/30">
                          Ušetříte {listing.savings} Kč
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {listing.eventTitle}
                      </h3>

                      <div className="space-y-2 text-sm text-foreground-muted">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {new Date(listing.date).toLocaleDateString("cs-CZ")}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          {listing.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                        {listing.venue && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <span className="truncate">{listing.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                      <div>
                        <div className="text-xs text-foreground-muted">
                          Původní cena
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {listing.originalPrice} Kč
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground-muted">
                          Prodejní cena
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {listing.resalePrice} Kč
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-foreground-muted ml-1">
                            {listing.seller.rating}
                          </span>
                        </div>
                        <span className="text-xs text-foreground-muted">•</span>
                        <span className="text-xs text-foreground-muted">
                          {listing.seller.sales} prodejů
                        </span>
                        {listing.seller.verified && (
                          <>
                            <span className="text-xs text-foreground-muted">
                              •
                            </span>
                            <Shield className="h-3 w-3 text-green-500" />
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="glass-button hover:glass-button"
                        onClick={() => setSelectedListing(listing)}
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Koupit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedListings.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Žádné lístky nenalezeny
                </h3>
                <p className="text-foreground-muted">
                  Zkuste změnit filtry nebo hledaný výraz
                </p>
              </div>
            )}
          </TabsContent>

          {/* Sell Tab */}
          <TabsContent value="sell" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Stats */}
              <Card className="glass-effect border-border/30">
                <CardHeader>
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
              <Card className="glass-effect border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-primary" />
                    Rychlý prodej
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground-muted text-sm">
                    Máte lístky na událost, kterou se nemůžete zúčastnit?
                    Prodejte je rychle a bezpečně!
                  </p>
                  <Button className="w-full glass-button hover:glass-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat lístek k prodeji
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* User's Owned Events */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Moje události s lístky
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userOwnedEvents.map((event) => (
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
                            Vlastním lístků
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
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-4 glass-effect border-border/30 hover:border-primary/50"
                      >
                        Prodat lístky
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                100% Bezpečné
              </h3>
              <p className="text-foreground-muted text-sm">
                Všechny transakce jsou chráněny a ověřeny
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Ověření prodejců
              </h3>
              <p className="text-foreground-muted text-sm">
                Každý prodejce je pečlivě ověřen
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Garance vrácení
              </h3>
              <p className="text-foreground-muted text-sm">
                Peníze zpět, pokud se něco pokazí
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Detail Dialog */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={() => setSelectedListing(null)}
      >
        <DialogContent className="max-w-2xl glass-effect border-border/30">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {selectedListing.eventTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={selectedListing.image}
                    alt={selectedListing.eventTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-foreground-muted">Datum</div>
                    <div className="font-semibold text-foreground">
                      {new Date(selectedListing.date).toLocaleDateString(
                        "cs-CZ"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">Čas</div>
                    <div className="font-semibold text-foreground">
                      {selectedListing.time}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">Lokace</div>
                    <div className="font-semibold text-foreground">
                      {selectedListing.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">
                      Typ lístku
                    </div>
                    <div className="font-semibold text-foreground">
                      {selectedListing.ticketType}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-foreground-muted">
                        Původní cena
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {selectedListing.originalPrice} Kč
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-foreground-muted">
                        Prodejní cena
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {selectedListing.resalePrice} Kč
                      </div>
                    </div>
                  </div>

                  <Button className="w-full glass-button hover:glass-button text-lg py-3">
                    <Ticket className="h-5 w-5 mr-2" />
                    Koupit lístky za {selectedListing.resalePrice} Kč
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
