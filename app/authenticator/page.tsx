import { Metadata } from "next";
import QRCodeScanner from "@/components/QRCodeScanner";

export const metadata: Metadata = {
  title: "Ověřování vstupenek - OnePass",
  description: "Skenování a ověřování QR kódů vstupenek pomocí kamery",
};

export default function AuthenticatorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Ověřování vstupenek
        </h1>
        <p className="text-white">
          Použijte kameru svého zařízení pro skenování QR kódů vstupenek
        </p>
      </div>

      <QRCodeScanner />

      <div className="mt-8 text-center text-sm text-white">
        <p>
          Ujistěte se, že máte povolený přístup ke kameře ve vašem prohlížeči
        </p>
      </div>
    </div>
  );
}
