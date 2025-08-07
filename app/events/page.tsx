import EventsTable from "@/components/EventsTable";

export default function EventsPage() {
  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <EventsTable caption="Dostupné události" />
      </div>
    </main>
  );
}
