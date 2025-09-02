import React from "react";
import { TicketType } from "@/lib/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Users, Clock, MapPin } from "lucide-react";

interface TicketTypesProps {
  ticketTypes: TicketType[];
  eventName?: string;
}

export default function TicketTypes({
  ticketTypes,
  eventName,
}: TicketTypesProps) {
  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <Card className="glass-effect border-border/30">
        <CardContent className="p-6 text-center">
          <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground-muted">
            Žádné typy vstupenek nejsou k dispozici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Typy vstupenek
        </h2>
        {eventName && (
          <p className="text-foreground-muted">
            Pro událost:{" "}
            <span className="font-medium text-primary">{eventName}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {ticketTypes.map((ticketType) => (
          <Card
            key={ticketType.id}
            className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
          >
            <CardContent className="p-4">
              {/* Název a cena na jednom řádku */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/20">
                    <Ticket className="w-3 h-3 text-primary" />
                  </div>
                  <CardTitle className="text-base text-foreground">
                    {ticketType.name}
                  </CardTitle>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {ticketType.price / 100} Kč
                  </div>
                </div>
              </div>

              {/* Dostupnost a progress bar */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">Dostupné:</span>
                  <span className="font-medium text-foreground">
                    {ticketType.stock} z {ticketType.total}
                  </span>
                </div>

                <div className="w-full bg-muted/20 rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${(ticketType.stock / ticketType.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tlačítko pro nákup */}
              <Button
                className="w-full glass-button hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                disabled={ticketType.stock === 0}
                size="sm"
              >
                {ticketType.stock === 0 ? (
                  <>
                    <Clock className="w-3 h-3 mr-2" />
                    Vyprodáno
                  </>
                ) : (
                  <>
                    <Ticket className="w-3 h-3 mr-2" />
                    Koupit vstupenku
                  </>
                )}
              </Button>

              {/* Stav zásob */}
              {ticketType.stock === 0 && (
                <div className="text-center mt-2">
                  <p className="text-xs text-destructive font-medium">
                    Tento typ vstupenky je momentálně vyprodaný
                  </p>
                </div>
              )}

              {ticketType.stock > 0 && ticketType.stock <= 5 && (
                <div className="text-center mt-2">
                  <p className="text-xs text-orange-500 font-medium">
                    ⚠️ Pouze {ticketType.stock} vstupenek zbývá!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Souhrn */}
      <Card className="glass-effect border-primary/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {ticketTypes.length}
              </div>
              <div className="text-sm text-foreground-muted">
                Typů vstupenek
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary">
                {ticketTypes.reduce((sum, tt) => sum + tt.total, 0)}
              </div>
              <div className="text-sm text-foreground-muted">
                Celkem vstupenek
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary">
                {ticketTypes.reduce((sum, tt) => sum + tt.stock, 0)}
              </div>
              <div className="text-sm text-foreground-muted">Dostupné</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
