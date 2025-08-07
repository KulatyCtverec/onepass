import EventDetail from "@/components/EventDetail";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventID: string }>;
}) {
  return (
    <main className="min-h-screen text-white py-8">
      <EventDetail eventID={params} />
    </main>
  );
}
