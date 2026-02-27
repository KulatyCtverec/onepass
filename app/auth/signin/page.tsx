"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, Lock } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/components/login-form";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return {
          title: "Účet již existuje",
          message:
            "Už máte účet s tímto emailem. Přihlaste se pomocí hesla nebo použijte jiný způsob přihlášení.",
          icon: <Mail className="h-8 w-8 text-destructive" />,
        };
      case "AccessDenied":
        return {
          title: "Přístup odepřen",
          message: "Nemáte oprávnění k přihlášení. Kontaktujte administrátora.",
          icon: <Lock className="h-8 w-8 text-destructive" />,
        };
      default:
        return {
          title: "Chyba při přihlášení",
          message: "Došlo k neočekávané chybě. Zkuste to znovu.",
          icon: <AlertCircle className="h-8 w-8 text-destructive" />,
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {error ? (
          <Card className="glass-effect border-border/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                {errorInfo.icon}
              </div>
              <CardTitle className="text-destructive text-xl">
                {errorInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted">{errorInfo.message}</p>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full glass-button hover:glass-button"
                >
                  <Link href="/">Zpět na hlavní stránku</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full glass-effect border-border/30 hover:border-primary/50"
                >
                  <Link href="/auth/signin">Zkusit znovu</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}

