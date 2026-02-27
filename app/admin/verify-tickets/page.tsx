import { Metadata } from "next";
import TicketVerifier from "@/components/TicketVerifier";

export const metadata: Metadata = {
  title: "Ověření vstupenek - OnePass Admin",
  description: "Ověřování vstupenek pomocí QR kódů a access codes",
};

export default function VerifyTicketsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-main mb-2">
            Ověření vstupenek
          </h1>
          <p className="text-lg text-muted">
            Ověřte vstupenky pomocí QR kódů nebo access codes
          </p>
        </div>

        {/* Verifikátor */}
        <TicketVerifier />

        {/* Instrukce */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Jak ověřovat vstupenky?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-dim">
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

