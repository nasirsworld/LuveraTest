import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ShopPageProps {
  navigateTo: (page: string, data?: any) => void;
}

export function ShopPage({ navigateTo }: ShopPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();
  const { user } = useUser();

  // Analytics tracking functions
  const trackActivity = async (action: string, productId?: string) => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          action,
          productId,
          page: 'shop',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    trackActivity('cart_add', product.id);
  };

  // Track page view
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/page-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            page: 'shop',
            userId: user?.id || 'anonymous',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [user]);

  // State for products
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match expected format
          const transformedProducts = data.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYm90dGxlcyUyMHNlcnVtfGVufDF8fHx8MTc1OTM3MzExMXww&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.8, // Default rating
            reviews: Math.floor(Math.random() * 300) + 50, // Random reviews
            badge: product.featured ? 'Featured' : null,
            category: product.category,
            description: product.description,
            skinTypes: ['All'], // Default skin types
            concerns: [], // Default concerns
            variants: [
              { size: '30ml', price: product.price, originalPrice: product.originalPrice }
            ]
          }));
          setProducts(transformedProducts);
        } else {
          console.error('Failed to fetch products');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl mb-4">Shop Skincare</h1>
          <p className="text-muted-foreground">
            Discover our collection of clean, effective skincare products
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            
            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-64 flex-shrink-0"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Filters</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3">Category</h4>
                      <div className="space-y-2">
                        {['All', 'Cleansers', 'Serums', 'Moisturizers', 'Treatments'].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={category} />
                            <Label htmlFor={category} className="text-sm">{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3">Skin Type</h4>
                      <div className="space-y-2">
                        {['All', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox id={type} />
                            <Label htmlFor={type} className="text-sm">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3">Concerns</h4>
                      <div className="space-y-2">
                        {['Acne', 'Aging', 'Dark Spots', 'Dryness', 'Large Pores', 'Sensitivity'].map((concern) => (
                          <div key={concern} className="flex items-center space-x-2">
                            <Checkbox id={concern} />
                            <Label htmlFor={concern} className="text-sm">{concern}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl mb-2">No Products Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Products will appear here once they are added by the admin.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover ${
                          viewMode === 'grid' ? 'h-64' : 'h-48'
                        }`}
                        onClick={() => {
                          trackActivity('product_view', product.id);
                          navigateTo('product', { product });
                        }}
                      />
                      {product.badge && (
                        <Badge
                          className="absolute top-3 left-3"
                          variant={product.badge === 'Bestseller' ? 'default' : 'secondary'}
                        >
                          {product.badge}
                        </Badge>
                      )}
                      {product.originalPrice && (
                        <Badge
                          className="absolute top-3 right-3 bg-red-500 text-white"
                        >
                          Save ${product.originalPrice - product.price}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackActivity('wishlist', product.id);
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center mb-2">
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
                      
                      <h3 
                        className="mb-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigateTo('product', { product })}
                      >
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {product.category}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.concerns.slice(0, 2).map((concern) => (
                          <Badge key={concern} variant="outline" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}