"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  MapPin,
  Star,
  Zap,
  X,
  Save,
  Ticket,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Event, TicketType } from "@/lib/generated/prisma/client";
import { PutBlobResult } from "@vercel/blob";

interface TicketTypeForm {
  id: number;
  name: string;
  price: string;
  quantity: string;
}

interface EditEventFormProps {
  event: Event & { ticketTypes: TicketType[] };
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description || "",
    location: event.location,
    date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    category: event.category || "",
    venue: event.venue || "",
    capacity: event.capacity?.toString() || "",
    address: event.address || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    salesStart: event.salesStart
      ? new Date(event.salesStart).toISOString().split("T")[0]
      : "",
    salesEnd: event.salesEnd
      ? new Date(event.salesEnd).toISOString().split("T")[0]
      : "",
    allowResale: event.allowResale || false,
    requireApproval: event.requireApproval || false,
    sendEmails: event.sendEmails !== false,
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(
    event.ticketTypes.map((tt) => ({
      id: tt.id,
      name: tt.name,
      price: tt.price,
      stock: tt.stock,
      total: tt.total,
      eventid: tt.eventid,
    }))
  );

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event.image || null
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const categories = [
    { value: "music", label: "Hudba", icon: "🎵" },
    { value: "sports", label: "Sport", icon: "⚽" },
    { value: "theater", label: "Divadlo", icon: "🎭" },
    { value: "comedy", label: "Komedie", icon: "😂" },
    { value: "food", label: "Jídlo & Nápoje", icon: "🍷" },
    { value: "technology", label: "Technologie", icon: "💻" },
    { value: "other", label: "Jiné", icon: "✨" },
  ];

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map((t) => parseInt(t.id)), 0) + 1;
    setTicketTypes([
      ...ticketTypes,
      {
        id: newId.toString(),
        name: "",
        price: 0,
        stock: 0,
        total: 0,
        eventid: "",
      },
    ]);
  };

  const removeTicketType = (id: string) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((t) => t.id !== id));
    }
  };

  const updateTicketType = (id: string, field: string, value: string) => {
    setTicketTypes(
      ticketTypes.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validace velikosti
    if (file.size > 4.4 * 1024 * 1024) {
      alert("Soubor je příliš velký. Maximální velikost je 4.4MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Vytvoření lokálního preview pro okamžitou vizualizaci
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Nahrání do blob storage
    setUploadingImage(true);
    try {
      const fileUploadResponse = await fetch(
        `/api/events/image-upload?filename=${file.name}`,
        {
          method: "POST",
          body: file,
        }
      );

      if (!fileUploadResponse.ok) {
        throw new Error("Chyba při nahrávání obrázku");
      }

      const newBlob = (await fileUploadResponse.json()) as PutBlobResult;
      setBlob(newBlob);
      // Preview z blob URL (místo lokálního data URL)
      setImagePreview(newBlob.url);
    } catch (error) {
      console.error("Chyba při nahrávání obrázku:", error);
      alert("Chyba při nahrávání obrázku. Zkuste to prosím znovu.");
      setImagePreview(event.image || null); // Vrátit na původní obrázek
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setBlob(null);
    setImagePreview(event.image || null); // Vrátit na původní obrázek z eventu
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Přidat všechna pole formuláře
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formDataToSend.append(key, value.toString());
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // Přidat ticket types
      formDataToSend.append("ticketTypes", JSON.stringify(ticketTypes));

      // Přidat URL obrázku z blob storage (pokud byl nahrán nový)
      // Pokud nebyl nahrán nový, použije se původní obrázek z eventu
      if (blob?.url) {
        formDataToSend.append("image", blob.url);
      }

      const response = await fetch(`/api/events/${event.slug || event.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nepodařilo se upravit událost");
      }

      const updatedEvent = await response.json();

      // Přesměrovat na detail události - použij nový slug pokud se změnil
      router.push(`/events/${updatedEvent.slug || event.slug || event.id}`);
    } catch (error) {
      console.error("Chyba při úpravě události:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Nastala chyba při úpravě události"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Základní informace */}
      <Card className="glass-effect border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Základní informace</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Název události *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Název vaší události"
                required
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-border/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Vyberte kategorii</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis události</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Popište vaši událost..."
              rows={4}
              className="glass-effect border-border/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Místo a čas */}
      <Card className="glass-effect border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Místo a čas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Místo konání *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Město, místo"
                required
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                placeholder="Název místa"
                className="glass-effect border-border/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Začátek</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Konec</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="glass-effect border-border/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Adresa</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Přesná adresa"
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Kapacita</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="Maximální počet účastníků"
                className="glass-effect border-border/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prodej vstupenek */}
      <Card className="glass-effect border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Prodej vstupenek</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salesStart">Začátek prodeje</Label>
              <Input
                id="salesStart"
                type="datetime-local"
                value={formData.salesStart}
                onChange={(e) =>
                  setFormData({ ...formData, salesStart: e.target.value })
                }
                className="glass-effect border-border/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesEnd">Konec prodeje</Label>
              <Input
                id="salesEnd"
                type="datetime-local"
                value={formData.salesEnd}
                onChange={(e) =>
                  setFormData({ ...formData, salesEnd: e.target.value })
                }
                className="glass-effect border-border/30"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowResale}
                onChange={(e) =>
                  setFormData({ ...formData, allowResale: e.target.checked })
                }
                className="w-4 h-4 text-primary bg-white/5 border-border/30 rounded focus:ring-primary/50"
              />
              <span className="text-sm">Povolit přeprodej vstupenek</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requireApproval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requireApproval: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary bg-white/5 border-border/30 rounded focus:ring-primary/50"
              />
              <span className="text-sm">Vyžadovat schválení</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendEmails}
                onChange={(e) =>
                  setFormData({ ...formData, sendEmails: e.target.checked })
                }
                className="w-4 h-4 text-primary bg-white/5 border-border/30 rounded focus:ring-primary/50"
              />
              <span className="text-sm">Posílat emaily</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Typy vstupenek */}
      <Card className="glass-effect border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-primary" />
            <span>Typy vstupenek</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {ticketTypes.map((ticketType, index) => (
            <div
              key={ticketType.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 glass-effect border-border/30 rounded-lg"
            >
              <div className="space-y-2">
                <Label>Název</Label>
                <Input
                  value={ticketType.name}
                  onChange={(e) =>
                    updateTicketType(ticketType.id, "name", e.target.value)
                  }
                  placeholder="VIP, Standard, atd."
                  className="glass-effect border-border/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Cena (Kč)</Label>
                <Input
                  type="number"
                  value={ticketType.price}
                  onChange={(e) =>
                    updateTicketType(ticketType.id, "price", e.target.value)
                  }
                  placeholder="0"
                  className="glass-effect border-border/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Množství</Label>
                <Input
                  type="number"
                  value={ticketType.stock}
                  onChange={(e) =>
                    updateTicketType(ticketType.id, "stock", e.target.value)
                  }
                  placeholder="0"
                  className="glass-effect border-border/30"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTicketType(ticketType.id)}
                  disabled={ticketTypes.length === 1}
                  className="glass-button border-destructive/30 text-destructive hover:border-destructive/50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addTicketType}
            className="glass-button border-primary/30 text-primary hover:border-primary/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Přidat typ vstupenky
          </Button>
        </CardContent>
      </Card>

      {/* Obrázek události */}
      <Card className="glass-effect border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-primary" />
            <span>Obrázek události</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Nahrát obrázek</Label>
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="glass-effect border-border/30"
            />
            <p className="text-xs text-foreground-muted">
              Maximální velikost: 4.4MB. Podporované formáty: JPG, PNG, GIF
            </p>
          </div>

          {imagePreview && (
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Náhled obrázku"
                width={100}
                height={100}
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-white font-medium">Nahrávání...</div>
                </div>
              )}
              {!uploadingImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2 glass-button border-destructive/30 text-destructive hover:border-destructive/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/events/${event.id}`)}
          className="glass-button border-border/30"
        >
          Zrušit
        </Button>
        <Button type="submit" disabled={loading} className="glass-button">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ukládám...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Uložit změny
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
