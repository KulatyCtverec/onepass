import { useState } from 'react';
import { Upload, Plus, Trash2, Calendar, MapPin, Clock, Users, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

export function CreateEvent() {
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: 'General Admission', price: '', quantity: '' }
  ]);

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map(t => t.id)) + 1;
    setTicketTypes([...ticketTypes, { id: newId, name: '', price: '', quantity: '' }]);
  };

  const removeTicketType = (id: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter(t => t.id !== id));
    }
  };

  const updateTicketType = (id: number, field: string, value: string) => {
    setTicketTypes(ticketTypes.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const categories = [
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'theater', label: 'Theater', icon: '🎭' },
    { value: 'comedy', label: 'Comedy', icon: '😂' },
    { value: 'food', label: 'Food & Drink', icon: '🍷' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 glass-button border-blue-400/30 text-blue-400">
            <Zap className="h-3 w-3 mr-1" />
            Event Creator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Fill in the details to create your amazing event and start selling tickets
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-foreground">Event Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter event title"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-foreground">Category</Label>
                    <Select>
                      <SelectTrigger className="glass-effect border-border/30 focus:border-blue-400/50 mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border-border/30">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              <span className="mr-2">{category.icon}</span>
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Event Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your event in detail..."
                    className="min-h-[120px] glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                  />
                </div>

                <div>
                  <Label className="text-foreground">Event Image</Label>
                  <div className="mt-3">
                    <div className="glass-effect border-2 border-dashed border-border/30 rounded-xl p-12 text-center hover:border-blue-400/50 transition-colors cursor-pointer group">
                      <div className="p-4 rounded-full bg-gradient-primary mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-foreground mb-2">Click to upload event image</p>
                      <p className="text-xs text-foreground-muted">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Location */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Date & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-foreground">Event Date</Label>
                    <Input 
                      id="date" 
                      type="date"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-foreground">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-foreground">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="venue" className="text-foreground">Venue Name</Label>
                    <Input 
                      id="venue" 
                      placeholder="Enter venue name"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="text-foreground">Venue Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      placeholder="Maximum attendees"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground">Full Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Street address, city, state, zip code"
                    className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-xl">
                    <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Ticket Types & Pricing
                  </div>
                  <Button 
                    type="button" 
                    onClick={addTicketType}
                    className="glass-button hover:bg-blue-500/20 hover:border-blue-400/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div key={ticket.id} className="glass-effect border border-border/30 rounded-xl p-6 space-y-4 hover:border-blue-400/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Ticket Type {index + 1}</h4>
                      {ticketTypes.length > 1 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeTicketType(ticket.id)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`ticket-name-${ticket.id}`} className="text-foreground">Ticket Name</Label>
                        <Input 
                          id={`ticket-name-${ticket.id}`}
                          value={ticket.name}
                          onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                          placeholder="e.g., General Admission"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticket-price-${ticket.id}`} className="text-foreground">Price ($)</Label>
                        <Input 
                          id={`ticket-price-${ticket.id}`}
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(ticket.id, 'price', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticket-quantity-${ticket.id}`} className="text-foreground">Available Quantity</Label>
                        <Input 
                          id={`ticket-quantity-${ticket.id}`}
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketType(ticket.id, 'quantity', e.target.value)}
                          placeholder="Number available"
                          className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  Additional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sales-start" className="text-foreground">Ticket Sales Start</Label>
                    <Input 
                      id="sales-start" 
                      type="datetime-local"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sales-end" className="text-foreground">Ticket Sales End</Label>
                    <Input 
                      id="sales-end" 
                      type="datetime-local"
                      className="glass-effect border-border/30 focus:border-blue-400/50 mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground">Event Options</Label>
                  <div className="space-y-3">
                    {[
                      { id: 'resale', label: 'Allow ticket resale', checked: false },
                      { id: 'approval', label: 'Require approval for attendees', checked: false },
                      { id: 'emails', label: 'Send confirmation emails', checked: true }
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
              </CardContent>
            </Card>

            <Separator className="bg-border/30" />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                type="button" 
                variant="outline"
                className="glass-effect border-border/30 hover:border-blue-400/50 px-8 py-3 text-lg"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-primary hover:scale-105 transition-all duration-300 neon-glow px-8 py-3 text-lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Publish Event
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}