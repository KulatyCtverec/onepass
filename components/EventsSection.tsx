"use client";
import { useEffect, useState, Suspense } from "react";
import HomepageEventsTable from "@/components/HomepageEventsTable";
import { Loader2 } from "lucide-react";

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
      className={`py-16 px-6 scroll-mt-20 transition-all duration-500`}
    >
      <div className="container mx-auto">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 glass-effect border-border/30 rounded-lg">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted">Načítám sekci událostí...</p>
            </div>
          }
        >
          <HomepageEventsTable />
        </Suspense>
      </div>
    </section>
  );
}
