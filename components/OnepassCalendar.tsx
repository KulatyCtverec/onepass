"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnepassCalendarProps {
  date: string;
  setDate: (date: string) => void;
  className?: string;
}

export default function OnepassCalendar({
  date,
  setDate,
  className,
}: OnepassCalendarProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between font-normal glass-effect border-border/30 hover:border-blue-400/50 focus:border-blue-400/50 h-10",
            className
          )}
        >
          {date ? new Date(date).toLocaleDateString("cs-CZ") : "Vyberte datum"}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          captionLayout="dropdown"
          fromDate={new Date()}
          toDate={new Date(new Date().getFullYear() + 3, 11, 31)}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 3}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              // Použij lokální datum bez timezone konverze
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0"
              );
              const day = String(selectedDate.getDate()).padStart(2, "0");
              setDate(`${year}-${month}-${day}`);
              setDatePickerOpen(false);
            }
          }}
          className="rounded-lg"
        />
      </PopoverContent>
    </Popover>
  );
}
