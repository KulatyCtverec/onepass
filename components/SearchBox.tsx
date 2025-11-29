import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}
function SearchBox({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}: SearchBoxProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Hledat události nebo lokace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 glass-effect border-border/30 focus:border-primary/50"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground-muted" />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent className="border border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl">
            <SelectGroup>
              <SelectLabel className="text-foreground-muted font-semibold text-xs uppercase tracking-wider px-2 py-2">
                Kategorie události
              </SelectLabel>
              {categories.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  className="cursor-pointer transition-all duration-200 hover:bg-blue-500/10 focus:bg-blue-500/20 focus:text-foreground rounded-md my-0.5 text-foreground"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 glass-effect border-border/30">
            <SelectValue placeholder="Řadit podle" />
          </SelectTrigger>
          <SelectContent className="border border-border/30 bg-gradient-card backdrop-blur-xl shadow-2xl">
            {Object.values(sorts).map((sort) => (
              <SelectItem
                key={sort.value}
                value={sort.value as string}
                className="cursor-pointer transition-all duration-200 hover:bg-blue-500/10 focus:bg-blue-500/20 focus:text-foreground rounded-md my-0.5 text-foreground"
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
