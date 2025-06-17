"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  // Funkce pro zpracování změn ve formuláři
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funkce pro odeslání formuláře
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.date ||
      !formData.location ||
      !formData.description
    ) {
      setError("Všechna pole musí být vyplněná.");
      return;
    }

    try {
      // Tady můžeš poslat data na backend nebo blockchain pro vytvoření události
      // Příklad: await createEvent(formData);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Chyba při vytváření události.");
      }
      // Po úspěšném vytvoření události přesměruj uživatele
      router.push("/events");
    } catch (err) {
      console.error(err);
      setError("Něco se pokazilo při vytváření události. Zkuste to znovu.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Vytvořit novou událost</h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold">
            Název události
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
            placeholder="Zadejte název události"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-lg font-semibold">
            Datum
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-semibold">
            Místo
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
            placeholder="Kde se událost koná?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold">
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
            placeholder="Popište událost"
            rows={4}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg transition"
          >
            Vytvořit událost
          </button>
        </div>
      </form>
    </div>
  );
}
