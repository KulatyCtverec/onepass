"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditEventForm from "@/components/EditEventForm";
import { Event, TicketType } from "@/lib/generated/prisma/client";

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<
    (Event & { ticketTypes: TicketType[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!session.user?.isAdmin) {
      router.push("/");
      return;
    }

    fetchEvent();
  }, [session, status, router, eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        throw new Error("Nepodařilo se načíst událost");
      }

      const data = await response.json();

      // Kontrola, zda je uživatel tvůrcem události
      if (data.createdById !== session?.user?.id) {
        throw new Error("Nemáte oprávnění upravovat tuto událost");
      }

      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala chyba");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="glass-effect border-border/30">
          <CardContent className="p-12 text-center">
            <p className="text-destructive text-lg">
              Nemáte oprávnění k přístupu na tuto stránku.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="glass-effect border-destructive/30">
          <CardContent className="p-12 text-center">
            <p className="text-destructive text-lg mb-6">{error}</p>
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link href="/my-events">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zpět na mé události
                </Link>
              </Button>
              <Button asChild>
                <Link href="/create-event">Vytvořit novou událost</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="glass-effect border-border/30">
          <CardContent className="p-12 text-center">
            <p className="text-foreground-muted text-lg mb-6">
              Událost nebyla nalezena
            </p>
            <Button asChild>
              <Link href="/my-events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět na mé události
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/my-events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na mé události
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Upravit událost
        </h1>
        <p className="text-foreground-muted text-lg">
          Upravte detaily události "{event.name}"
        </p>
      </div>

      <EditEventForm event={event} />
    </div>
  );
}
