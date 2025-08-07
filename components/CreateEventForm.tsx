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

    // Simulace vytvoření události
    setTimeout(() => {
      setLoading(false);
      router.push("/events");
    }, 1000);
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
    <Card className="bg-black border-secondary-700">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-accent-300">
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
              className="bg-gray-800 border-accent-600/50 text-white placeholder:text-gray-400 focus:border-accent-500 focus:ring-accent-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-accent-300">
              Popis události
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-accent-600/50 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Popište událost..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-accent-300">
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
              className="bg-gray-800 border-accent-600/50 text-white placeholder:text-gray-400 focus:border-accent-500 focus:ring-accent-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-accent-300">
              Datum a čas
            </Label>
            <Input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-gray-800 border-accent-600/50 text-white placeholder:text-gray-400 focus:border-accent-500 focus:ring-accent-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-accent-300">
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
              placeholder="1200"
              className="bg-gray-800 border-accent-600/50 text-white placeholder:text-gray-400 focus:border-accent-500 focus:ring-accent-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full !bg-accent-600 hover:!bg-accent-700 text-white h-10 rounded-md px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50"
            size="lg"
          >
            {loading ? "Vytvářím..." : "Vytvořit událost"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
