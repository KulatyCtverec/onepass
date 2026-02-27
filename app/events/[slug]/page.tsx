import EventDetail from "@/components/EventDetail";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen text-main py-8">
      <EventDetail params={params} />
    </main>
  );
}
