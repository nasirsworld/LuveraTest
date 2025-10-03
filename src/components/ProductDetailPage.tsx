import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { useAnalytics } from '../hooks/useAnalytics';

interface ProductDetailPageProps {
  navigateTo: (page: string) => void;
  appState: any;
}

export function ProductDetailPage({ navigateTo, appState }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const { addItem } = useCart();
  const { trackPageView, trackActivity } = useAnalytics();

  // Track page view
  useEffect(() => {
    trackPageView('product');
    if (appState?.selectedProduct?.id) {
      trackActivity('product_view', appState.selectedProduct.id, 'product');
    }
  }, [appState?.selectedProduct]);

  // Mock product data - in real app, this would come from props or API
  const defaultProduct = {
    id: '1',
    name: 'Vitamin C Brightening Serum',
    price: 45,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYm90dGxlcyUyMHNlcnVtfGVufDF8fHx8MTc1OTM3MzExMXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 234,
    badge: 'Bestseller',
    category: 'Serums',
    description: 'A powerful vitamin C serum that brightens skin, reduces dark spots, and provides antioxidant protection. Formulated with 15% L-Ascorbic Acid and hyaluronic acid for maximum efficacy.',
    keyIngredients: ['15% L-Ascorbic Acid', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid'],
    benefits: ['Brightens complexion', 'Reduces dark spots', 'Protects against free radicals', 'Improves skin texture'],
    howToUse: 'Apply 2-3 drops to clean face in the morning. Follow with moisturizer and SPF. Start with every other day and gradually increase to daily use.',
    variants: [
      { size: '15ml', price: 28, originalPrice: null },
      { size: '30ml', price: 45, originalPrice: 60 },
      { size: '50ml', price: 68, originalPrice: 85 }
    ]
  };

  const product = appState.selectedProduct ? {
    ...defaultProduct,
    ...appState.selectedProduct,
    variants: appState.selectedProduct.variants || defaultProduct.variants
  } : defaultProduct;

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.size || '30ml');

  const reviews = [
    {
      id: '1',
      name: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Amazing serum! I\'ve been using it for a month and my skin is noticeably brighter. The dark spots from acne are fading.',
      verified: true
    },
    {
      id: '2',
      name: 'Jessica L.',
      rating: 4,
      date: '1 month ago',
      text: 'Great product but takes time to see results. Make sure to use SPF during the day!',
      verified: true
    },
    {
      id: '3',
      name: 'Maria R.',
      rating: 5,
      date: '3 weeks ago',
      text: 'This is my holy grail serum. Gentle yet effective, and the glow is real!',
      verified: true
    }
  ];

  const currentVariant = product.variants?.find((v: any) => v.size === selectedVariant) || product.variants?.[0];
  const currentPrice = isSubscription ? (currentVariant?.price * 0.85) : currentVariant?.price;

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}-${selectedVariant}-${isSubscription ? 'sub' : 'one'}-${Date.now()}`,
      productId: product.id,
      name: `${product.name} (${selectedVariant})`,
      price: currentPrice,
      image: product.image,
      variant: selectedVariant,
      isSubscription,
      subscriptionFrequency: isSubscription ? 'monthly' : undefined
    });
    trackActivity('cart_add', product.id, 'product');
  };

  const handleWishlistToggle = async () => {
    setIsWishlistAnimating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsWishlisted(!isWishlisted);
    setIsWishlistAnimating(false);
    
    // Track wishlist activity
    trackActivity(isWishlisted ? 'wishlist_remove' : 'wishlist', product.id, 'product');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center text-sm text-muted-foreground">
            <button onClick={() => navigateTo('home')} className="hover:text-foreground">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigateTo('shop')} className="hover:text-foreground">Shop</button>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-8">
              <div className="relative aspect-square mb-4">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4">
                    {product.badge}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 w-10 h-10 p-0 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square">
                    <ImageWithFallback
                      src={product.image}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">${currentPrice?.toFixed(2)}</span>
                  {currentVariant?.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${currentVariant.originalPrice}
                    </span>
                  )}
                  {isSubscription && (
                    <Badge className="bg-green-500 text-white">Save 15%</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="subscription"
                    checked={isSubscription}
                    onChange={(e) => setIsSubscription(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="subscription" className="text-sm">
                    Subscribe & Save 15% • Delivered monthly
                  </label>
                </div>
              </div>

              {/* Variants & Quantity */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((variant: any) => (
                        <SelectItem key={variant.size} value={variant.size}>
                          {variant.size} - ${variant.price}
                          {variant.originalPrice && ` (Save $${variant.originalPrice - variant.price})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full btn-gradient-primary text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <div className="flex gap-2">
                  <motion.div className="flex-1">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className={`w-full transition-all duration-300 ${
                        isWishlisted 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400 text-white shadow-lg' 
                          : 'hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      onClick={handleWishlistToggle}
                      disabled={isWishlistAnimating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={{
                          scale: isWishlistAnimating ? [1, 1.2, 1] : 1,
                          rotate: isWishlisted ? [0, 10, -10, 0] : 0
                        }}
                        transition={{ 
                          duration: isWishlistAnimating ? 0.6 : 0.3,
                          ease: "easeInOut"
                        }}
                        className="flex items-center"
                      >
                        <Heart 
                          className={`w-5 h-5 mr-2 transition-all duration-300 ${
                            isWishlisted ? 'fill-current' : ''
                          }`} 
                        />
                        <span>
                          {isWishlistAnimating 
                            ? 'Adding...' 
                            : isWishlisted 
                              ? 'In Wishlist' 
                              : 'Add to Wishlist'
                          }
                        </span>
                      </motion.div>
                      {isWishlisted && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 pointer-events-none"
                        />
                      )}
                    </Button>
                  </motion.div>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Cruelty-Free</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="usage">How to Use</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Product Details</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <h4 className="mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Key Ingredients</h3>
                  <div className="space-y-4">
                    {product.keyIngredients.map((ingredient: string, index: number) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{ingredient}</h4>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">How to Use</h3>
                  <p className="text-muted-foreground mb-6">{product.howToUse}</p>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Important Notes:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Always use SPF 30+ during the day</li>
                      <li>• Start with every other day to build tolerance</li>
                      <li>• Discontinue use if irritation occurs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3>Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <p className="text-muted-foreground">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}