import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnePass",
  authors: [{ name: "Matěj Janeček", url: "" }],
  keywords: ["events", "tickets"],
  description: "OnePass - a safe place for your events",
  manifest: "/manifest.json",
  themeColor: "#000000",
  colorScheme: "dark",
  icons: {
    icon: [
      {
        url: "/onepass-logo.svg",
        type: "image/svg+xml",
      },
      {
        url: "/onepass-logo.svg",
        type: "image/svg+xml",
      },
      {
        url: "/onepass-logo.svg",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    shortcut: "/onepass-logo.svg",
    apple: "/onepass-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="cs">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}
