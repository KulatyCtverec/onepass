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
import { Role } from "@prisma/client";
import NavbarSearchBox from "./NavbarSearchBox";

export default function Navbar() {
  const { data: session } = useSession();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (session?.user) {
      // Zkontrolovat, zda je uživatel admin nebo ověřovatel
      setRole(session.user.role || null);
    }
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and main nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="transform hover:rotate-180 transition-transform duration-500">
                <div className="p-2 rounded-xl bg-gradient-primary neon-glow group-hover:scale-110 transition-all duration-300">
                  <Image
                    src="/onepass-logo.svg"
                    alt="OnePass Logo"
                    width={24}
                    height={24}
                    className="filter brightness-0 invert"
                  />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent neon-text">
                OnePass
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex items-center space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/marketplace"
                      className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                    >
                      Přeprodej lístků
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {session && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/my-tickets"
                        className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                      >
                        Moje lístky
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {role === Role.ADMIN && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/my-events"
                          className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                        >
                          Mé události
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/create-event"
                          className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                        >
                          Vytvořit událost
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin"
                          className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                        >
                          Administrace
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}

                {role === Role.AUTHENTICATOR && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/authenticator"
                        className="px-4 py-2 rounded-lg transition-all duration-300 text-foreground-muted hover:text-primary hover:bg-white/5"
                      >
                        Ověřit vstupenky
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <NavbarSearchBox />
            <SignIn />
          </div>
        </div>
      </div>
    </nav>
  );
}
