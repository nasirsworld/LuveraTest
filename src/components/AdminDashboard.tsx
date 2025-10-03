import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  Eye,
  TrendingUp,
  Package,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Heart,
  Star,
  DollarSign,
  Activity,
  Globe,
  MousePointer,
  UserCheck,
  Gift,
  MessageCircle,
  CheckCircle,
  XCircle,
  ThumbsUp,
  Clock,
  BarChart3,
  PieChart,
  TrendingDown,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
  AlertCircle,
  CheckCheck,
  FlaskConical,
  Palette,
  Maximize2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useUser } from './UserContext';
import { InitializeDataButton } from './InitializeDataButton';
import { DedicatedBlogEditor } from './DedicatedBlogEditor';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminDashboardProps {
  navigateTo: (page: string) => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  ingredients: string[];
  howToUse: string;
  stock: number;
  benefits: string[];
  skinType: string[];
  subscriptionDiscount: number;
  brand: string;
  volume: string;
  rating: number;
  reviews: Review[];
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  publishDate: string;
  tags: string[];
  category: string;
  featuredImage: string;
  readTime: number;
  views: number;
  seoTitle: string;
  seoDescription: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  approved: boolean;
  helpful: number;
}

interface IngredientLibrary {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  category: string;
  concentration?: string;
  contraindications?: string;
}

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

interface Analytics {
  pageViews: Record<string, { today: number; yesterday: number }>;
  totalViewsToday: number;
  totalViewsYesterday: number;
  activeUsers: number;
  topPages: [string, { today: number; yesterday: number }][];
  dailyUsers: number;
  totalWebsiteClicks: number;
  pageClicksPerDay: Record<string, number>;
  mostViewedPages: Array<{ page: string; views: number }>;
  mostCheckedOutProducts: Array<{ productId: string; checkouts: number }>;
  mostWishlistedProducts: Array<{ productId: string; wishlists: number }>;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
}

const CHART_COLORS = ['#ffc300', '#ff8500', '#ff6b9d', '#8b5cf6', '#06d6a0'];

