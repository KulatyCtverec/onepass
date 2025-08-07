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
      fetch("/api/auth/check-admin")
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  }, [session]);

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-accent-600 hover:bg-accent-700 text-white font-bold"
          >
            {session.user?.name?.[0]?.toUpperCase() ||
              session.user?.email?.[0]?.toUpperCase() ||
              "U"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border-secondary-700 text-white">
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
          className="hover:bg-primary-600 transition-colors text-white"
        >
          Přihlásit se
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-accent-600 text-white shadow-2xl">
        <DialogHeader className="border-b border-accent-600/30 pb-4">
          <DialogTitle className="text-accent-400 text-xl font-bold">
            Přihlásit se do OnePass
          </DialogTitle>
        </DialogHeader>
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
