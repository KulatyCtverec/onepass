import { useState } from 'react';
import { Upload, Plus, Trash2, Calendar, MapPin, Clock, Users, Star, Zap, CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function CreateEvent() {
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: 'General Admission', price: '', quantity: '', currency: 'USD' }
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeStart, setShowTimeStart] = useState(false);
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const [showSalesStartCalendar, setShowSalesStartCalendar] = useState(false);
  const [showSalesEndCalendar, setShowSalesEndCalendar] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map(t => t.id)) + 1;
    setTicketTypes([...ticketTypes, { id: newId, name: '', price: '', quantity: '', currency: 'USD' }]);
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

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point, max 2 decimal places
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    e.target.value = value;
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow whole numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format: DD/MM/YYYY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    e.target.value = value;
    
    // Validate day and month
    const parts = value.split('/');
    if (parts[0] && parseInt(parts[0]) > 31) {
      e.target.value = value.replace(parts[0], '31');
    }
    if (parts[1] && parseInt(parts[1]) > 12) {
      e.target.value = value.replace('/' + parts[1] + '/', '/12/');
    }
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format: HH:MM (24 hour)
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + ':' + value.substring(2, 4);
    }
    e.target.value = value;
    
    // Validate hours and minutes
    const parts = value.split(':');
    if (parts[0] && parseInt(parts[0]) > 23) {
      e.target.value = value.replace(parts[0], '23');
    }
    if (parts[1] && parseInt(parts[1]) > 59) {
      e.target.value = value.replace(':' + parts[1], ':59');
    }
  };

  const handleDateTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format: DD/MM/YYYY HH:MM
    let value = e.target.value.replace(/[^0-9]/g, '');
    let formatted = '';
    
    // Date part
    if (value.length >= 2) {
      formatted = value.substring(0, 2);
      if (value.length >= 4) {
        formatted += '/' + value.substring(2, 4);
        if (value.length >= 8) {
          formatted += '/' + value.substring(4, 8);
          if (value.length >= 10) {
            formatted += ' ' + value.substring(8, 10);
            if (value.length >= 12) {
              formatted += ':' + value.substring(10, 12);
            }
          }
        }
      }
    } else {
      formatted = value;
    }
    
    e.target.value = formatted;
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

  const TimePickerContent = ({ onTimeSelect }: { onTimeSelect: (time: string) => void }) => (
    <div className="p-4 space-y-4 glass-effect border border-border/30 rounded-xl">
      <h4 className="font-medium text-foreground">Select Time</h4>
      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
        {Array.from({ length: 24 }, (_, hour) => (
          <Button
            key={hour}
            variant="outline"
            size="sm"
            onClick={() => onTimeSelect(`${hour.toString().padStart(2, '0')}:00`)}
            className="glass-effect border-border/30 hover:border-primary/50 text-xs"
          >
            {hour.toString().padStart(2, '0')}:00
          </Button>
        ))}
      </div>
    </div>
  );

  const CalendarContent = ({ onDateSelect }: { onDateSelect: (date: string) => void }) => (
    <div className="p-4 space-y-4 glass-effect border border-border/30 rounded-xl">
      <h4 className="font-medium text-foreground">Select Date</h4>
      <div className="text-center text-foreground-muted">
        {/* Simple calendar placeholder - in real app would use proper calendar */}
        <p className="mb-4">Calendar component would be here</p>
        <Button
          onClick={() => {
            const today = new Date();
            const formatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            onDateSelect(formatted);
          }}
          className="glass-button"
        >
          Select Today
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 glass-button border-primary/30 text-primary">
            <Zap className="h-3 w-3 mr-1" />
            Event Creator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Create New Event
          </h1>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Fill in the details to create your amazing event and start selling tickets
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="enhanced-card">
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
                      className="glass-effect border-border/30 focus:border-primary/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-foreground">Category</Label>
                    <Select>
                      <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50 mt-2">
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
                    className="min-h-[120px] glass-effect border-border/30 focus:border-primary/50 mt-2"
                  />
                </div>

                <div>
                  <Label className="text-foreground">Event Image</Label>
                  <div className="mt-3">
                    <div className="glass-effect border-2 border-dashed border-border/30 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group">
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
            <Card className="enhanced-card">
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
                    <div className="date-input-container mt-2">
                      <Input 
                        id="date-input"
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                        onChange={handleDateInput}
                        className="glass-effect border-border/30 focus:border-primary/50 pr-12"
                      />
                      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                          <CalendarIcon className="calendar-icon h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarContent onDateSelect={(date) => {
                            (document.getElementById('date-input') as HTMLInputElement).value = date;
                            setShowCalendar(false);
                          }} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-foreground">Start Time</Label>
                    <div className="time-input-container mt-2">
                      <Input 
                        id="startTime" 
                        placeholder="HH:MM"
                        maxLength={5}
                        onChange={handleTimeInput}
                        className="glass-effect border-border/30 focus:border-primary/50 pl-12"
                      />
                      <Popover open={showTimeStart} onOpenChange={setShowTimeStart}>
                        <PopoverTrigger asChild>
                          <Clock className="clock-icon h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <TimePickerContent onTimeSelect={(time) => {
                            (document.getElementById('startTime') as HTMLInputElement).value = time;
                            setShowTimeStart(false);
                          }} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-foreground">End Time</Label>
                    <div className="time-input-container mt-2">
                      <Input 
                        id="endTime" 
                        placeholder="HH:MM"
                        maxLength={5}
                        onChange={handleTimeInput}
                        className="glass-effect border-border/30 focus:border-primary/50 pl-12"
                      />
                      <Popover open={showTimeEnd} onOpenChange={setShowTimeEnd}>
                        <PopoverTrigger asChild>
                          <Clock className="clock-icon h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <TimePickerContent onTimeSelect={(time) => {
                            (document.getElementById('endTime') as HTMLInputElement).value = time;
                            setShowTimeEnd(false);
                          }} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="venue" className="text-foreground">Venue Name</Label>
                    <Input 
                      id="venue" 
                      placeholder="Enter venue name"
                      className="glass-effect border-border/30 focus:border-primary/50 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="text-foreground">Venue Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="text"
                      placeholder="Maximum attendees"
                      onChange={handleQuantityInput}
                      className="glass-effect border-border/30 focus:border-primary/50 mt-2 quantity-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground">Full Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Street address, city, state, zip code"
                    className="glass-effect border-border/30 focus:border-primary/50 mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card className="enhanced-card">
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
                    className="glass-button hover:bg-primary/20 hover:border-primary/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div key={ticket.id} className="glass-effect border border-border/30 rounded-xl p-6 space-y-4 hover:border-primary/30 transition-colors">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`ticket-name-${ticket.id}`} className="text-foreground">Ticket Name</Label>
                        <Input 
                          id={`ticket-name-${ticket.id}`}
                          value={ticket.name}
                          onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                          placeholder="e.g., General Admission"
                          className="glass-effect border-border/30 focus:border-primary/50 mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticket-price-${ticket.id}`} className="text-foreground">Price</Label>
                        <div className="flex gap-2 mt-2">
                          <Input 
                            id={`ticket-price-${ticket.id}`}
                            type="text"
                            value={ticket.price}
                            onChange={(e) => {
                              handlePriceInput(e);
                              updateTicketType(ticket.id, 'price', e.target.value);
                            }}
                            placeholder="0.00"
                            className="glass-effect border-border/30 focus:border-primary/50 price-input flex-1"
                          />
                          <Select 
                            value={ticket.currency} 
                            onValueChange={(value) => updateTicketType(ticket.id, 'currency', value)}
                          >
                            <SelectTrigger className="glass-effect border-border/30 focus:border-primary/50 w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-effect border-border/30">
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`ticket-quantity-${ticket.id}`} className="text-foreground">Available Quantity</Label>
                        <Input 
                          id={`ticket-quantity-${ticket.id}`}
                          type="text"
                          value={ticket.quantity}
                          onChange={(e) => {
                            handleQuantityInput(e);
                            updateTicketType(ticket.id, 'quantity', e.target.value);
                          }}
                          placeholder="Number available"
                          className="glass-effect border-border/30 focus:border-primary/50 mt-2 quantity-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="enhanced-card">
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
                    <div className="date-input-container mt-2">
                      <Input 
                        id="sales-start" 
                        placeholder="DD/MM/YYYY HH:MM"
                        maxLength={16}
                        onChange={handleDateTimeInput}
                        className="glass-effect border-border/30 focus:border-primary/50 pr-12"
                      />
                      <Popover open={showSalesStartCalendar} onOpenChange={setShowSalesStartCalendar}>
                        <PopoverTrigger asChild>
                          <CalendarIcon className="calendar-icon h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <div className="p-4 space-y-4 glass-effect border border-border/30 rounded-xl">
                            <h4 className="font-medium text-foreground">Select Date & Time</h4>
                            <div className="text-center text-foreground-muted">
                              <p className="mb-4">Date & Time picker would be here</p>
                              <Button
                                onClick={() => {
                                  const now = new Date();
                                  const formatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                                  (document.getElementById('sales-start') as HTMLInputElement).value = formatted;
                                  setShowSalesStartCalendar(false);
                                }}
                                className="glass-button"
                              >
                                Select Now
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sales-end" className="text-foreground">Ticket Sales End</Label>
                    <div className="date-input-container mt-2">
                      <Input 
                        id="sales-end" 
                        placeholder="DD/MM/YYYY HH:MM"
                        maxLength={16}
                        onChange={handleDateTimeInput}
                        className="glass-effect border-border/30 focus:border-primary/50 pr-12"
                      />
                      <Popover open={showSalesEndCalendar} onOpenChange={setShowSalesEndCalendar}>
                        <PopoverTrigger asChild>
                          <CalendarIcon className="calendar-icon h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <div className="p-4 space-y-4 glass-effect border border-border/30 rounded-xl">
                            <h4 className="font-medium text-foreground">Select Date & Time</h4>
                            <div className="text-center text-foreground-muted">
                              <p className="mb-4">Date & Time picker would be here</p>
                              <Button
                                onClick={() => {
                                  const future = new Date();
                                  future.setDate(future.getDate() + 7);
                                  const formatted = `${future.getDate().toString().padStart(2, '0')}/${(future.getMonth() + 1).toString().padStart(2, '0')}/${future.getFullYear()} ${future.getHours().toString().padStart(2, '0')}:${future.getMinutes().toString().padStart(2, '0')}`;
                                  (document.getElementById('sales-end') as HTMLInputElement).value = formatted;
                                  setShowSalesEndCalendar(false);
                                }}
                                className="glass-button"
                              >
                                Select +7 Days
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
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
                          className="w-4 h-4 rounded border-border/30 bg-transparent focus:ring-primary/25"
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
                className="glass-effect border-border/30 hover:border-primary/50 px-8 py-3 text-lg"
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