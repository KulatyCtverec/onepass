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
import { Role } from "@prisma/client";
import { User, Ticket, LayoutDashboard, Plus, LogOut } from "lucide-react";

export default function SignIn() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<Role>(Role.USER);

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role);
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
            <Link
              href="/profile"
              className="cursor-pointer flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/my-tickets"
              className="cursor-pointer flex items-center gap-2"
            >
              <Ticket className="h-4 w-4" />
              Moje lístky
            </Link>
          </DropdownMenuItem>
          {(userRole === Role.ADMIN || userRole === Role.ORGANIZER) && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/create-event"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Vytvořit událost
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer text-red-400 hover:text-red-300 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
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
      <DialogContent className="shadow-2xl max-w-md p-0 bg-[#151419]">
        <DialogHeader className=" pb-4 px-8 pt-8">
          <DialogTitle className="text-foreground text-xl font-bold text-center"></DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
