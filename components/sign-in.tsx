"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginForm from "./login-form";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignIn() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Zkontrolovat, zda je uživatel admin
      setIsAdmin(session.user.isAdmin || false);
    }
  }, [session]);

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full glass-effect border-border/30 hover:border-primary/50 transition-all duration-300"
          >
            <span className="text-sm font-medium text-primary">
              {session.user?.name?.[0]?.toUpperCase() ||
                session.user?.email?.[0]?.toUpperCase() ||
                "U"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="glass-effect border-border/30"
          align="end"
        >
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              👤 Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-tickets" className="cursor-pointer">
              🎫 Moje lístky
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  👑 Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create-event" className="cursor-pointer">
                  ➕ Vytvořit událost
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer text-red-400 hover:text-red-300"
          >
            🚪 Odhlásit se
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="glass-button hover:glass-button text-white transition-all duration-300"
        >
          Přihlásit se
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-border/30 shadow-2xl max-w-md p-0">
        <DialogHeader className="border-b border-border/30 pb-4 px-8 pt-8">
          <DialogTitle className="text-foreground text-xl font-bold text-center">
            Vítejte v OnePass
          </DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
