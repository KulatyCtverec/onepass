import EventsTable from "@/components/EventsTable";

export default async function EventsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Události</h1>
      <EventsTable />
    </div>
  );
}
