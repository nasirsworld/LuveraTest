import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useMobile } from '../hooks/useMobile';
import { 
  Star, 
  Sparkles, 
  Shield, 
  Leaf, 
  Heart, 
  ChevronRight,
  Play,
  Award,
  Users,
  ShoppingBag
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HeroCarousel } from './HeroCarousel';
import { FestivalOfferBanner } from './FestivalOfferBanner';
import { useUser } from './UserContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HomePageProps {
  navigateTo: (page: string, data?: any) => void;
}

// Memoized ProductCard component for better performance
const ProductCard = React.memo(({ product, index, isMobile, onClick }: {
  product: any;
  index: number;
  isMobile: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }} // Only animate once and optimize viewport
    transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }} // Cap delay for better UX
    whileHover={{ y: -3 }} // Reduce hover effect for smoother performance
    className="cursor-pointer"
    onClick={onClick}
  >
    <Card className={`overflow-hidden transition-all duration-200 ${isMobile ? 'hover:scale-[1.02] active:scale-95' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className={`w-full object-cover ${isMobile ? 'h-48' : 'h-64'}`}
          loading="lazy" // Add lazy loading
        />
        <Badge
          className="absolute top-3 left-3"
          variant={product.badge === 'Bestseller' ? 'default' : 'secondary'}
        >
          {product.badge}
        </Badge>
        {product.originalPrice && (
          <Badge
            className="absolute top-3 right-3 bg-red-500 text-white"
          >
            Save ${product.originalPrice - product.price}
          </Badge>
        )}
      </div>
      <CardContent className={isMobile ? 'p-4' : 'p-6'}>
        <div className={`flex items-center ${isMobile ? 'mb-1' : 'mb-2'}`}>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            ({product.reviews})
          </span>
        </div>
        <h3 className={isMobile ? 'mb-1 text-base' : 'mb-2'}>{product.name}</h3>
        <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
          <div className="flex items-center space-x-2">
            <span className={isMobile ? 'text-lg font-semibold' : 'text-xl'}>${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button size={isMobile ? 'sm' : 'sm'} className={isMobile ? 'w-full' : ''}>
            {isMobile ? <ShoppingBag className="w-4 h-4 mr-1" /> : ''}
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

// Memoized BenefitCard component
const BenefitCard = React.memo(({ benefit, index, isMobile }: {
  benefit: any;
  index: number;
  isMobile: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
  >
    <Card className={`text-center h-full hover:shadow-md transition-all duration-200 ${isMobile ? 'hover:scale-[1.02]' : ''}`}>
      <CardContent className={isMobile ? 'p-4' : 'p-6'}>
        <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} gradient-bg-warm rounded-lg flex items-center justify-center text-white mx-auto mb-4 glow-golden`}>
          <div className={isMobile ? 'scale-75' : ''}>{benefit.icon}</div>
        </div>
        <h3 className={`mb-2 ${isMobile ? 'text-sm' : ''}`}>{benefit.title}</h3>
        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{benefit.description}</p>
      </CardContent>
    </Card>
  </motion.div>
));

