"use client";
import { useEffect, useState } from "react";
import HomepageEventsTable from "@/components/HomepageEventsTable";

export default function EventsSection() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        const rect = eventsSection.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="events"
      className={`py-16 px-6 scroll-mt-20 transition-all duration-500 ${
        isActive
          ? "ring-2 ring-primary/20 ring-offset-4 ring-offset-background"
          : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Nejbližší události
          </h2>
        </div>
        <HomepageEventsTable />
      </div>
    </section>
  );
}
