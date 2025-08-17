import { useState } from 'react';
import { Calendar, MapPin, QrCode, DollarSign, Ticket, Clock, MoreHorizontal, TrendingUp, Star, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function UserDashboard() {
  const [resalePrice, setResalePrice] = useState('');
  const [resaleNotes, setResaleNotes] = useState('');

  const userTickets = [
    {
      id: '1',
      eventTitle: 'Summer Music Festival 2024',
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park, New York',
      ticketType: 'VIP Experience',
      quantity: 2,
      originalPrice: 199,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop',
      qrCode: 'QR123456789'
    },
    {
      id: '2',
      eventTitle: 'Tech Conference 2024',
      date: '2024-08-20',
      time: '09:00',
      location: 'Convention Center, San Francisco',
      ticketType: 'General Admission',
      quantity: 1,
      originalPrice: 299,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
      qrCode: 'QR987654321'
    }
  ];

  const resaleListings = [
    {
      id: '1',
      eventTitle: 'Broadway Musical: Hamilton',
      date: '2024-07-25',
      ticketType: 'Orchestra',
      quantity: 2,
      originalPrice: 150,
      listingPrice: 180,
      status: 'listed',
      views: 24,
      interested: 8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    }
  ];

  const purchaseHistory = [
    {
      id: '1',
      eventTitle: 'Food & Wine Festival',
      date: '2024-09-10',
      purchaseDate: '2024-06-15',
      ticketType: 'General Admission',
      quantity: 4,
      totalPaid: 300,
      status: 'completed'
    },
    {
      id: '2',
      eventTitle: 'Comedy Night Live',
      date: '2024-06-20',
      purchaseDate: '2024-05-10',
      ticketType: 'Premium Seating',
      quantity: 2,
      totalPaid: 120,
      status: 'attended'
    }
  ];

  const stats = [
    { label: 'Events Attended', value: '12', icon: Ticket, color: 'text-blue-400' },
    { label: 'Tickets Owned', value: '3', icon: QrCode, color: 'text-green-400' },
    { label: 'Listings Active', value: '1', icon: DollarSign, color: 'text-purple-400' },
    { label: 'Total Earned', value: '$540', icon: TrendingUp, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-foreground-muted text-lg">Manage your tickets and events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-gradient-card border-border/20 hover:border-blue-400/30 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-foreground-muted">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="glass-effect border-border/30 grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tickets" className="data-[state=active]:glass-button">My Tickets</TabsTrigger>
            <TabsTrigger value="resale" className="data-[state=active]:glass-button">Resale Listings</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:glass-button">Purchase History</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:glass-button">Settings</TabsTrigger>
          </TabsList>

          {/* My Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="grid gap-6">
              {userTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-gradient-card border-border/20 hover:border-blue-400/30 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={ticket.image}
                          alt={ticket.eventTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-foreground">{ticket.eventTitle}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="glass-effect border-border/30 hover:border-blue-400/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-effect border-border/30">
                              <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer">
                                <QrCode className="mr-2 h-4 w-4" />
                                View QR Code
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-white/10 transition-colors cursor-pointer">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    List for Resale
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="glass-effect border-border/30">
                                  <DialogHeader>
                                    <DialogTitle>List Tickets for Resale</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-6">
                                    <div>
                                      <Label htmlFor="price" className="text-foreground">Resale Price (per ticket)</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        placeholder="Enter price"
                                        value={resalePrice}
                                        onChange={(e) => setResalePrice(e.target.value)}
                                        className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                                      />
                                      <p className="text-xs text-foreground-muted mt-2">
                                        Original price: ${ticket.originalPrice}
                                      </p>
                                    </div>
                                    <div>
                                      <Label htmlFor="notes" className="text-foreground">Additional Notes (Optional)</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Any additional information for buyers..."
                                        value={resaleNotes}
                                        onChange={(e) => setResaleNotes(e.target.value)}
                                        className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                                      />
                                    </div>
                                    <Button className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300">
                                      List for Resale
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                            {new Date(ticket.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-400" />
                            {ticket.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                            {ticket.location}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <div className="flex items-center gap-4">
                            <Badge className="glass-button border-border/30">{ticket.ticketType}</Badge>
                            <span className="text-sm text-foreground-muted">Qty: {ticket.quantity}</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                          </div>
                          <Button size="sm" className="glass-button hover:bg-blue-500/20 hover:border-blue-400/50">
                            <QrCode className="h-4 w-4 mr-2" />
                            Show Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resale Listings */}
          <TabsContent value="resale" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Your Resale Listings</h2>
              <Button className="glass-button hover:bg-blue-500/20 hover:border-blue-400/50">
                <DollarSign className="h-4 w-4 mr-2" />
                List New Tickets
              </Button>
            </div>
            
            <div className="grid gap-6">
              {resaleListings.map((listing) => (
                <Card key={listing.id} className="bg-gradient-card border-border/20 hover:border-blue-400/30 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={listing.image}
                          alt={listing.eventTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-foreground">{listing.eventTitle}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="glass-effect border-border/30 hover:border-blue-400/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-effect border-border/30">
                              <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer">
                                Edit Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                                Remove Listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-foreground-muted">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                            {new Date(listing.date).toLocaleDateString()}
                          </div>
                          <span>{listing.quantity} tickets</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <div className="flex items-center gap-4">
                            <Badge className="glass-button border-border/30">{listing.ticketType}</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Listed</Badge>
                            <div className="flex items-center text-sm text-foreground-muted">
                              <Eye className="h-4 w-4 mr-1" />
                              {listing.views} views
                            </div>
                            <div className="flex items-center text-sm text-foreground-muted">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              {listing.interested} interested
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg text-green-400">${listing.listingPrice} each</p>
                            <p className="text-xs text-foreground-muted">
                              Original: ${listing.originalPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Purchase History */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Purchase History</h2>
            
            <div className="grid gap-4">
              {purchaseHistory.map((purchase) => (
                <Card key={purchase.id} className="bg-gradient-card border-border/20 hover:border-blue-400/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">{purchase.eventTitle}</h3>
                        <div className="flex items-center gap-6 text-sm text-foreground-muted">
                          <span>Event: {new Date(purchase.date).toLocaleDateString()}</span>
                          <span>Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                          <span>{purchase.quantity} tickets</span>
                        </div>
                        <Badge className={
                          purchase.status === 'attended' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'glass-button border-border/30'
                        }>
                          {purchase.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-blue-400">${purchase.totalPaid}</p>
                        <p className="text-sm text-foreground-muted">{purchase.ticketType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="text-foreground">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(555) 123-4567"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-foreground">Email Notifications</Label>
                  <div className="space-y-3 mt-4">
                    {[
                      { id: 'reminders', label: 'Event reminders', checked: true },
                      { id: 'resale', label: 'Resale updates', checked: true },
                      { id: 'marketing', label: 'Marketing emails', checked: false }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          defaultChecked={option.checked}
                          className="w-4 h-4 rounded border-border/30 bg-transparent focus:ring-blue-400/25"
                        />
                        <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}