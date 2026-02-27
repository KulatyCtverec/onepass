"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logInWithGoogle } from "@/lib/serveractions/googleSignIn";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isLogin) {
        // Přihlášení
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Nesprávný email nebo heslo");
        } else {
          router.refresh();
        }
      } else {
        // Registrace
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Chyba při registraci");
        } else {
          // Automatické přihlášení po registraci
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError("Registrace úspěšná, ale přihlášení selhalo");
          } else {
            router.refresh();
          }
        }
      }
    } catch {
      setError("Došlo k chybě");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await logInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Chyba při přihlášení přes Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-[#151419] border-0">
        <CardContent className="grid p-0 ">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-main mb-2">
                {isLogin ? "Vítejte zpět" : "Vytvořte účet"}
              </h1>
              <p className="text-muted text-balance">
                {isLogin
                  ? "Přihlaste se do svého OnePass účtu"
                  : "Zaregistrujte se pro přístup k OnePass"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-main font-medium">
                    Jméno
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      placeholder="Zadejte své jméno"
                      className="pl-10 pr-4 py-3 border-border/30 focus:border-primary/50 focus:ring-primary/25 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-main font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Zadejte svůj email"
                    className="pl-10 pr-4 py-3 border-border/30 focus:border-primary/50 focus:ring-primary/25 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-main font-medium"
                >
                  Heslo
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Zadejte své heslo"
                    className="pl-10 pr-12 py-3 border-border/30 focus:border-primary/50 focus:ring-primary/25 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-main transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full glass-button hover:glass-button py-3 text-lg font-medium transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isLogin ? "Přihlašuji..." : "Registruji..."}
                  </>
                ) : isLogin ? (
                  "Přihlásit se"
                ) : (
                  "Vytvořit účet"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted">
                  nebo
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full glass-effect border-border/30 hover:border-primary/50 text-main hover:text-primary transition-all duration-300 py-3"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} className="h-5 w-5 mr-3" />
              Pokračovat s Google
            </Button>

            {/* Toggle */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted hover:text-primary transition-colors text-sm"
              >
                {isLogin
                  ? "Nemáte účet? Zaregistrujte se"
                  : "Máte účet? Přihlaste se"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

