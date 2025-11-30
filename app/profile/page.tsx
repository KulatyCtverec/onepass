import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, BarChart3, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <User className="h-8 w-8" />
          Profil
        </h1>

        <div className="bg-black rounded-2xl p-8 border border-secondary-700">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-accent-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {session.user.name?.[0]?.toUpperCase() ||
                session.user.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {session.user.name || "Uživatel"}
              </h2>
              <p className="text-secondary-400">{session.user.email}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-secondary-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistiky
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-400">Zakoupené lístky:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">
                    Navštívené události:
                  </span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Nastavení
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left text-secondary-400 hover:text-white transition-colors">
                  Změnit heslo
                </button>
                <button className="w-full text-left text-secondary-400 hover:text-white transition-colors">
                  Upravit profil
                </button>
                <button className="w-full text-left text-red-400 hover:text-red-300 transition-colors">
                  Smazat účet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