export function AdminDashboard({ navigateTo }: AdminDashboardProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [productAnalytics, setProductAnalytics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ingredientLibrary, setIngredientLibrary] = useState<IngredientLibrary[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<IngredientLibrary | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showIngredientDialog, setShowIngredientDialog] = useState(false);
  const [showDedicatedBlogEditor, setShowDedicatedBlogEditor] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!user?.isAdmin) {
      navigateTo('account');
    }
  }, [user, navigateTo]);

  // Load all data
  useEffect(() => {
    if (user?.isAdmin) {
      loadDashboardData();
      // Set up real-time refresh
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load analytics
      const analyticsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/dashboard`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // Load products
      const productsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Load blogs
      const blogsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/blogs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      }

      // Load offers
      const offersRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(offersData);
      }

      // Load product analytics
      const productAnalyticsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/products`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (productAnalyticsRes.ok) {
        const productAnalyticsData = await productAnalyticsRes.json();
        setProductAnalytics(productAnalyticsData);
      }

      // Load user analytics
      const userAnalyticsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/users`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (userAnalyticsRes.ok) {
        const userAnalyticsData = await userAnalyticsRes.json();
        setUserAnalytics(userAnalyticsData);
      }

      // Load reviews
      const reviewsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/reviews`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }

      // Load ingredient library
      const ingredientsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (ingredientsRes.ok) {
        const ingredientsData = await ingredientsRes.json();
        setIngredientLibrary(ingredientsData);
      }

      // Load users (admin only)
      if (user?.accessToken) {
        const usersRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/users`, {
          headers: { 'Authorization': `Bearer ${user.accessToken}` }
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Product CRUD operations
  const saveProduct = async (productData: Partial<Product>) => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products/${editingProduct.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        await loadDashboardData();
        setShowProductDialog(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Blog CRUD operations
  const saveBlog = async (blogData: Partial<BlogPost>) => {
    try {
      const method = editingBlog ? 'PUT' : 'POST';
      const url = editingBlog 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/blogs/${editingBlog.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/blogs`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        await loadDashboardData();
        setShowBlogDialog(false);
        setEditingBlog(null);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Offer CRUD operations
  const saveOffer = async (offerData: Partial<Offer>) => {
    try {
      const method = editingOffer ? 'PUT' : 'POST';
      const url = editingOffer 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers/${editingOffer.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(offerData)
      });

      if (response.ok) {
        await loadDashboardData();
        setShowOfferDialog(false);
        setEditingOffer(null);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  // Review management operations
  const approveReview = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ approved })
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Ingredient library operations
  const saveIngredient = async (ingredientData: Partial<IngredientLibrary>) => {
    try {
      const method = editingIngredient ? 'PUT' : 'POST';
      const url = editingIngredient 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients/${editingIngredient.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(ingredientData)
      });

      if (response.ok) {
        await loadDashboardData();
        setShowIngredientDialog(false);
        setEditingIngredient(null);
      }
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Access Required</h2>
          <div className="space-y-3 text-sm">
            <p>Current user: <strong>{user?.email || 'Not logged in'}</strong></p>
            <p>Admin status: <strong>{user?.isAdmin ? 'Admin' : 'Regular User'}</strong></p>
            <p>User ID: <strong>{user?.id || 'None'}</strong></p>
            
            {user?.email === 'admin@luvera.com' && !user?.isAdmin && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                  You're signed in as admin@luvera.com but don't have admin privileges.
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                  This might be a profile sync issue. Try going back to your account and using the "Become Admin" button.
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-2">
            <Button 
              onClick={() => navigateTo('account')} 
              variant="outline" 
              className="flex-1"
            >
              Go to Account
            </Button>
            {user?.email === 'admin@luvera.com' && (
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/create-admin`, {
                      method: 'POST'
                    });
                    const data = await response.json();
                    alert(data.message || 'Admin user creation attempted');
                    window.location.reload();
                  } catch (error) {
                    console.error('Error creating admin:', error);
                  }
                }}
                className="btn-gradient-primary flex-1"
                size="sm"
              >
                Fix Admin
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pageViewsData = analytics?.topPages.map(([page, data]) => ({
    page: page.charAt(0).toUpperCase() + page.slice(1),
    today: data.today,
    yesterday: data.yesterday
  })) || [];

  const userGrowthData = userAnalytics?.userGrowthData || [
    { month: 'Jan', users: 0 },
    { month: 'Feb', users: 0 },
    { month: 'Mar', users: 0 },
    { month: 'Apr', users: 0 },
    { month: 'May', users: 0 },
    { month: 'Jun', users: 0 }
  ];

  const topProductsData = productAnalytics?.topViewed.slice(0, 5).map(([productId, data]: [string, any]) => ({
    product: `Product ${productId.slice(-4)}`,
    views: data.product_view || 0,
    wishlisted: data.wishlist || 0,
    carted: data.cart_add || 0
  })) || [];

  return (
    <>
      {/* Dedicated Blog Editor - Full Screen Modal */}
      {showDedicatedBlogEditor && (
        <DedicatedBlogEditor
          blog={editingBlog}
          onSave={saveBlog}
          onClose={() => {
            setShowDedicatedBlogEditor(false);
            setEditingBlog(null);
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="gradient-text text-3xl mb-2">
                Luvera Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time analytics and content management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              {isLoading && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  Updating...
                </Badge>
              )}
              <InitializeDataButton />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            <Card className="ios-blur border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users (24h)</p>
                    <p className="gradient-text text-2xl">{analytics?.activeUsers || 0}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur border-chart-2/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Views</p>
                    <p className="text-chart-2 text-2xl">{analytics?.totalViewsToday || 0}</p>
                  </div>
                  <Eye className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur border-chart-3/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                    <p className="text-chart-3 text-2xl">{analytics?.totalWebsiteClicks || 0}</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur border-chart-4/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                    <p className="text-chart-4 text-2xl">{analytics?.conversionRate || 0}%</p>
                  </div>
                  <Target className="w-8 h-8 text-chart-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur border-chart-5/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Offers</p>
                    <p className="text-chart-5 text-2xl">{offers.filter(o => o.active).length}</p>
                  </div>
                  <Gift className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                    <p className="gradient-text text-2xl">
                      {analytics ? Math.round(((analytics.totalViewsToday - analytics.totalViewsYesterday) / Math.max(analytics.totalViewsYesterday, 1)) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="ios-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                    <p className="text-2xl">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</p>
                    <p className="text-2xl">{blogs.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
                    <p className="text-2xl">{analytics?.avgSessionDuration || 0}s</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="ios-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                    <p className="text-2xl">{analytics?.bounceRate || 0}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 ios-blur">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <Button
                onClick={() => navigateTo('product-upload')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 btn-gradient-primary text-primary-foreground border-none"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
              <TabsTrigger value="ingredients" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                <span className="hidden sm:inline">Ingredients</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Blogs</span>
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">Offers</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Page Views Today vs Yesterday
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pageViewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="page" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="today" fill="#ffc300" />
                        <Bar dataKey="yesterday" fill="#ff8500" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Growth Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#ffc300" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Top Products Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProductsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#ffc300" />
                        <Bar dataKey="wishlisted" fill="#ff6b9d" />
                        <Bar dataKey="carted" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Most Viewed Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.mostViewedPages?.slice(0, 6).map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="capitalize">{page.page}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{page.views}</span>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-muted-foreground py-8">No data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Activity Chart */}
              <Card className="ios-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Daily Website Activity (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={Object.entries(analytics?.pageClicksPerDay || {}).map(([date, clicks]) => ({
                      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      clicks,
                      fullDate: date
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;
                          return item ? new Date(item.fullDate).toLocaleDateString() : label;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#ffc300" 
                        strokeWidth={3}
                        dot={{ fill: '#ffc300', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#ffc300', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-gradient-primary" onClick={() => setEditingProduct(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                      </DialogHeader>
                      <ProductForm 
                        product={editingProduct} 
                        onSave={saveProduct}
                        onCancel={() => {
                          setShowProductDialog(false);
                          setEditingProduct(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                        <div>
                          <h3 className="">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category} • ${product.price}</p>
                          <div className="flex gap-2 mt-2">
                            {product.featured && <Badge>Featured</Badge>}
                            <Badge variant={product.inStock ? "default" : "destructive"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blogs Tab */}
            <TabsContent value="blogs" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Blog Management
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDedicatedBlogEditor(true)}
                      className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Dedicated Editor
                    </Button>
                    <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                      <DialogTrigger asChild>
                        <Button className="btn-gradient-primary" onClick={() => setEditingBlog(null)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Quick Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                        </DialogHeader>
                        <BlogForm 
                          blog={editingBlog} 
                          onSave={saveBlog}
                          onCancel={() => {
                            setShowBlogDialog(false);
                            setEditingBlog(null);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{blog.title}</h3>
                              <Badge variant={blog.published ? "default" : "secondary"}>
                                {blog.published ? "Published" : "Draft"}
                              </Badge>
                              {blog.category && (
                                <Badge variant="outline">{blog.category}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              By {blog.author} • {new Date(blog.publishDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {blog.readTime || 5} min read
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {blog.views || 0} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                {blog.tags?.length || 0} tags
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingBlog(blog);
                                setShowDedicatedBlogEditor(true);
                              }}
                              title="Edit in Dedicated Editor"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingBlog(blog);
                                setShowBlogDialog(true);
                              }}
                              title="Quick Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteBlog(blog.id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Festival Offers Management</CardTitle>
                  <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-gradient-primary" onClick={() => setEditingOffer(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                      </DialogHeader>
                      <OfferForm 
                        offer={editingOffer} 
                        onSave={saveOffer}
                        onCancel={() => {
                          setShowOfferDialog(false);
                          setEditingOffer(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                        <div>
                          <h3 className="">{offer.title}</h3>
                          <p className="text-sm text-muted-foreground">{offer.discount}% off</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={offer.active ? "default" : "secondary"}>
                              {offer.active ? "Active" : "Inactive"}
                            </Badge>
                            {offer.startDate && (
                              <Badge variant="outline">
                                {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingOffer(offer);
                              setShowOfferDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteOffer(offer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl gradient-text">{userAnalytics?.totalUsers || 0}</div>
                  </CardContent>
                </Card>
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle>Active Users (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-chart-2">{userAnalytics?.activeUsers || 0}</div>
                  </CardContent>
                </Card>
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle>User Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-chart-3">{userAnalytics?.userActivities || 0}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Ingredients Tab */}
            <TabsContent value="ingredients" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Ingredient Library
                  </CardTitle>
                  <Dialog open={showIngredientDialog} onOpenChange={setShowIngredientDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-gradient-primary" onClick={() => setEditingIngredient(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ingredient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
                      </DialogHeader>
                      <IngredientForm 
                        ingredient={editingIngredient} 
                        onSave={saveIngredient}
                        onCancel={() => {
                          setShowIngredientDialog(false);
                          setEditingIngredient(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ingredientLibrary.map((ingredient) => (
                      <div key={ingredient.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{ingredient.name}</h3>
                          <Badge variant="outline">{ingredient.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ingredient.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {ingredient.benefits.slice(0, 2).map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {ingredient.benefits.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{ingredient.benefits.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingIngredient(ingredient);
                              setShowIngredientDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteIngredient(ingredient.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Review Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Approved ({reviews.filter(r => r.approved).length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending ({reviews.filter(r => !r.approved).length})</span>
                      </div>
                    </div>
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <Badge variant={review.approved ? "default" : "secondary"}>
                              {review.approved ? "Approved" : "Pending"}
                            </Badge>
                            {review.verified && <Badge variant="outline">Verified Purchase</Badge>}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveReview(review.id, !review.approved)}
                            >
                              {review.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteReview(review.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {review.userName} • {new Date(review.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{review.content}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Product: {review.productId.slice(-8)}</span>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{review.helpful} helpful</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Advanced Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="ios-blur border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                        <p className="gradient-text">{analytics?.conversionRate?.toFixed(2) || 0}%</p>
                      </div>
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur border-chart-2/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                        <p className="text-chart-2">{analytics?.bounceRate?.toFixed(2) || 0}%</p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-chart-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur border-chart-3/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
                        <p className="text-chart-3">{Math.round(analytics?.avgSessionDuration || 0)}s</p>
                      </div>
                      <Clock className="w-8 h-8 text-chart-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur border-chart-4/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                        <p className="text-chart-4">{analytics?.totalWebsiteClicks || 0}</p>
                      </div>
                      <MousePointer className="w-8 h-8 text-chart-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Most Viewed Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.mostViewedPages?.slice(0, 5).map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">#{index + 1}</span>
                            <span className="capitalize">{page.page}</span>
                          </div>
                          <Badge>{page.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Most Checked Out Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.mostCheckedOutProducts?.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-chart-2/20 text-chart-2 px-2 py-1 rounded">#{index + 1}</span>
                            <span>Product {product.productId.slice(-8)}</span>
                          </div>
                          <Badge variant="secondary">{product.checkouts} checkouts</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Most Wishlisted Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.mostWishlistedProducts?.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-chart-3/20 text-chart-3 px-2 py-1 rounded">#{index + 1}</span>
                            <span>Product {product.productId.slice(-8)}</span>
                          </div>
                          <Badge className="bg-pink-100 text-pink-700">{product.wishlists} ♥</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Page Clicks Per Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={Object.entries(analytics?.pageClicksPerDay || {}).map(([page, clicks]) => ({ page: page.charAt(0).toUpperCase() + page.slice(1), clicks }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="page" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#ffc300" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="ios-blur">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <Switch id="maintenance" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Analytics Tracking</Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
    </>
  );
}

// Product Form Component
function ProductForm({ product, onSave, onCancel }: { product: Product | null; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    description: product?.description || '',
    images: product?.images?.join(',') || '',
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    ingredients: product?.ingredients?.join(',') || '',
    howToUse: product?.howToUse || '',
    stock: product?.stock || 0,
    benefits: product?.benefits?.join(',') || '',
    skinType: product?.skinType?.join(',') || '',
    subscriptionDiscount: product?.subscriptionDiscount || 15,
    brand: product?.brand || '',
    volume: product?.volume || '',
    rating: product?.rating || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
      ingredients: formData.ingredients.split(',').map(ing => ing.trim()).filter(Boolean),
      benefits: formData.benefits.split(',').map(benefit => benefit.trim()).filter(Boolean),
      skinType: formData.skinType.split(',').map(type => type.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Basic Information</h3>
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="volume">Volume/Size</Label>
            <Input
              id="volume"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              placeholder="e.g., 50ml, 30g"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={isNaN(formData.price) ? '' : formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={isNaN(formData.stock) ? '' : formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="subscriptionDiscount">Subscription Discount (%)</Label>
            <Input
              id="subscriptionDiscount"
              type="number"
              min="0"
              max="50"
              value={isNaN(formData.subscriptionDiscount) ? '' : formData.subscriptionDiscount}
              onChange={(e) => setFormData({ ...formData, subscriptionDiscount: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleanser">Cleanser</SelectItem>
              <SelectItem value="moisturizer">Moisturizer</SelectItem>
              <SelectItem value="serum">Serum</SelectItem>
              <SelectItem value="sunscreen">Sunscreen</SelectItem>
              <SelectItem value="toner">Toner</SelectItem>
              <SelectItem value="mask">Mask</SelectItem>
              <SelectItem value="exfoliant">Exfoliant</SelectItem>
              <SelectItem value="eye-care">Eye Care</SelectItem>
              <SelectItem value="lip-care">Lip Care</SelectItem>
              <SelectItem value="treatment">Treatment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Product Details</h3>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Detailed product description..."
          />
        </div>
        <div>
          <Label htmlFor="howToUse">How to Use</Label>
          <Textarea
            id="howToUse"
            value={formData.howToUse}
            onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
            rows={3}
            placeholder="Step-by-step instructions on how to use this product..."
          />
        </div>
        <div>
          <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
          <Textarea
            id="ingredients"
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            rows={3}
            placeholder="Water, Hyaluronic Acid, Niacinamide..."
          />
        </div>
        <div>
          <Label htmlFor="benefits">Key Benefits (comma-separated)</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            rows={2}
            placeholder="Hydrating, Anti-aging, Brightening..."
          />
        </div>
        <div>
          <Label htmlFor="skinType">Suitable Skin Types (comma-separated)</Label>
          <Input
            id="skinType"
            value={formData.skinType}
            onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
            placeholder="Dry, Oily, Combination, Sensitive, All"
          />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Product Images</h3>
        <div>
          <Label htmlFor="images">Images (comma-separated URLs)</Label>
          <Textarea
            id="images"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            rows={2}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg..."
          />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Product Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" className="btn-gradient-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Blog Form Component
function BlogForm({ blog, onSave, onCancel }: { blog: BlogPost | null; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    author: blog?.author || '',
    published: blog?.published ?? false,
    publishDate: blog?.publishDate || new Date().toISOString().split('T')[0],
    tags: blog?.tags?.join(',') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="date"
            value={formData.publishDate}
            onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="btn-gradient-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Blog Post
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Offer Form Component
function OfferForm({ offer, onSave, onCancel }: { offer: Offer | null; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    discount: offer?.discount || 0,
    image: offer?.image || '',
    active: offer?.active ?? true,
    startDate: offer?.startDate || new Date().toISOString().split('T')[0],
    endDate: offer?.endDate || '',
    buttonText: offer?.buttonText || 'Shop Now',
    buttonLink: offer?.buttonLink || '/shop'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Offer Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="buttonLink">Button Link</Label>
        <Input
          id="buttonLink"
          value={formData.buttonLink}
          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Active</Label>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="btn-gradient-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Offer
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Ingredient Form Component
function IngredientForm({ ingredient, onSave, onCancel }: { ingredient: IngredientLibrary | null; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: ingredient?.name || '',
    description: ingredient?.description || '',
    benefits: ingredient?.benefits?.join(',') || '',
    category: ingredient?.category || '',
    concentration: ingredient?.concentration || '',
    contraindications: ingredient?.contraindications || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      benefits: formData.benefits.split(',').map(benefit => benefit.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Ingredient Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Hyaluronic Acid"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Ingredient</SelectItem>
              <SelectItem value="moisturizer">Moisturizer</SelectItem>
              <SelectItem value="antioxidant">Antioxidant</SelectItem>
              <SelectItem value="exfoliant">Exfoliant</SelectItem>
              <SelectItem value="preservative">Preservative</SelectItem>
              <SelectItem value="emulsifier">Emulsifier</SelectItem>
              <SelectItem value="fragrance">Fragrance</SelectItem>
              <SelectItem value="colorant">Colorant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="concentration">Typical Concentration</Label>
          <Input
            id="concentration"
            value={formData.concentration}
            onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
            placeholder="e.g., 0.5-2%"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe what this ingredient does and its properties..."
          required
        />
      </div>
      <div>
        <Label htmlFor="benefits">Benefits (comma-separated)</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          rows={2}
          placeholder="Hydrating, Anti-aging, Brightening, Soothing..."
        />
      </div>
      <div>
        <Label htmlFor="contraindications">Contraindications</Label>
        <Textarea
          id="contraindications"
          value={formData.contraindications}
          onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
          rows={2}
          placeholder="Any warnings, side effects, or conflicts with other ingredients..."
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="btn-gradient-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Ingredient
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}