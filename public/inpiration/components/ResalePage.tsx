import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Clock, Users, Star, TrendingUp, DollarSign, Shield, Ticket, Plus, ChartBar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TicketPurchase } from './TicketPurchase';

interface ResalePageProps {
  onViewChange: (view: string, eventId?: string) => void;
}

export function ResalePage({ onViewChange }: ResalePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [resalePrice, setResalePrice] = useState('');

  const userStats = {
    totalTicketsOwned: 12,
    ticketsSold: 8,
    totalEarned: 1250,
    averageRating: 4.9
  };

  const userOwnedEvents = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: '2024-08-20',
      location: 'San Francisco',
      ticketsOwned: 2,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Summer Music Festival 2024',
      date: '2024-07-15',
      location: 'Central Park, New York',
      ticketsOwned: 1,
      originalPrice: 189,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop'
    }
  ];

  const resaleListings = [
    {
      id: '1',
      eventTitle: 'Summer Music Festival 2024',
      originalPrice: 199,
      resalePrice: 180,
      savings: 19,
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park, New York',
      venue: 'Great Lawn',
      category: 'Music',
      ticketType: 'VIP Experience',
      quantity: 2,
      seller: {
        name: 'Sarah M.',
        rating: 4.9,
        sales: 23,
        verified: true
      },
      listedDate: '2024-06-20',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop',
      features: ['VIP lounge access', 'Priority entry', 'Complimentary drinks'],
      trending: true
    },
    {
      id: '2',
      eventTitle: 'Broadway Musical: Hamilton',
      originalPrice: 150,
      resalePrice: 175,
      savings: -25,
      date: '2024-07-25',
      time: '20:00',
      location: 'Broadway Theater, New York',
      venue: 'Richard Rodgers Theatre',
      category: 'Theater',
      ticketType: 'Orchestra',
      quantity: 2,
      seller: {
        name: 'Mike R.',
        rating: 4.7,
        sales: 12,
        verified: true
      },
      listedDate: '2024-06-18',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      features: ['Premium seating', 'Excellent view'],
      trending: false
    },
    {
      id: '3',
      eventTitle: 'Tech Conference 2024',
      originalPrice: 299,
      resalePrice: 250,
      savings: 49,
      date: '2024-08-20',
      time: '09:00',
      location: 'Convention Center, San Francisco',
      venue: 'Moscone Center',
      category: 'Technology',
      ticketType: 'General Admission',
      quantity: 1,
      seller: {
        name: 'Alex K.',
        rating: 5.0,
        sales: 8,
        verified: true
      },
      listedDate: '2024-06-22',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      features: ['All sessions access', 'Networking events', 'Conference materials'],
      trending: true
    },
    {
      id: '4',
      eventTitle: 'Basketball Championship',
      originalPrice: 120,
      resalePrice: 140,
      savings: -20,
      date: '2024-08-05',
      time: '19:30',
      location: 'Madison Square Garden, New York',
      venue: 'MSG',
      category: 'Sports',
      ticketType: 'Lower Bowl',
      quantity: 2,
      seller: {
        name: 'David L.',
        rating: 4.6,
        sales: 7,
        verified: false
      },
      listedDate: '2024-06-21',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
      features: ['Great seats', 'Close to court'],
      trending: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'theater', label: 'Theater' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'technology', label: 'Technology' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: 'over200', label: 'Over $200' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'savings', label: 'Best Savings' },
    { value: 'trending', label: 'Trending' }
  ];

  const filteredListings = resaleListings.filter(listing => {
    const matchesSearch = listing.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedListing) {
    return (
      <TicketPurchase 
        listing={selectedListing} 
        onBack={() => setSelectedListing(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-chart-4/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 glass-button border-chart-4/30 text-chart-4 hover:border-chart-4/50">
              <Shield className="h-3 w-3 mr-1" />
              Secure Marketplace
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-chart-4/80 to-primary/80 bg-clip-text text-transparent leading-tight">
              Buy & Sell Tickets
              <br />
              <span className="bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent neon-text">
                Safely & Easily
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Find great deals from trusted sellers or list your own tickets. All transactions protected by OnePass guarantee.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="glass-effect border-border/30 grid w-full grid-cols-2 mb-8 max-w-md mx-auto h-14">
            <TabsTrigger value="buy" className="tab-enhanced text-base">
              <Search className="h-5 w-5 mr-2" />
              Buy Tickets
            </TabsTrigger>
            <TabsTrigger value="sell" className="tab-enhanced text-base">
              <DollarSign className="h-5 w-5 mr-2" />
              Sell Tickets
            </TabsTrigger>
          </TabsList>

          {/* Buy Tickets Tab */}
          <TabsContent value="buy" className="space-y-8">
            {/* Filters */}
            <Card className="enhanced-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      placeholder="Search events or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-effect border-border/30 focus:border-primary/50"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-border/30">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Range */}
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-border/30">
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-border/30">
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-foreground-muted">
                  {filteredListings.length} tickets available • All sales protected by OnePass guarantee
                </p>
              </CardContent>
            </Card>

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="group cursor-pointer transition-all duration-300 hover:scale-105 enhanced-card overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={listing.image}
                      alt={listing.eventTitle}
                      className="w-full h-full object-cover event-image-expand"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <Badge className="glass-button border-border/30 text-xs">
                        {listing.category}
                      </Badge>
                    </div>

                    <div className="absolute top-3 right-3">
                      {listing.trending ? (
                        <Badge className="bg-gradient-primary text-white text-xs border-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      ) : listing.savings > 0 ? (
                        <Badge className="bg-chart-4/90 text-white text-xs">
                          Save ${listing.savings}
                        </Badge>
                      ) : null}
                    </div>

                    {/* Seller verification */}
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 glass-effect px-2 py-1 rounded-full">
                        {listing.seller.verified && (
                          <Shield className="h-3 w-3 text-chart-4" />
                        )}
                        <Star className="h-3 w-3 text-chart-5 fill-current" />
                        <span className="text-xs text-white">{listing.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {listing.eventTitle}
                    </CardTitle>
                    <p className="text-sm text-foreground-muted">{listing.venue}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-foreground-muted">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {new Date(listing.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })} at {listing.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {listing.quantity} ticket{listing.quantity > 1 ? 's' : ''} • {listing.ticketType}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      {listing.features.slice(0, 2).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-xs text-foreground-muted">
                          <div className="h-1 w-1 bg-chart-4 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Seller Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground-muted">Sold by</span>
                        <span className="text-foreground">{listing.seller.name}</span>
                        {listing.seller.verified && (
                          <Shield className="h-3 w-3 text-chart-4" />
                        )}
                      </div>
                      <span className="text-foreground-muted">{listing.seller.sales} sales</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-chart-4">${listing.resalePrice}</span>
                          <span className="text-sm text-foreground-muted line-through">${listing.originalPrice}</span>
                        </div>
                        <p className="text-xs text-foreground-muted">per ticket</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedListing(listing)}
                        className="buy-now-button"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sell Tickets Tab */}
          <TabsContent value="sell" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="enhanced-card">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-lg bg-gradient-primary w-fit mx-auto mb-3">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-chart-4">{userStats.totalTicketsOwned}</p>
                  <p className="text-sm text-foreground-muted">Tickets Owned</p>
                </CardContent>
              </Card>
              
              <Card className="enhanced-card">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-chart-2 to-chart-3 w-fit mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-chart-4">{userStats.ticketsSold}</p>
                  <p className="text-sm text-foreground-muted">Tickets Sold</p>
                </CardContent>
              </Card>
              
              <Card className="enhanced-card">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-chart-4 to-chart-5 w-fit mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-chart-4">${userStats.totalEarned}</p>
                  <p className="text-sm text-foreground-muted">Total Earned</p>
                </CardContent>
              </Card>
              
              <Card className="enhanced-card">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-chart-3 to-primary w-fit mx-auto mb-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-chart-4">{userStats.averageRating}</p>
                  <p className="text-sm text-foreground-muted">Avg Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* My Events to Sell */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">My Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userOwnedEvents.map((event) => (
                  <Card key={event.id} className="enhanced-card overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-4 left-4">
                        <Badge className="glass-button border-border/30 text-xs">
                          {event.ticketsOwned} ticket{event.ticketsOwned > 1 ? 's' : ''} owned
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{event.title}</h3>
                        <p className="text-sm text-foreground-muted">{event.location}</p>
                        <p className="text-sm text-foreground-muted">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-chart-4">
                          ${event.originalPrice} each
                        </span>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="buy-now-button">
                              <Plus className="h-4 w-4 mr-1" />
                              List for Sale
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-effect border-border/30">
                            <DialogHeader>
                              <DialogTitle>List Tickets for Sale</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <Label htmlFor="quantity" className="text-foreground">
                                  Quantity (max {event.ticketsOwned})
                                </Label>
                                <Select>
                                  <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50 mt-2">
                                    <SelectValue placeholder="Select quantity" />
                                  </SelectTrigger>
                                  <SelectContent className="glass-effect border-border/30">
                                    {Array.from({ length: event.ticketsOwned }, (_, i) => i + 1).map((num) => (
                                      <SelectItem key={num} value={num.toString()}>
                                        {num} ticket{num > 1 ? 's' : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-foreground">Original Price (cannot be changed)</Label>
                                <Input
                                  type="text"
                                  value={`$${event.originalPrice}`}
                                  disabled
                                  className="glass-effect border-border/30 mt-2 opacity-60"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="price" className="text-foreground">Your Selling Price</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  placeholder={`${event.originalPrice}`}
                                  value={resalePrice}
                                  onChange={(e) => setResalePrice(e.target.value)}
                                  className="glass-effect border-border/30 focus:border-primary/50 mt-2"
                                />
                              </div>
                              
                              <Button className="w-full buy-now-button">
                                <Ticket className="h-4 w-4 mr-2" />
                                List Ticket for Sale
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Trust & Safety */}
        <Card className="enhanced-card mt-12">
          <CardHeader>
            <CardTitle className="flex items-center text-center justify-center">
              <Shield className="h-5 w-5 mr-2 text-chart-4" />
              Safe & Secure Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="p-3 rounded-full bg-gradient-primary w-fit mx-auto">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-foreground">Buyer Protection</h3>
                <p className="text-sm text-foreground-muted">
                  100% guaranteed authentic tickets or your money back
                </p>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-full bg-gradient-to-r from-chart-2 to-chart-3 w-fit mx-auto">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-foreground">Verified Sellers</h3>
                <p className="text-sm text-foreground-muted">
                  All sellers are verified and rated by the community
                </p>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-full bg-gradient-to-r from-chart-4 to-chart-5 w-fit mx-auto">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-foreground">Secure Payments</h3>
                <p className="text-sm text-foreground-muted">
                  Safe and encrypted payment processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}