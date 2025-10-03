import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Gift, Clock, ArrowRight } from 'lucide-react';
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

interface FestivalOfferBannerProps {
  navigateTo: (page: string) => void;
}

export function FestivalOfferBanner({ navigateTo }: FestivalOfferBannerProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    loadActiveOffers();
  }, []);

  useEffect(() => {
    // Auto-rotate offers every 5 seconds - optimized
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [offers.length]);

  useEffect(() => {
    // Update countdown timer - optimized to reduce frequency
    if (offers.length > 0 && offers[currentOfferIndex]?.endDate) {
      updateCountdown(); // Initial call
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [offers.length, currentOfferIndex]); // Remove offers dependency to prevent excessive re-renders

  const loadActiveOffers = async () => {
    try {
      console.log('Loading active offers from server...');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers/active`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      console.log('Offers response status:', response.status);
      
      if (response.ok) {
        const activeOffers = await response.json();
        console.log('Loaded active offers:', activeOffers);
        setOffers(activeOffers || []);
      } else {
        const errorText = await response.text();
        console.warn('Failed to load offers:', response.status, errorText);
        setOffers([]);
      }
    } catch (error) {
      console.error('Error loading active offers:', error);
      setOffers([]);
    }
  };

  const updateCountdown = () => {
    const currentOffer = offers[currentOfferIndex];
    if (!currentOffer?.endDate) return;

    const now = new Date().getTime();
    const endTime = new Date(currentOffer.endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft(null);
      // Refresh offers when timer expires
      loadActiveOffers();
    }
  };

  const handleOfferClick = () => {
    const currentOffer = offers[currentOfferIndex];
    if (currentOffer?.buttonLink === '/shop') {
      navigateTo('shop');
    } else {
      // Handle other navigation or external links
      navigateTo('shop');
    }
  };

  if (!isVisible) {
    return null;
  }

  // Don't show banner if no offers are available
  if (offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentOfferIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        <div className="relative bg-gradient-to-r from-primary via-chart-2 to-chart-3 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCI+CjxwYXRoIGQ9Im0zNiwxNGE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDBsLTUsOWE1LDUgMCAxLDEgLTEwLDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPgo8L3N2Zz4K')] bg-repeat"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative px-6 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Content Side */}
                <motion.div
                  key={currentOfferIndex}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Discount Badge */}
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                      <Gift className="w-5 h-5 mr-2" />
                      {currentOffer.discount}% OFF
                    </Badge>
                    {offers.length > 1 && (
                      <div className="flex gap-1">
                        {offers.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentOfferIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentOfferIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-5xl mb-4 leading-tight">
                    {currentOffer.title}
                  </h2>

                  {/* Description */}
                  {currentOffer.description && (
                    <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                      {currentOffer.description}
                    </p>
                  )}

                  {/* Countdown Timer */}
                  {timeLeft && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm uppercase tracking-wide">Limited Time</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Days', value: timeLeft.days },
                          { label: 'Hours', value: timeLeft.hours },
                          { label: 'Min', value: timeLeft.minutes },
                          { label: 'Sec', value: timeLeft.seconds }
                        ].map((unit) => (
                          <div key={unit.label} className="text-center">
                            <div className="text-2xl lg:text-3xl mb-1">
                              {unit.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs lg:text-sm text-white/70 uppercase tracking-wide">
                              {unit.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleOfferClick}
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      {currentOffer.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Image Side */}
                {currentOffer.image && (
                  <motion.div
                    key={`image-${currentOfferIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <ImageWithFallback
                        src={currentOffer.image}
                        alt={currentOffer.title}
                        className="w-full h-64 lg:h-80 object-cover"
                      />
                      {/* Floating Elements */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-12 lg:h-16"
            >
              <path
                d="M0 120L1440 120L1440 0C1440 0 1080 80 720 40C360 0 0 60 0 60V120Z"
                fill="var(--background)"
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}