import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Star, Shield, Ticket, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TicketPurchaseProps {
  listing: any;
  onBack: () => void;
}

export function TicketPurchase({ listing, onBack }: TicketPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = listing.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 1;
    handleQuantityChange(value);
  };

  const handleBackToMarketplace = () => {
    onBack();
    // Scroll to marketplace events section after a brief delay
    setTimeout(() => {
      const eventsSection = document.querySelector('[data-marketplace-events]');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const totalPrice = listing.resalePrice * quantity;
  const serviceFee = Math.round(totalPrice * 0.08);
  const finalTotal = totalPrice + serviceFee;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-effect border-b border-border/20 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToMarketplace} 
            className="glass-button border-border/30 hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <div className="space-y-6">
              <Card className="enhanced-card">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.eventTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="glass-button border-border/30 text-xs">
                      {listing.category}
                    </Badge>
                  </div>

                  {listing.savings > 0 && (
                    <Badge className="absolute top-4 right-4 bg-chart-4/90 text-white text-xs">
                      Save ${listing.savings}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{listing.eventTitle}</h1>
                    <p className="text-foreground-muted">{listing.venue}</p>
                  </div>

                  <div className="space-y-3 text-sm text-foreground-muted">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-3 text-primary" />
                      {new Date(listing.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })} at {listing.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-primary" />
                      {listing.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-3 text-primary" />
                      {listing.ticketType}
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  <div>
                    <h3 className="font-medium text-foreground mb-3">What's included</h3>
                    <div className="space-y-2">
                      {listing.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-foreground-muted">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card className="enhanced-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Sold by {listing.seller.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-chart-5 fill-current mr-1" />
                          {listing.seller.rating}
                        </div>
                        <span>•</span>
                        <span>{listing.seller.sales} sales</span>
                        {listing.seller.verified && (
                          <>
                            <span>•</span>
                            <div className="flex items-center text-primary">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Card */}
            <div>
              <Card className="enhanced-card sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <div className="p-2 rounded-lg bg-gradient-primary mr-3">
                      <Ticket className="h-5 w-5 text-white" />
                    </div>
                    Purchase Tickets
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Quantity Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Quantity (max {maxQuantity} available)
                    </label>
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
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Ticket price × {quantity}</span>
                      <span className="text-foreground">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Service fee</span>
                      <span className="text-foreground">${serviceFee}</span>
                    </div>
                    <Separator className="bg-border/30" />
                    <div className="flex justify-between font-medium text-lg">
                      <span className="text-foreground">Total</span>
                      <span className="text-chart-4">${finalTotal}</span>
                    </div>
                    {listing.savings > 0 && (
                      <div className="text-center">
                        <span className="text-sm text-primary">
                          You save ${listing.savings * quantity} vs original price
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <Button 
                    className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 neon-glow py-4 text-lg"
                  >
                    <Ticket className="h-5 w-5 mr-2" />
                    Buy Now - ${finalTotal}
                  </Button>

                  {/* Guarantees */}
                  <div className="space-y-2 text-xs text-center text-foreground-muted">
                    <p>✅ 100% authentic tickets guaranteed</p>
                    <p>🔒 Secure payment processing</p>
                    <p>📱 Instant digital delivery</p>
                    <p>↩️ Full refund if event is cancelled</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}