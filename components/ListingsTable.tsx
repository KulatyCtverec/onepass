import { Ticket } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import categories from "@/config/constants/categories.json";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
export default function ListingsTable(props: {
  sortedListings: any[];
  selectedListing: any;
  setSelectedListing: (listing: any) => void;
}) {
  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(
      (c: any) => c.value.toLowerCase() === category.toLowerCase(),
    );
    return categoryObj ? categoryObj.label : category;
  };
  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Dostupné nabídky
        </h2>
        <div className="flex items-center gap-2 justify-between">
          <p className="text-sm text-foreground-muted mb-4 opacity-70">
            Přeprodávané lístky od ověřených uživatelů
          </p>
          <p className="text-sm text-foreground-muted mb-4 opacity-70">
            {props.sortedListings.length} nabídek • přeprodávané lístky od
            ověřených uživatelů
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {props.sortedListings.map((listing) => (
            <Link href={`/marketplace/listings/${listing.id}`} key={listing.id}>
              <Card
                key={listing.id}
                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 glass-effect border-border/30 hover:border-primary/50 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={listing.image || "/placeholder.jpg"}
                    alt={listing.eventTitle || "Event Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={250}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

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
                          {listing.seller?.rating ?? "—"}
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
                        props.setSelectedListing(listing);
                      }}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Koupit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {props.sortedListings.length === 0 && (
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
    </>
  );
}
