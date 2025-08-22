import { useState, useRef } from 'react';
import { Calendar, MapPin, Clock, Ticket, Star, TrendingUp, Compass, Filter, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomepageProps {
  onViewChange: (view: string, eventId?: string) => void;
}

export function Homepage({ onViewChange }: HomepageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMore, setShowMore] = useState(false);
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const eventsRef = useRef<HTMLElement>(null);

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLike = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedEvents = new Set(likedEvents);
    if (newLikedEvents.has(eventId)) {
      newLikedEvents.delete(eventId);
    } else {
      newLikedEvents.add(eventId);
    }
    setLikedEvents(newLikedEvents);
  };

  const allEvents = [
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
      trending: false
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
    },
    // Additional events for "See More"
    {
      id: '5',
      title: 'Basketball Championship Finals',
      date: '2024-08-05',
      time: '19:30',
      location: 'Madison Square Garden, New York',
      price: 120,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop',
      category: 'Sports',
      ticketsLeft: 15,
      trending: false
    },
    {
      id: '6',
      title: 'Comedy Night Special',
      date: '2024-07-30',
      time: '21:00',
      location: 'Comedy Club, New York',
      price: 45,
      image: 'https://images.unsplash.com/photo-1585699447919-d4fe6c84c314?w=500&h=300&fit=crop',
      category: 'Comedy',
      ticketsLeft: 60,
      trending: true
    },
    {
      id: '7',
      title: 'Soccer World Cup Match',
      date: '2024-08-15',
      time: '16:00',
      location: 'MetLife Stadium, New Jersey',
      price: 89,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
      category: 'Sports',
      ticketsLeft: 2500,
      trending: false
    },
    {
      id: '8',
      title: 'AI & Innovation Summit',
      date: '2024-09-05',
      time: '09:00',
      location: 'Silicon Valley Convention Center',
      price: 199,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop',
      category: 'Technology',
      ticketsLeft: 75,
      trending: false
    }
  ];

  const categories = [
    { name: 'All', key: 'all', icon: '✨', count: allEvents.length },
    { name: 'Music', key: 'Music', icon: '🎵', count: allEvents.filter(e => e.category === 'Music').length },
    { name: 'Sports', key: 'Sports', icon: '⚽', count: allEvents.filter(e => e.category === 'Sports').length },
    { name: 'Theater', key: 'Theater', icon: '🎭', count: allEvents.filter(e => e.category === 'Theater').length },
    { name: 'Comedy', key: 'Comedy', icon: '😂', count: allEvents.filter(e => e.category === 'Comedy').length },
    { name: 'Food', key: 'Food', icon: '🍷', count: allEvents.filter(e => e.category === 'Food').length },
    { name: 'Technology', key: 'Technology', icon: '💻', count: allEvents.filter(e => e.category === 'Technology').length }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? allEvents 
    : allEvents.filter(event => event.category === selectedCategory);

  const displayedEvents = showMore ? filteredEvents : filteredEvents.slice(0, 4);

  const handleEventClick = (eventId: string) => {
    onViewChange('event', eventId);
  };

  const handleBuyNowClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewChange('event', eventId);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 glass-button border-primary/30 text-primary hover:border-primary/50">
              <Star className="h-3 w-3 mr-1" />
              Premium Events Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary/80 to-chart-2/80 bg-clip-text text-transparent leading-tight">
              Discover Amazing Events
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent neon-text">
                With OnePass
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Your gateway to unforgettable experiences. Buy tickets securely or sell your extras in our trusted marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={scrollToEvents}
                className="hero-button-clean px-12 py-6 text-xl transition-all duration-300"
              >
                <Compass className="h-6 w-6 mr-3" />
                Browse Events
              </Button>
              <Button 
                size="lg" 
                onClick={() => onViewChange('resale')}
                className="hero-button-clean px-12 py-6 text-xl transition-all duration-300"
              >
                <TrendingUp className="h-6 w-6 mr-3" />
                Sell Tickets
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Browse by Category
            </h2>
            <p className="text-foreground-muted text-lg">Find events that match your interests</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.key} 
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 category-glass overflow-hidden ${
                  selectedCategory === category.key 
                    ? 'border-primary/50 neon-glow' 
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <CardContent className="p-6 text-center relative">
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 filter drop-shadow-lg">{category.icon}</div>
                    <h3 className="font-medium mb-1 text-foreground text-sm">{category.name}</h3>
                    <p className="text-xs text-foreground-muted">{category.count} events</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section ref={eventsRef}>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                {selectedCategory === 'all' ? 'Featured Events' : `${selectedCategory} Events`}
              </h2>
              <p className="text-foreground-muted">Don't miss these amazing upcoming events</p>
            </div>
            {selectedCategory !== 'all' && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('all')}
                className="glass-effect border-border/30 hover:border-primary/50 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                View All Events
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedEvents.map((event) => (
              <Card 
                key={event.id} 
                className="group cursor-pointer transition-all duration-500 hover:scale-105 enhanced-card overflow-hidden flex flex-col"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover event-image-expand"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="glass-button border-border/30 text-xs">
                      {event.category}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    {event.trending ? (
                      <Badge className="bg-gradient-primary text-white text-xs border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    ) : event.ticketsLeft < 20 ? (
                      <Badge variant="destructive" className="text-xs">
                        {event.ticketsLeft} left
                      </Badge>
                    ) : null}
                  </div>

                  {/* Heart button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute bottom-4 right-4 heart-button p-2 glass-effect border-border/30 hover:border-red-400/50 ${
                      likedEvents.has(event.id) ? 'liked' : ''
                    }`}
                    onClick={(e) => toggleLike(event.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${likedEvents.has(event.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <CardHeader className="pb-3 flex-1">
                  <CardTitle className="line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2 text-sm text-foreground-muted flex-1">
                    <div className="flex items-center group-hover:text-primary transition-colors">
                      <Calendar className="h-4 w-4 mr-3 text-primary" />
                      {new Date(event.date).toLocaleDateString('cs-CZ', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center group-hover:text-primary transition-colors">
                      <Clock className="h-4 w-4 mr-3 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center group-hover:text-primary transition-colors">
                      <MapPin className="h-4 w-4 mr-3 text-primary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  
                  {/* Fixed position for price and button */}
                  <div className="flex justify-between items-center pt-4 mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-chart-4">${event.price}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={(e) => handleBuyNowClick(event.id, e)}
                      className="buy-now-button"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* See More Button */}
          {filteredEvents.length > 4 && !showMore && (
            <div className="text-center mt-12">
              <Button 
                size="lg"
                onClick={() => setShowMore(true)}
                className="glass-button px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                See More Events
              </Button>
            </div>
          )}

          {/* Show Less Button */}
          {showMore && (
            <div className="text-center mt-12">
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setShowMore(false)}
                className="glass-effect border-border/30 hover:border-primary/50 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                Show Less
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}