// Memoized TestimonialCard component
const TestimonialCard = React.memo(({ testimonial, index, isMobile }: {
  testimonial: any;
  index: number;
  isMobile: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
  >
    <Card className={`h-full ${isMobile ? 'hover:scale-[1.02] transition-transform duration-200' : ''}`}>
      <CardContent className={isMobile ? 'p-4' : 'p-6'}>
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-current"
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
        <div className="flex items-center">
          <ImageWithFallback
            src={testimonial.image}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
            loading="lazy"
          />
          <div>
            <p className="font-medium">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.skinType} Skin
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

export function HomePage({ navigateTo }: HomePageProps) {
  const isMobile = useMobile();
  const { user } = useUser();

  // State for featured products with loading state
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Memoized track page view function
  const trackPageView = useCallback(async () => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/page-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          page: 'home',
          userId: user?.id || 'anonymous',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [user?.id]);

  // Memoized fetch featured products function
  const fetchFeaturedProducts = useCallback(async () => {
    if (isLoadingProducts) return; // Prevent duplicate requests
    
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Get featured products and transform data
        const featured = data
          .filter((product: any) => product.featured)
          .slice(0, 3) // Limit to 3 featured products
          .map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYm90dGxlcyUyMHNlcnVtfGVufDF8fHx8MTc1OTM3MzExMXww&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.8,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: 'Featured',
            variants: [
              { size: '30ml', price: product.price, originalPrice: product.originalPrice }
            ]
          }));
        setFeaturedProducts(featured);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [isLoadingProducts]);

  // Use effect for page tracking - only run once on mount
  useEffect(() => {
    trackPageView();
  }, []); // Remove user dependency to prevent re-runs

  // Use effect for fetching products - only run once on mount
  useEffect(() => {
    fetchFeaturedProducts();
  }, []); // Remove dependencies to prevent re-fetching

  // Memoize static data to prevent re-creation on every render
  const testimonials = useMemo(() => [
    {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1620334267407-30621bae1d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBiZWF1dHklMjBtb2RlbHxlbnwxfHx8fDE3NTkzNzMxMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "Luvera's personalized routine completely transformed my skin. The quiz was spot-on!",
      rating: 5,
      skinType: 'Combination'
    },
    {
      name: 'Emily Chen',
      image: 'https://images.unsplash.com/photo-1620334267407-30621bae1d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBiZWF1dHklMjBtb2RlbHxlbnwxfHx8fDE3NTkzNzMxMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "Amazing products with natural ingredients. My sensitive skin has never been better!",
      rating: 5,
      skinType: 'Sensitive'
    },
    {
      name: 'Michael Torres',
      image: 'https://images.unsplash.com/photo-1620334267407-30621bae1d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBiZWF1dHklMjBtb2RlbHxlbnwxfHx8fDE3NTkzNzMxMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "The subscription service is so convenient, and the quality is consistently excellent.",
      rating: 5,
      skinType: 'Oily'
    }
  ], []);

  const benefits = useMemo(() => [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Natural Ingredients',
      description: '100% natural, sustainably sourced ingredients'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Dermatologist Tested',
      description: 'Clinically tested and approved by experts'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Cruelty-Free',
      description: 'Never tested on animals, always ethical'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Personalized',
      description: 'Tailored routines for your unique skin'
    }
  ], []);

  return (
    <div className="min-h-screen">
      {/* Festival Offer Banner */}
      <FestivalOfferBanner navigateTo={navigateTo} />
      
      {/* Hero Carousel Section */}
      <HeroCarousel navigateTo={navigateTo} />

      {/* Benefits Section */}
      <section className={`${isMobile ? 'py-8' : 'py-16'} bg-background`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-4 sm:px-6 lg:px-8'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center ${isMobile ? 'mb-6' : 'mb-12'}`}
          >
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} mb-4`}>Why Choose Luvera?</h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : ''}`}>
              We believe everyone deserves healthy, radiant skin. That's why we've created 
              a personalized approach to skincare that actually works.
            </p>
          </motion.div>

          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}`}>
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                benefit={benefit}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`${isMobile ? 'py-8' : 'py-16'} bg-muted/30`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-4 sm:px-6 lg:px-8'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${isMobile ? 'mb-6' : 'flex items-center justify-between mb-12'}`}
          >
            <div className={isMobile ? 'text-center' : ''}>
              <h2 className={`${isMobile ? 'text-2xl mb-2' : 'text-3xl md:text-4xl mb-4'}`}>Featured Products</h2>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                Our most-loved products, trusted by thousands of customers
              </p>
            </div>
            {!isMobile && (
              <Button
                variant="outline"
                onClick={() => navigateTo('shop')}
                className="hidden sm:flex"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
            {isLoadingProducts ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className={`${isMobile ? 'h-48' : 'h-64'} bg-muted loading-shimmer`} />
                    <CardContent className={isMobile ? 'p-4' : 'p-6'}>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted loading-shimmer rounded" />
                        <div className="h-6 bg-muted loading-shimmer rounded w-3/4" />
                        <div className="h-4 bg-muted loading-shimmer rounded w-1/2" />
                        <div className="h-10 bg-muted loading-shimmer rounded" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isMobile={isMobile}
                  onClick={() => navigateTo('product', { product })}
                />
              ))
            )}
          </div>
          
          {/* Mobile View All Button */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-center"
            >
              <Button
                variant="outline"
                onClick={() => navigateTo('shop')}
                className="w-full"
              >
                View All Products
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${isMobile ? 'py-8' : 'py-16'} bg-background`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-4 sm:px-6 lg:px-8'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center ${isMobile ? 'mb-6' : 'mb-12'}`}
          >
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} mb-4`}>What Our Customers Say</h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : ''}`}>
              Join thousands of happy customers who have transformed their skin with Luvera
            </p>
          </motion.div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-8'}`}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg-warm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">
              Ready to Transform Your Skin?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take our personalized quiz and discover your perfect skincare routine today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-3"
                onClick={() => navigateTo('quiz')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600"
                onClick={() => navigateTo('shop')}
              >
                Shop Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}