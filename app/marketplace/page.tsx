"use client";

import { useState } from "react";
import { Star, DollarSign, Shield, Plus } from "lucide-react";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import ListingsByEvent from "@/components/ListingsByEvent";
import { useInitialFetch } from "@/lib/hooks/useInitialFetch";
import { Ticket } from "lucide-react";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const listings = useInitialFetch<any[]>("/api/listings");

  const filteredListings = (listings ?? []).filter((listing) => {
    const matchesSearch =
      listing.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "" ||
      (listing.category?.toLowerCase() ?? "") ===
        selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.resalePrice ?? 0) - (b.resalePrice ?? 0);
      case "price-high":
        return (b.resalePrice ?? 0) - (a.resalePrice ?? 0);
      case "newest":
        return (
          new Date(b.listedDate ?? 0).getTime() -
          new Date(a.listedDate ?? 0).getTime()
        );
      case "oldest":
        return (
          new Date(a.listedDate ?? 0).getTime() -
          new Date(b.listedDate ?? 0).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-foreground">
              Přeprodej lístků
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

        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {listings === null ? (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 text-foreground-muted mx-auto mb-4 animate-pulse" />
            <p className="text-foreground-muted">Načítám nabídky...</p>
          </div>
        ) : (
          <ListingsByEvent sortedListings={sortedListings} />
        )}

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
    </div>
  );
}
