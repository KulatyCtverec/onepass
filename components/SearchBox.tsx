import React, { useState, useRef } from "react";
import categories from "@/config/constants/categories.json";
import sorts from "@/config/constants/sorts.json";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
interface SearchBoxProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}
function SearchBox({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}: SearchBoxProps) {
  const [categoryBeforeOpen, setCategoryBeforeOpen] = useState<string>("");
  const shouldClearRef = useRef(false);
  const [selectKey, setSelectKey] = useState(0);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-start">
        <Select
          key={`category-${selectKey}`}
          value={selectedCategory === "" ? undefined : selectedCategory}
          onOpenChange={(open) => {
            if (open) {
              // Když se select otevře, uložíme aktuální hodnotu
              setCategoryBeforeOpen(selectedCategory);
              shouldClearRef.current = false;
            } else {
              // Když se select zavře, zkontrolujeme, jestli máme vyčistit hodnotu
              if (shouldClearRef.current) {
                // Použijeme queueMicrotask pro asynchronní aktualizaci po dokončení renderu
                queueMicrotask(() => {
                  setSelectedCategory("");
                  setSelectKey((prev) => prev + 1);
                  shouldClearRef.current = false;
                });
              }
            }
          }}
          onValueChange={(value) => {
            // Pokud vybere stejnou kategorii, označíme, že ji máme vyčistit
            if (selectedCategory === value) {
              shouldClearRef.current = true;
            } else {
              setSelectedCategory(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent className="border border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl">
            <SelectGroup>
              <SelectLabel className="text-muted font-semibold text-xs uppercase tracking-wider px-2 py-2">
                Kategorie události
              </SelectLabel>
              {categories.map((category) => {
                const isSelected = selectedCategory === category.value;
                return (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    onPointerDown={(e) => {
                      // Pokud klikne na už vybranou kategorii, označíme, že ji máme vyčistit
                      if (isSelected) {
                        e.preventDefault();
                        e.stopPropagation();
                        shouldClearRef.current = true;
                      }
                    }}
                    className="cursor-pointer transition-all duration-200 hover:bg-foreground/10 focus:bg-foreground/20 focus:text-main rounded-md my-0.5 text-main"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy === "" ? undefined : sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
            <SelectValue placeholder="Řadit podle" />
          </SelectTrigger>
          <SelectContent className="border border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl">
            {Object.values(sorts).map((sort) => (
              <SelectItem
                key={sort.value}
                value={sort.value as string}
                className="cursor-pointer transition-all duration-200 hover:bg-foreground/10 focus:bg-foreground/20 focus:text-main rounded-md my-0.5 text-main"
              >
                {sort.label as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default SearchBox;

