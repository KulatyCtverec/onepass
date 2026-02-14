"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Event, Ticket, TicketType } from "@prisma/client";

interface AdminEventsListProps {
  events: (Event & {
    ticketTypes: TicketType[];
    tickets: (Ticket & {
      tickettype: TicketType;
    })[];
  })[];
}

export default function AdminEventsList({ events }: AdminEventsListProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    try {
      const response = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingEvent(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Chyba při úpravě události:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Opravdu chcete smazat tuto událost?")) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Chyba při mazání události:", error);
    }
  };

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <Card className="bg-black border-secondary-700">
          <CardContent className="p-8 text-center">
            <p className="text-secondary-400 text-lg">
              Zatím nemáte žádné události
            </p>
            <a
              href="/create-event"
              className="inline-block mt-4 bg-accent-600 hover:bg-accent-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Vytvořit první událost
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="bg-black border-secondary-700">
              <CardHeader>
                <CardTitle className="text-white">{event.name}</CardTitle>
                <p className="text-secondary-400">{event.location}</p>
                <p className="text-secondary-400">
                  {new Date(event.date).toLocaleDateString("cs-CZ")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Typy lístků:</span>
                    <span className="font-semibold">
                      {event.ticketTypes.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Prodané lístky:</span>
                    <span className="font-semibold">
                      {event.tickets.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Celkový výnos:</span>
                    <span className="font-semibold">
                      {event.tickets.reduce(
                        (sum, ticket) => sum + (ticket.tickettype?.price || 0),
                        0
                      )}{" "}
                      Kč
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingEvent(event);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    ✏️ Upravit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `/admin/events/${event.id}/ticket-types`,
                        "_blank"
                      )
                    }
                  >
                    🎫 Typy lístků
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️ Smazat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-accent-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-accent-400">
              Upravit událost
            </DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-accent-300">
                  Název události
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingEvent.name}
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
                  defaultValue={editingEvent.description}
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
                  defaultValue={new Date(editingEvent.date)
                    .toISOString()
                    .slice(0, 16)}
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
                  defaultValue={editingEvent.location}
                  required
                  className="bg-gray-800 border-accent-600/50 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-accent-600 hover:bg-accent-700 text-white"
                >
                  Uložit změny
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Zrušit
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
