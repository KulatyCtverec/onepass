"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation";
import SignIn from "@/components/sign-in";

export default function Navbar() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticator, setIsAuthenticator] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Zkontrolovat, zda je uživatel admin nebo ověřovatel
      setIsAdmin(session.user.isAdmin || false);
      setIsAuthenticator(session.user.isAuthenticator || false);
    }
  }, [session]);

  return (
    <nav className="w-full bg-black text-white py-4 shadow-lg border-b border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/onepass-logo.svg"
            alt="OnePass Logo"
            width={40}
            height={32}
            className="mr-2 filter brightness-0 invert"
          />
          <span className="text-2xl font-bold text-primary-400">OnePass</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/events"
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Události
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {session && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/my-tickets"
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    Moje lístky
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {isAdmin && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/create-event"
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      ➕ Vytvořit událost
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin"
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      👑 Administrace
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            {isAuthenticator && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/authenticator"
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    📱 Ověřit vstupenky
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <SignIn />
      </div>
    </nav>
  );
}
