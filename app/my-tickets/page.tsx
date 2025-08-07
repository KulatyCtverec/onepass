import TicketsTable from "@/components/TicketsTable";

export default function MyTicketsPage() {
  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">🎫 Moje lístky</h1>
        <TicketsTable caption="Moje lístky" />
      </div>
    </main>
  );
}
