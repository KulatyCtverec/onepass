import TicketsTable from "@/components/TicketsTable";

export default function MyTicketsPage() {
  return (
    <main className="min-h-screen text-main py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <TicketsTable caption="Moje lístky" />
      </div>
    </main>
  );
}

