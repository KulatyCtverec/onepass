import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Heart, Ticket, Star, TrendingUp, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

export function EventDetail({ eventId, onBack }: EventDetailProps) {
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [highlightSelectTickets, setHighlightSelectTickets] = useState(false);
  const selectTicketsRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if we came from a Buy Now button
    const cameFromBuyNow = sessionStorage.getItem('buyNowClicked');
    if (cameFromBuyNow === 'true') {
      setHighlightSelectTickets(true);
      sessionStorage.removeItem('buyNowClicked');
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightSelectTickets(false);
      }, 3000);
    }
  }, []);

  const handleBackToEvents = () => {
    onBack();
    // Scroll to events section after a brief delay to allow for navigation
    setTimeout(() => {
      const eventsSection = document.querySelector('[ref="eventsRef"]');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Mock event data
  const event = {
    id: eventId,
    title: 'Summer Music Festival 2024',
    date: '2024-07-15',
    time: '18:00',
    endTime: '23:00',
    location: 'Central Park, New York',
    venue: 'Great Lawn',
    description: 'Join us for the biggest music festival of the summer! Featuring top artists from around the world, food trucks, and an unforgettable experience under the stars. This premium event combines world-class performances with stunning visuals and an atmosphere you\'ll never forget.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    category: 'Music',
    organizer: 'Summer Events Co.',
    capacity: 5000,
    ticketsSold: 4550,
    rating: 4.8,
    reviews: 1243,
    ticketTypes: [
      { id: 'general', name: 'General Admission', price: 89, available: 350, perks: ['Entry to all stages', 'Access to food courts'] },
      { id: 'vip', name: 'VIP Experience', price: 199, available: 45, perks: ['Priority entry', 'VIP lounge access', 'Complimentary drinks', 'Meet & greet opportunity'] },
      { id: 'premium', name: 'Premium Package', price: 299, available: 12, perks: ['All VIP perks', 'Backstage tour', 'Premium seating', 'Exclusive merchandise', 'Personal concierge'] }
    ],
    features: [
      'Live performances by 15+ world-renowned artists',
      'Gourmet food trucks and premium beverage stations',
      'Interactive art installations and photo opportunities',
      'Free high-speed WiFi throughout the venue',
      'Professional sound and lighting systems',
      'Emergency medical services on-site'
    ]
  };

  const selectedTicket = event.ticketTypes.find(t => t.id === selectedTicketType);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const maxQuantity = selectedTicket ? Math.min(selectedTicket.available, 6) : 1;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 1;
    handleQuantityChange(value);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-effect border-b border-border/20 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToEvents} 
            className="glass-button border-border/30 hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="aspect-video rounded-2xl overflow-hidden relative group">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating badges */}
              <div className="absolute top-6 left-6 flex gap-3">
                <Badge className="glass-button border-border/30">
                  {event.category}
                </Badge>
                <Badge className="bg-gradient-primary text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
            </div>

            {/* Event Info */}
            <Card className="enhanced-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-chart-5 fill-current" />
                        <span className="text-sm font-medium text-foreground">{event.rating}</span>
                        <span className="text-sm text-foreground-muted">({event.reviews} reviews)</span>
                      </div>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl text-foreground">
                      {event.title}
                    </CardTitle>
                    <p className="text-foreground-muted text-lg">Organized by {event.organizer}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="glass-effect border-border/30 hover:border-primary/50">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="glass-effect border-border/30 hover:border-red-400/50 hover:text-red-400">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-effect rounded-xl p-6 border border-border/20">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">
                          {new Date(event.date).toLocaleDateString('cs-CZ', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-foreground-muted">
                          {event.time} - {event.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 border border-border/20">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">{event.venue}</p>
                        <p className="text-foreground-muted">{event.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="glass-effect rounded-xl p-6 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-foreground">
                          {event.ticketsSold.toLocaleString()} attending
                        </p>
                        <p className="text-foreground-muted">
                          {(event.capacity - event.ticketsSold).toLocaleString()} tickets remaining
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                          style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground-muted mt-1">
                        {Math.round((event.ticketsSold / event.capacity) * 100)}% sold
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/30" />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-medium mb-4 text-foreground">About this event</h3>
                  <p className="text-foreground-muted leading-relaxed text-lg">{event.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-medium mb-6 text-foreground">What's included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-foreground-muted">
                        <div className="h-2 w-2 bg-gradient-primary rounded-full mr-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Purchase */}
          <div className="lg:col-span-1">
            <Card 
              ref={selectTicketsRef}
              className={`sticky top-24 enhanced-card transition-all duration-500 ${
                highlightSelectTickets ? 'select-tickets-highlight' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <Ticket className="h-5 w-5 text-white" />
                  </div>
                  Select Tickets
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Ticket Type Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-foreground">Ticket Type</label>
                  <div className="space-y-3">
                    {event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                          selectedTicketType === ticket.id
                            ? 'glass-button border-primary/50 neon-glow'
                            : 'glass-effect border-border/30 hover:border-border/50'
                        }`}
                        onClick={() => {
                          setSelectedTicketType(ticket.id);
                          setQuantity(1); // Reset quantity when changing ticket type
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground">{ticket.name}</h4>
                          <span className="text-lg font-bold text-chart-4">${ticket.price}</span>
                        </div>
                        <p className="text-xs text-foreground-muted mb-2">
                          {ticket.available} tickets available
                        </p>
                        <ul className="text-xs text-foreground-muted space-y-1">
                          {ticket.perks.map((perk, index) => (
                            <li key={index} className="flex items-center">
                              <div className="h-1 w-1 bg-primary rounded-full mr-2" />
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                {selectedTicketType && (
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">Quantity</label>
                    <div className="quantity-selector">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="glass-effect border-border/30 hover:border-primary/50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        value={quantity}
                        onChange={handleQuantityInputChange}
                        className="quantity-input glass-effect border-border/30 focus:border-primary/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= maxQuantity}
                        className="glass-effect border-border/30 hover:border-primary/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">
                      Maximum {maxQuantity} tickets per order
                    </p>
                  </div>
                )}

                {/* Price Summary */}
                {selectedTicketType && (
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground-muted">{selectedTicket?.name} × {quantity}</span>
                      <span className="text-foreground">${selectedTicket ? selectedTicket.price * quantity : 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground-muted">Service fee</span>
                      <span className="text-foreground">${Math.round(totalPrice * 0.1)}</span>
                    </div>
                    <Separator className="bg-border/30" />
                    <div className="flex justify-between font-medium text-lg">
                      <span className="text-foreground">Total</span>
                      <span className="text-chart-4">${totalPrice + Math.round(totalPrice * 0.1)}</span>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <Button 
                  className={`w-full py-4 text-lg transition-all duration-300 ${
                    selectedTicketType 
                      ? 'bg-gradient-primary hover:scale-105 neon-glow' 
                      : 'glass-effect border-border/30'
                  }`}
                  disabled={!selectedTicketType}
                >
                  {selectedTicketType ? (
                    <>
                      <Ticket className="h-5 w-5 mr-2" />
                      Buy Tickets - ${totalPrice + Math.round(totalPrice * 0.1)}
                    </>
                  ) : (
                    'Select Ticket Type'
                  )}
                </Button>

                <p className="text-xs text-center text-foreground-muted">
                  🔒 Secure checkout • 📱 Free mobile tickets • ↩️ Easy refunds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}