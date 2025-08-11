"use client";

import { useState } from "react";
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

interface AdminDashboardProps {
  events: (Event & {
    ticketTypes: TicketType[];
    tickets: Ticket[];
  })[];
}

export default function AdminDashboard({ events }: AdminDashboardProps) {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateTicketTypeOpen, setIsCreateTicketTypeOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="space-y-8">
      {/* Statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-secondary-700">
          <CardHeader>
            <CardTitle className="text-accent-400">Celkem událostí</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{events.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-secondary-700">
          <CardHeader>
            <CardTitle className="text-accent-400">Celkem lístků</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {events.reduce((sum, event) => sum + event.tickets.length, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-secondary-700">
          <CardHeader>
            <CardTitle className="text-accent-400">
              Celkem typů lístků
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {events.reduce((sum, event) => sum + event.ticketTypes.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Akce */}
      <div className="flex gap-4 flex-wrap">
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-600 hover:bg-accent-700 text-white">
              ➕ Vytvořit událost
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-accent-600 text-white">
            <DialogHeader>
              <DialogTitle className="text-accent-400">
                Vytvořit novou událost
              </DialogTitle>
            </DialogHeader>
            <CreateEventForm onSuccess={() => setIsCreateEventOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCreateTicketTypeOpen}
          onOpenChange={setIsCreateTicketTypeOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-primary-600 hover:bg-primary-700 text-white"
              disabled={!selectedEvent}
            >
              🎫 Vytvořit typ lístku
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-accent-600 text-white">
            <DialogHeader>
              <DialogTitle className="text-accent-400">
                Vytvořit nový typ lístku
              </DialogTitle>
            </DialogHeader>
            <CreateTicketTypeForm
              eventId={selectedEvent?.id || ""}
              onSuccess={() => setIsCreateTicketTypeOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Button
          onClick={() => window.open("/admin/verify-tickets", "_blank")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          🔍 Ověřit vstupenky
        </Button>
      </div>

      {/* Seznam událostí */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Moje události</h2>
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
                <div className="space-y-2">
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
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Upravit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Typy lístků
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
