import { Metadata } from "next";
import TicketVerifier from "@/components/TicketVerifier";

export const metadata: Metadata = {
  title: "Ověření vstupenek - OnePass Admin",
  description: "Ověřování vstupenek pomocí QR kódů a access codes",
};

export default function VerifyTicketsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ověření vstupenek
          </h1>
          <p className="text-lg text-gray-600">
            Ověřte vstupenky pomocí QR kódů nebo access codes
          </p>
        </div>

        {/* Verifikátor */}
        <TicketVerifier />

        {/* Instrukce */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Jak ověřovat vstupenky?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Uživatel vám ukáže QR kód nebo access code z vstupenky</li>
              <li>
                Zadejte access code do pole výše a klikněte &quot;Ověřit&quot;
              </li>
              <li>Pokud je vstupenka platná, zobrazí se zelená zpráva</li>
              <li>Vstupenka se automaticky označí jako použitá</li>
              <li>Všechny ověření se zaznamenají do historie</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
