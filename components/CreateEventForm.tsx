"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      router.push("/events");
    }
    else {
      console.error("Failed to create event");
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="glass-effect border-border/30">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Název události
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Např. Rockový koncert 2024"
              className="bg-input-background border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Popis události
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-border/50 bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Popište událost..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">
              Místo konání
            </Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Např. O2 Arena, Praha"
              className="bg-input-background border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">
              Datum a čas
            </Label>
            <Input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-input-background border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">
              Cena vstupenky (Kč)
            </Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="bg-input-background border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/25"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-primary text-white hover:scale-105 transition-all duration-300"
            >
              {loading ? "Vytvářím..." : "Vytvořit událost"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 glass-button border-primary/30 text-primary hover:border-primary/50"
            >
              Zrušit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
