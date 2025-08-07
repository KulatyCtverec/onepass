import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🎪 Vytvořit novou událost
        </h1>
        <CreateEventForm />
      </div>
    </main>
  );
}
