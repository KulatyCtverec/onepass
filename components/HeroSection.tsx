"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        const rect = eventsSection.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection("events");
        } else {
          setActiveSection("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToEvents = () => {
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
      eventsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-primary neon-glow">
              <Image
                src="/onepass-logo.svg"
                alt="OnePass Logo"
                width={48}
                height={40}
                className="filter brightness-0 invert"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
            OnePass
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent neon-text">
              Platforma
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Nejlepší platforma pro správu a prodej vstupenek na události.
            Objevte koncerty, festivaly, sportovní události a mnohem více.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToEvents}
              className={`px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                activeSection === "events"
                  ? "bg-primary text-white scale-105 shadow-lg"
                  : "glass-button hover:scale-105"
              }`}
            >
              {activeSection === "events"
                ? "✓ Procházet události"
                : "Procházet události"}
            </button>
            <Link
              href="/create-event"
              className="px-8 py-4 rounded-xl text-lg font-medium bg-gradient-primary text-white hover:scale-105 transition-all duration-300 neon-glow"
            >
              Vytvořit událost
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
