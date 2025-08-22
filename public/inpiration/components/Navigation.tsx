import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Search, Plus, Ticket, User, Settings, LogOut, Heart } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and main nav */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onViewChange('home')}
            >
              <div className="p-2 rounded-xl bg-gradient-primary neon-glow group-hover:scale-110 transition-all duration-300 logo-rotate">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent neon-text">
                OnePass
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { key: 'home', label: 'Events' },
                { key: 'resale', label: 'Marketplace' }
              ].map((item) => (
                <button
                  key={item.key}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeView === item.key 
                      ? 'glass-button text-primary neon-glow' 
                      : 'text-foreground-muted hover:text-primary hover:bg-white/5'
                  }`}
                  onClick={() => onViewChange(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground-muted group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 glass-effect border-border/30 focus:border-primary/50 focus:ring-primary/25 transition-all duration-300 placeholder:text-foreground-muted"
              />
            </div>
          </div>

          {/* User menu with Create Event button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => onViewChange('create')}
              className="hidden sm:flex glass-button hover:glass-button px-6 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full glass-effect border-border/30 hover:border-primary/50 transition-all duration-300">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-gradient-primary text-white">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-effect border-border/30" align="end">
                <DropdownMenuItem 
                  onClick={() => onViewChange('dashboard')}
                  className="hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Tickets
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onViewChange('favorites')}
                  className="hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favorite Events
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onViewChange('create')}
                  className="hover:bg-white/10 transition-colors cursor-pointer sm:hidden"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}