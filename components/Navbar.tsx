"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import SignIn from "./sign-in";

const navLinks = [
  { href: "/", label: "Domů" },
  { href: "/events", label: "Události" },
  { href: "/create-event", label: "Vytvořit" },
  { href: "/my-tickets", label: "Moje lístky" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-gray-900 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🎟 OnePass</h1>

        <ul className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "hover:text-purple-400 transition-colors duration-200",
                  pathname === link.href
                    ? "text-purple-500 font-semibold"
                    : "text-gray-300"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <SignIn />
          </li>
        </ul>
      </div>
    </nav>
  );
}
