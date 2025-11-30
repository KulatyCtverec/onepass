"use client";

import { useState } from "react";
import categories from "@/config/constants/categories.json";
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
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import SearchBox from "@/components/SearchBox";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedListing, setSelectedListing] = useState<any>(null);
  // Funkce pro převod anglického názvu kategorie na český
  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(
      (c) => c.value.toLowerCase() === category.toLowerCase()
    );
    return categoryObj ? categoryObj.label : category;
  };

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
      quantity: 6,
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

  const filteredListings = resaleListings.filter((listing) => {
    const matchesSearch =
      listing.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "" ||
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
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-foreground">
              Marketplace
            </h1>
            <p className="text-foreground-muted text-sm md:text-base mt-2 max-w-xl">
              Nakupujte přeprodávané lístky v bezpečném a důvěryhodném
              prostředí.
            </p>
          </div>

          <Link
            href="/marketplace/sell"
            className="px-6 py-3 rounded-xl text-base font-medium bg-gradient-primary text-white hover:-translate-y-1 transition-all duration-300 neon-glow"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Prodat svůj lístek
          </Link>
        </div>

        {/* Search and Filters */}
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Dostupné nabídky
          </h2>
          <div className="flex items-center gap-2 justify-between">
            <p className="text-sm text-foreground-muted mb-4 opacity-70">
              Přeprodávané lístky od ověřených uživatelů
            </p>
            <p className="text-sm text-foreground-muted mb-4 opacity-70">
              {sortedListings.length} nabídek • přeprodávané lístky od ověřených
              uživatelů
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedListings.map((listing) => (
              <Card
                key={listing.id}
                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 glass-effect border-border/30 hover:border-primary/50 overflow-hidden"
                onClick={() => setSelectedListing(listing)}
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
                      {getCategoryLabel(listing.category)}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 space-y-1">
                    {listing.savings > 0 && (
                      <div className="px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded text-xs text-emerald-300">
                        Ušetříte {listing.savings} Kč
                      </div>
                    )}
                    {listing.savings < 0 && (
                      <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
                        Vysoká poptávka
                      </div>
                    )}
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
                      {listing.quantity && (
                        <div className="text-sm text-foreground-muted">
                          {listing.quantity === 1
                            ? "1 lístek k dispozici"
                            : listing.quantity > 1 && listing.quantity < 5
                            ? `${listing.quantity} lístky k dispozici`
                            : `${listing.quantity} lístků k dispozici`}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="glass-button hover:glass-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedListing(listing);
                      }}
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
        </div>

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
