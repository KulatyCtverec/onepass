import { Calendar, MapPin, Clock, Ticket, Star, TrendingUp, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomepageProps {
  onViewChange: (view: string, eventId?: string) => void;
}

export function Homepage({ onViewChange }: HomepageProps) {
  const featuredEvents = [
    {
      id: '1',
      title: 'Summer Music Festival 2024',
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park, New York',
      price: 89,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=300&fit=crop',
      category: 'Music',
      ticketsLeft: 45,
      trending: true
    },
    {
      id: '2',
      title: 'Tech Conference 2024',
      date: '2024-08-20',
      time: '09:00',
      location: 'Convention Center, San Francisco',
      price: 299,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      category: 'Technology',
      ticketsLeft: 120,
      trending: false
    },
    {
      id: '3',
      title: 'Broadway Musical: Hamilton',
      date: '2024-07-25',
      time: '20:00',
      location: 'Broadway Theater, New York',
      price: 150,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
      category: 'Theater',
      ticketsLeft: 8,
      trending: true
    },
    {
      id: '4',
      title: 'Food & Wine Festival',
      date: '2024-09-10',
      time: '12:00',
      location: 'Pier 94, New York',
      price: 75,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop',
      category: 'Food',
      ticketsLeft: 200,
      trending: false
    }
  ];

  const categories = [
    { name: 'Music', icon: '🎵', count: 124, gradient: 'from-pink-500 to-violet-500' },
    { name: 'Sports', icon: '⚽', count: 89, gradient: 'from-green-500 to-teal-500' },
    { name: 'Theater', icon: '🎭', count: 56, gradient: 'from-purple-500 to-indigo-500' },
    { name: 'Comedy', icon: '😂', count: 34, gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Food', icon: '🍷', count: 67, gradient: 'from-red-500 to-pink-500' },
    { name: 'Technology', icon: '💻', count: 43, gradient: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 glass-button border-blue-400/30 text-blue-400 hover:border-blue-400/50">
              <Star className="h-3 w-3 mr-1" />
              Trending Events Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
              Find Amazing Events
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent neon-text">
                Near You
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Discover concerts, festivals, sports events, and more. Buy tickets securely or resell your extras in our modern marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => onViewChange('browse')}
                className="glass-button px-8 py-4 text-lg hover:scale-105 transition-all duration-300 neon-glow"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Events
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="glass-effect border-border/30 hover:border-blue-400/50 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Sell Your Tickets
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <p className="text-foreground-muted text-lg">Find events that match your interests</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-card border-border/20 hover:border-blue-400/30 overflow-hidden">
                <CardContent className="p-8 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 filter drop-shadow-lg">{category.icon}</div>
                    <h3 className="font-medium mb-2 text-foreground">{category.name}</h3>
                    <p className="text-sm text-foreground-muted">{category.count} events</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Featured Events
              </h2>
              <p className="text-foreground-muted">Don't miss these amazing upcoming events</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onViewChange('browse')}
              className="glass-effect border-border/30 hover:border-blue-400/50 transition-all duration-300"
            >
              View All Events
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="group cursor-pointer transition-all duration-500 hover:scale-105 bg-gradient-card border-border/20 hover:border-blue-400/30 overflow-hidden hover:neon-glow">
                <div className="aspect-video relative overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="glass-button border-border/30 text-xs">
                      {event.category}
                    </Badge>
                    {event.trending && (
                      <Badge className="bg-gradient-primary text-white text-xs border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  {event.ticketsLeft < 20 && (
                    <Badge variant="destructive" className="absolute top-4 right-4 text-xs">
                      {event.ticketsLeft} left
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-foreground group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2 text-sm text-foreground-muted">
                    <div className="flex items-center group-hover:text-blue-400 transition-colors">
                      <Calendar className="h-4 w-4 mr-3 text-blue-400" />
                      {new Date(event.date).toLocaleDateString('cs-CZ', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center group-hover:text-blue-400 transition-colors">
                      <Clock className="h-4 w-4 mr-3 text-blue-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center group-hover:text-blue-400 transition-colors">
                      <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-2xl font-bold text-blue-400">${event.price}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onViewChange('event', event.id)}
                      className="glass-button hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}