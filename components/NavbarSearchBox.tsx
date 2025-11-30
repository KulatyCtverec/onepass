import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const NavbarSearchBox = () => {
  return (
    <div className="flex items-center gap-2 relative">
      <Input
        type="text"
        placeholder="Hledat události nebo lokace..."
        className="pl-12 pr-4 py-3 glass-effect border-border/30 focus:border-primary/50"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground-muted" />
    </div>
  );
};

export default NavbarSearchBox;
