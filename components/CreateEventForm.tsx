"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import categories from "@/config/constants/categories.json";
import OnepassCalendar from "@/components/OnepassCalendar";
import {
  Upload,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Star,
  Zap,
  X,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PutBlobResult } from "@vercel/blob";

interface TicketType {
  id: number;
  name: string;
  price: string;
  quantity: string;
}

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    category: "",
    venue: "",
    capacity: "",
    address: "",
    startTime: "",
    endTime: "",
    salesStart: "",
    salesEnd: "",
    allowResale: false,
    requireApproval: false,
    sendEmails: true,
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: 1, name: "", price: "", quantity: "" },
  ]);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"idle" | "image" | "event">(
    "idle"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map((t) => t.id)) + 1;
    setTicketTypes([
      ...ticketTypes,
      { id: newId, name: "", price: "", quantity: "" },
    ]);
  };

  const removeTicketType = (id: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((t) => t.id !== id));
    }
  };

  const updateTicketType = (id: number, field: string, value: string) => {
    setTicketTypes(
      ticketTypes.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const removeImage = () => {
    setImagePreview(null);
    setBlob(null); // ← PŘIDEJ TOTO
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          submitData.append(key, value.toString());
        }
      });

      if (fileInputRef.current?.files?.[0]) {
        setLoadingPhase("image");
        const file = fileInputRef.current?.files?.[0];
        const fileUploadResponse = await fetch(
          `/api/image-handler/add-image?filename=${file?.name}`,
          { method: "POST", body: file }
        );
        const newBlob = (await fileUploadResponse.json()) as PutBlobResult;
        setBlob(newBlob);
        submitData.append("image", newBlob.url);

        // Vercel Blob potřebuje chvíli na propagaci – bez čekání občas 404
        await new Promise((r) => setTimeout(r, 2000));
        setLoadingPhase("event");
      }

      submitData.append("ticketTypes", JSON.stringify(ticketTypes));

      const response = await fetch("/api/events", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to create event");
        alert("Chyba při vytváření události");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Chyba při vytváření události");
    } finally {
      setLoading(false);
      setLoadingPhase("idle");
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.4 * 1024 * 1024) {
        alert("Soubor je příliš velký. Maximální velikost je 4.4MB.");
        return;
      }

      // Vytvoření preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Vytvoření události
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto opacity-60">
            Vyplňte detaily pro vytvoření vaší úžasné události a začněte
            prodávat vstupenky
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-gradient-card border-border/20 p-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  Základní informace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-foreground">Obrázek události</Label>
                  <div className="mt-3">
                    {imagePreview || blob?.url ? (
                      <div className="relative">
                        <Image
                          src={blob?.url || imagePreview || ""}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="w-full h-48 object-cover rounded-xl border border-border/30"
                        />
                        <Button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="glass-effect border-2 border-dashed border-border/30 rounded-xl p-12 text-center hover:border-blue-400/50 transition-colors cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="p-4 rounded-full bg-gradient-primary mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-foreground mb-2">
                          Klikněte pro nahrání obrázku události
                        </p>
                        <p className="text-xs text-foreground-muted">
                          PNG, JPG až 4,4MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">
                      Název události
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Zadejte název události"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-foreground">
                      Kategorie
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="w-full glass-effect border-border/30 transition-all duration-200 hover:border-blue-400/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 mt-2 h-10">
                        <SelectValue placeholder="Vyberte kategorii" />
                      </SelectTrigger>
                      <SelectContent className="border border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl">
                        <SelectGroup>
                          <SelectLabel className="text-foreground-muted font-semibold text-xs uppercase tracking-wider px-2 py-2">
                            Kategorie události
                          </SelectLabel>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              className="cursor-pointer transition-all duration-200 hover:bg-blue-500/10 focus:bg-blue-500/20 focus:text-foreground rounded-md my-0.5 text-foreground"
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{category.icon}</span>
                                <span>{category.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">
                    Popis události
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Popište vaši událost detailně..."
                    className="min-h-[120px] glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Location */}
            <Card className="bg-gradient-card border-border/20 p-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Datum a místo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-foreground border-border/30">
                      Datum události
                    </Label>
                    <OnepassCalendar
                      date={formData.date}
                      setDate={(date: string) => {
                        setFormData({ ...formData, date });
                      }}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-foreground">
                      Čas začátku
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-foreground">
                      Čas konce
                    </Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="venue" className="text-foreground">
                      Název místa
                    </Label>
                    <Input
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="Zadejte název místa"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="text-foreground">
                      Kapacita místa
                    </Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Maximální počet účastníků"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground">
                    Plná adresa
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ulice, město, PSČ"
                    className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card className="bg-gradient-card border-border/20 p-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-xl">
                    <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Typy vstupenek a ceny
                  </div>
                  <Button
                    type="button"
                    onClick={addTicketType}
                    className="glass-button hover:bg-blue-500/20 hover:border-blue-400/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat typ vstupenky
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="glass-effect border border-border/30 rounded-xl p-6 space-y-4 hover:border-blue-400/30 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">
                        Typ vstupenky {index + 1}
                      </h4>
                      {ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(ticket.id)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={`ticket-name-${ticket.id}`}
                          className="text-foreground"
                        >
                          Název vstupenky
                        </Label>
                        <Input
                          id={`ticket-name-${ticket.id}`}
                          value={ticket.name}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "name", e.target.value)
                          }
                          placeholder="např. Všeobecné vstupné"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`ticket-price-${ticket.id}`}
                          className="text-foreground"
                        >
                          Cena (Kč)
                        </Label>
                        <Input
                          id={`ticket-price-${ticket.id}`}
                          type="number"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "price", e.target.value)
                          }
                          placeholder="0.00"
                          step="0.01"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`ticket-quantity-${ticket.id}`}
                          className="text-foreground"
                        >
                          Dostupné množství
                        </Label>
                        <Input
                          id={`ticket-quantity-${ticket.id}`}
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) =>
                            updateTicketType(
                              ticket.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          placeholder="Počet dostupných"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="bg-gradient-card border-border/20 p-8  ">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  Další nastavení
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="salesStart" className="text-foreground">
                      Začátek prodeje vstupenek
                    </Label>
                    <OnepassCalendar
                      date={formData.salesStart}
                      setDate={(date: string) => {
                        setFormData({ ...formData, salesStart: date });
                      }}
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salesEnd" className="text-foreground">
                      Konec prodeje vstupenek
                    </Label>
                    <OnepassCalendar
                      date={formData.salesEnd}
                      setDate={(date: string) => {
                        setFormData({ ...formData, salesEnd: date });
                      }}
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground">Možnosti události</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="allowResale"
                        checked={formData.allowResale}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border/30 bg-transparent focus:ring-blue-400/25"
                      />
                      <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                        Povolit přeprodej vstupenek
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="requireApproval"
                        checked={formData.requireApproval}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border/30 bg-transparent focus:ring-blue-400/25"
                      />
                      <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                        Vyžadovat schválení účastníků
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="sendEmails"
                        checked={formData.sendEmails}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border/30 bg-transparent focus:ring-blue-400/25"
                      />
                      <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                        Posílat potvrzovací emaily
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="h-px bg-border/30" />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="glass-effect border-border/30 hover:border-blue-400/50 px-8 py-3 text-lg"
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary hover:scale-105 transition-all duration-300 neon-glow px-8 py-3 text-lg"
              >
                {loading
                  ? loadingPhase === "image"
                    ? "Připravujeme obrázek…"
                    : "Vytvářím událost…"
                  : "Publikovat událost"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
