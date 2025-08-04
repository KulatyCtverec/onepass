"use client";
import { logOut } from "../lib/serveractions/googleSignIn";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/components/login-form";
export default function SignIn() {
  const { data: session } = useSession();
  const user = session?.user;
  useEffect(() => {
    if (user) console.log("User is logged in:", user);
    else console.log("No user is logged in.");
  }, [user]);
  return user ? (
    <form action={logOut}>
      <Button type="submit" className="hover:bg-purple-400 transition">
        Odhlásit se
      </Button>
    </form>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="hover:bg-purple-400 transition">
          Přihlásit se
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Přihlásit se</DialogTitle>
        </DialogHeader>
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
