import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, BarChart3, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen text-main py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Profil
        </h1>

        <div className="bg-card rounded-2xl p-8 border border-border/40">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              {session.user.name?.[0]?.toUpperCase() ||
                session.user.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-main">
                {session.user.name || "Uživatel"}
              </h2>
              <p className="text-muted">{session.user.email}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-background-secondary rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-main">
                <BarChart3 className="h-5 w-5 text-primary" />
                Statistiky
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Zakoupené lístky:</span>
                  <span className="font-semibold text-main">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">
                    Navštívené události:
                  </span>
                  <span className="font-semibold text-main">0</span>
                </div>
              </div>
            </div>

            <div className="bg-background-secondary rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-main">
                <Settings className="h-5 w-5 text-primary" />
                Nastavení
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left text-muted hover:text-main transition-colors">
                  Změnit heslo
                </button>
                <button className="w-full text-left text-muted hover:text-main transition-colors">
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

