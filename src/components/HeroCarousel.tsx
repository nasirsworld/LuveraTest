import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight, ShoppingCart, Eye, Sparkles, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMobile } from '../hooks/useMobile';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  detailedDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  specifications: Array<{
    label: string;
    value: string;
  }>;
  skinTypes: string[];
  benefits: string[];
  rating?: number;
  badge?: string;
}

interface HeroCarouselProps {
  navigateTo: (page: string, data?: any) => void;
}

export function HeroCarousel({ navigateTo }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const isMobile = useMobile();

  const products: Product[] = [
    {
      id: '1',
      name: 'Radiance Boost',
      category: 'Vitamin C Serum',
      description: 'Transform dull skin with our brightening vitamin C serum that delivers instant radiance.',
      detailedDescription: 'Our premium Vitamin C serum combines 20% L-Ascorbic Acid with hyaluronic acid and vitamin E to deliver powerful antioxidant protection while brightening and evening skin tone.',
      price: 48,
      originalPrice: 65,
      rating: 4.8,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1751131964776-57e3cbca0a14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlfGVufDF8fHx8MTc1OTM3NDQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      specifications: [
        { label: 'Volume', value: '30ml' },
        { label: 'Vitamin C', value: '20%' },
        { label: 'pH Level', value: '3.5-4.0' }
      ],
      skinTypes: ['All skin types', 'Dull skin'],
      benefits: ['Brightening', 'Anti-aging', 'Even tone']
    },
    {
      id: '2',
      name: 'Deep Hydration',
      category: 'Moisturizing Cream',
      description: 'Rich, nourishing cream that provides 24-hour hydration for silky smooth skin.',
      detailedDescription: 'Experience deep, lasting hydration with our ultra-rich moisturizing cream. Formulated with ceramides, peptides, and botanical extracts.',
      price: 42,
      rating: 4.6,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1758788390320-16e1f280cf49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbW9pc3R1cml6ZXIlMjBqYXJ8ZW58MXx8fHwxNzU5Mzc0NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      specifications: [
        { label: 'Volume', value: '50ml' },
        { label: 'Ceramides', value: '3%' },
        { label: 'Hydration', value: '24 hours' }
      ],
      skinTypes: ['Dry skin', 'Mature skin'],
      benefits: ['Deep hydration', 'Barrier repair', 'Anti-aging']
    },
    {
      id: '3',
      name: 'Pure Glow',
      category: 'Brightening Essence',
      description: 'Lightweight essence that targets dark spots for luminous, even-toned skin.',
      detailedDescription: 'Transform dull, uneven skin with our brightening essence featuring niacinamide, arbutin, and kojic acid.',
      price: 38,
      originalPrice: 52,
      rating: 4.7,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1745159338135-39f6b462b382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwYyUyMHNraW5jYXJlJTIwYm90dGxlfGVufDF8fHx8MTc1OTM3NDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      specifications: [
        { label: 'Volume', value: '100ml' },
        { label: 'Niacinamide', value: '5%' },
        { label: 'Arbutin', value: '2%' }
      ],
      skinTypes: ['All skin types', 'Pigmented skin'],
      benefits: ['Brightening', 'Even tone', 'Spot reduction']
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // Auto-play functionality with performance optimization
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]); // Add products.length dependency

  const currentProduct = products[currentIndex];

  // Mobile Hero Component
  const MobileHero = () => (
    <div 
      className="relative h-screen overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl top-20 -right-20"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl bottom-32 -left-20"
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col px-4 pt-8">
        {/* Hero Text */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full mb-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 text-pink-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skincare Reimagined</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Your Perfect
            <br />
            Skin Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover personalized skincare
            <br />
            that actually works
          </p>
        </motion.div>

        {/* Product Carousel */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Product Card */}
              <motion.div 
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 max-w-sm mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Badge */}
                {currentProduct.badge && (
                  <Badge 
                    className={`absolute -top-2 -right-2 z-20 ${
                      currentProduct.badge === 'Bestseller' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                      currentProduct.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-teal-600' :
                      'bg-gradient-to-r from-red-500 to-orange-600'
                    } text-white shadow-lg`}
                  >
                    {currentProduct.badge}
                  </Badge>
                )}

                {/* Product Image */}
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(currentProduct.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentProduct.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentProduct.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {currentProduct.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${currentProduct.price}
                      </span>
                      {currentProduct.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${currentProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    {currentProduct.originalPrice && (
                      <Badge className="bg-red-500 text-white">
                        Save ${currentProduct.originalPrice - currentProduct.price}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {products.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-pink-500 w-6'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              whileTap={{ scale: 0.8 }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8 px-2">
          <motion.div
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold shadow-lg mobile-bounce"
              onClick={() => navigateTo('product', { product: currentProduct })}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Product
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="outline"
                className="h-12 rounded-xl border-2 w-full mobile-bounce"
                onClick={() => navigateTo('quiz')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Take Quiz
              </Button>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="outline"
                className="h-12 rounded-xl border-2 w-full mobile-bounce"
                onClick={() => navigateTo('shop')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop All
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 ios-blur rounded-full flex items-center justify-center shadow-lg mobile-bounce"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 3000)}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 ios-blur rounded-full flex items-center justify-center shadow-lg mobile-bounce"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 3000)}
      >
        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>
    </div>
  );

  // Desktop Hero Component (existing)
  const DesktopHero = () => (
    <div className="relative h-[800px] overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background gradient */}
      <motion.div 
        className="absolute w-[500px] h-[300px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-[20%_30%_80%_10%] blur-[150px] top-1/2 left-1/2 transform -translate-x-[10%] -translate-y-1/2 transition-all duration-1000"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main content container */}
      <div className="absolute inset-0 flex items-center justify-between max-w-7xl mx-auto px-8">
        {/* Left content */}
        <motion.div 
          className="w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-pink-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skincare Reimagined</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Your Perfect
            <br />
            Skin Journey
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover personalized skincare solutions that transform your skin with science-backed ingredients and expert formulations.
          </p>

          <div className="flex gap-4 pt-6">
            <Button
              size="lg"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl text-lg"
              onClick={() => navigateTo('quiz')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 border-2 rounded-2xl text-lg"
              onClick={() => navigateTo('shop')}
            >
              Shop Now
            </Button>
          </div>
        </motion.div>

        {/* Right content - Product showcase */}
        <motion.div 
          className="w-1/2 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-lg ml-auto">
                {/* Badge */}
                {currentProduct.badge && (
                  <Badge 
                    className={`absolute -top-2 -right-2 z-20 ${
                      currentProduct.badge === 'Bestseller' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                      currentProduct.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-teal-600' :
                      'bg-gradient-to-r from-red-500 to-orange-600'
                    } text-white shadow-lg`}
                  >
                    {currentProduct.badge}
                  </Badge>
                )}

                <ImageWithFallback
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(currentProduct.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentProduct.rating}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {currentProduct.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {currentProduct.description}
                  </p>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${currentProduct.price}
                      </span>
                      {currentProduct.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">
                          ${currentProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    {currentProduct.originalPrice && (
                      <Badge className="bg-red-500 text-white">
                        Save ${currentProduct.originalPrice - currentProduct.price}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl"
                    onClick={() => navigateTo('product', { product: currentProduct })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-pink-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return isMobile ? <MobileHero /> : <DesktopHero />;
}