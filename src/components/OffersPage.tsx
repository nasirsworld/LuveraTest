import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Gift, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  active: boolean;
  startDate: string;
  endDate: string;
  buttonText: string;
  buttonLink: string;
}

interface OffersPageProps {
  navigateTo: (page: string) => void;
}

export function OffersPage({ navigateTo }: OffersPageProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView, trackActivity } = useAnalytics();

  useEffect(() => {
    trackPageView('offers');
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfferClick = (offer: Offer) => {
    trackActivity('offer_click', undefined, 'offers');
    if (offer.buttonLink === '/shop') {
      navigateTo('shop');
    } else {
      navigateTo('shop');
    }
  };

  const calculateTimeLeft = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-8 h-8 text-primary" />
            <h1 className="gradient-text text-4xl">
              Special Offers
            </h1>
            <Sparkles className="w-8 h-8 text-chart-3" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing deals and limited-time offers on your favorite skincare products
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="h-80">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 w-1/2 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Offers Grid */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offers.map((offer, index) => {
              const timeLeft = calculateTimeLeft(offer.endDate);
              const isActive = offer.active && (timeLeft !== null);

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`overflow-hidden h-full transition-all duration-300 hover:shadow-xl ${
                    isActive ? 'border-primary/30 shadow-lg' : 'opacity-60'
                  }`}>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {offer.image ? (
                        <ImageWithFallback
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full gradient-bg-warm flex items-center justify-center">
                          <Gift className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-lg px-3 py-1">
                        {offer.discount}% OFF
                      </Badge>

                      {/* Status Badge */}
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {isActive ? 'Active' : 'Expired'}
                      </Badge>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="text-xl mb-2 line-clamp-2">{offer.title}</h3>
                      
                      {/* Description */}
                      {offer.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {offer.description}
                        </p>
                      )}

                      {/* Countdown Timer */}
                      {timeLeft && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Time Remaining
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-lg">{timeLeft.days}</div>
                              <div className="text-xs text-muted-foreground">Days</div>
                            </div>
                            <div>
                              <div className="text-lg">{timeLeft.hours}</div>
                              <div className="text-xs text-muted-foreground">Hours</div>
                            </div>
                            <div>
                              <div className="text-lg">{timeLeft.minutes}</div>
                              <div className="text-xs text-muted-foreground">Min</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <div className="mt-auto">
                        <Button
                          onClick={() => handleOfferClick(offer)}
                          disabled={!isActive}
                          className={`w-full ${
                            isActive ? 'btn-gradient-primary' : ''
                          }`}
                          variant={isActive ? 'default' : 'outline'}
                        >
                          {offer.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && offers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl mb-2">No Offers Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for amazing deals and special offers!
            </p>
            <Button onClick={() => navigateTo('shop')} className="btn-gradient-primary">
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}