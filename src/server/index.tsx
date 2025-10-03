import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { initializeSampleData } from "./seed-data.tsx";
import { initializeAnalyticsIfNeeded } from "./init-analytics.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5a20eda3/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test KV store endpoint
app.get("/make-server-5a20eda3/test/kv", async (c) => {
  try {
    // Test basic KV operations
    await kv.set("test:key", { message: "Hello KV Store", timestamp: new Date().toISOString() });
    const testValue = await kv.get("test:key");
    
    return c.json({ 
      success: true, 
      kvWorking: true, 
      testValue,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log("KV Store test failed:", error);
    return c.json({ 
      success: false, 
      kvWorking: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// System status endpoint for admin dashboard
app.get("/make-server-5a20eda3/system/status", async (c) => {
  try {
    const products = await kv.getByPrefix("product:") || [];
    const blogs = await kv.getByPrefix("blog:") || [];
    const offers = await kv.getByPrefix("offer:") || [];
    const analytics = await kv.getByPrefix("analytics:") || [];
    
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      data: {
        products: products.length,
        blogs: blogs.length,
        offers: offers.length,
        analyticsEntries: analytics.length
      },
      initialized: products.length > 0 || blogs.length > 0 || offers.length > 0
    });
  } catch (error) {
    console.log("Error checking system status:", error);
    return c.json({ status: "error", error: "Failed to check system status", details: error.message }, 500);
  }
});

// Manual initialization endpoint for debugging
app.post("/make-server-5a20eda3/system/init", async (c) => {
  try {
    console.log("Manual initialization triggered...");
    
    await initializeSampleData();
    console.log("Sample data initialized");
    
    await initializeAnalyticsIfNeeded();
    console.log("Analytics initialized");
    
    return c.json({ 
      success: true, 
      message: "System initialized successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log("Error during manual initialization:", error);
    return c.json({ 
      success: false, 
      error: "Failed to initialize system", 
      details: error.message 
    }, 500);
  }
});

// ==================== ANALYTICS ROUTES ====================

// Track page view
app.post("/make-server-5a20eda3/analytics/page-view", async (c) => {
  try {
    const { page, userId, timestamp } = await c.req.json();
    const key = `analytics:page_views:${page}:${new Date().toISOString().split('T')[0]}`;
    
    // Get current count
    const currentCount = await kv.get(key) || 0;
    await kv.set(key, parseInt(currentCount) + 1);
    
    // Track user session
    if (userId) {
      const sessionKey = `analytics:user_sessions:${userId}:${timestamp}`;
      await kv.set(sessionKey, { page, timestamp, userId });
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error tracking page view:", error);
    return c.json({ error: "Failed to track page view" }, 500);
  }
});

// Get analytics data
app.get("/make-server-5a20eda3/analytics/dashboard", async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get page views for today and yesterday
    const todayViews = await kv.getByPrefix(`analytics:page_views:`) || [];
    const pageViews = {};
    let totalViewsToday = 0;
    let totalViewsYesterday = 0;
    let totalWebsiteClicks = 0;
    
    for (const item of todayViews) {
      if (!item.key || !item.value) continue;
      const [, , page, date] = item.key.split(':');
      if (!pageViews[page]) pageViews[page] = { today: 0, yesterday: 0 };
      
      if (date === today) {
        pageViews[page].today = item.value;
        totalViewsToday += item.value;
        totalWebsiteClicks += item.value;
      } else if (date === yesterday) {
        pageViews[page].yesterday = item.value;
        totalViewsYesterday += item.value;
      }
    }
    
    // Get active users (users who accessed in last 24h)
    const userSessions = await kv.getByPrefix(`analytics:user_sessions:`) || [];
    const activeUsers = new Set();
    const dailyUsers = new Set();
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    // Calculate session durations and bounce rates
    let totalSessionDuration = 0;
    const userLastAccess = {};
    
    for (const session of userSessions) {
      if (!session.value || !session.value.timestamp) continue;
      const sessionTime = new Date(session.value.timestamp).getTime();
      const userId = session.value.userId;
      
      // Active users (last 24 hours)
      if (now - sessionTime < 24 * 60 * 60 * 1000) {
        activeUsers.add(userId);
      }
      
      // Daily users (today)
      if (sessionTime >= todayStart) {
        dailyUsers.add(userId);
      }
      
      // Track session duration (simplified)
      if (userLastAccess[userId]) {
        const duration = sessionTime - userLastAccess[userId];
        if (duration > 0 && duration < 60 * 60 * 1000) { // Max 1 hour session
          totalSessionDuration += duration;
        }
      }
      userLastAccess[userId] = sessionTime;
    }
    
    // Calculate metrics
    const avgSessionDuration = userSessions.length > 0 
      ? Math.round(totalSessionDuration / userSessions.length / 1000) // in seconds
      : 0;
    
    // Get most viewed pages
    const mostViewedPages = Object.entries(pageViews)
      .map(([page, data]) => ({ 
        page: page.charAt(0).toUpperCase() + page.slice(1), 
        views: data.today + data.yesterday 
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Get page clicks per day (last 7 days)
    const pageClicksPerDay = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      pageClicksPerDay[date] = 0;
    }
    
    // Fill in actual data
    for (const item of todayViews) {
      if (!item.key || !item.value) continue;
      const [, , , date] = item.key.split(':');
      if (pageClicksPerDay.hasOwnProperty(date)) {
        pageClicksPerDay[date] += item.value;
      }
    }
    
    // Calculate conversion and bounce rates (simplified estimates)
    const activities = await kv.getByPrefix("activity:") || [];
    const purchases = activities.filter(a => a.value && a.value.action === 'purchase').length;
    const conversionRate = totalViewsToday > 0 ? ((purchases / totalViewsToday) * 100).toFixed(2) : 0;
    const bounceRate = Math.max(0, Math.min(100, 100 - (avgSessionDuration / 30))); // Simplified calculation
    
    return c.json({
      pageViews,
      totalViewsToday,
      totalViewsYesterday,
      activeUsers: activeUsers.size,
      dailyUsers: dailyUsers.size,
      totalWebsiteClicks,
      pageClicksPerDay,
      mostViewedPages,
      conversionRate: parseFloat(conversionRate),
      bounceRate: Math.round(bounceRate),
      avgSessionDuration,
      topPages: Object.entries(pageViews)
        .sort(([,a], [,b]) => b.today - a.today)
        .slice(0, 5)
    });
  } catch (error) {
    console.log("Error getting analytics:", error);
    return c.json({ error: "Failed to get analytics" }, 500);
  }
});

// ==================== PRODUCT MANAGEMENT ROUTES ====================

// Get all products
app.get("/make-server-5a20eda3/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:") || [];
    const processedProducts = products
      .map(p => {
        if (!p.key || !p.value) return null;
        return { id: p.key.split(':')[1], ...p.value };
      })
      .filter(product => product !== null);
    
    return c.json(processedProducts);
  } catch (error) {
    console.log("Error getting products:", error);
    return c.json({ error: "Failed to get products" }, 500);
  }
});

// Create product
app.post("/make-server-5a20eda3/products", async (c) => {
  try {
    const product = await c.req.json();
    const productId = `prod_${Date.now()}`;
    const productData = {
      ...product,
      id: productId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`product:${productId}`, productData);
    return c.json({ success: true, product: productData });
  } catch (error) {
    console.log("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update product
app.put("/make-server-5a20eda3/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`product:${id}`);
    
    if (!existing) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, updated);
    return c.json({ success: true, product: updated });
  } catch (error) {
    console.log("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product
app.delete("/make-server-5a20eda3/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// ==================== BLOG MANAGEMENT ROUTES ====================

// Get all blogs
app.get("/make-server-5a20eda3/blogs", async (c) => {
  try {
    const blogs = await kv.getByPrefix("blog:") || [];
    const processedBlogs = blogs
      .map(b => {
        if (!b.key || !b.value) return null;
        return { id: b.key.split(':')[1], ...b.value };
      })
      .filter(blog => blog !== null);
    
    return c.json(processedBlogs);
  } catch (error) {
    console.log("Error getting blogs:", error);
    return c.json({ error: "Failed to get blogs" }, 500);
  }
});

// Create blog
app.post("/make-server-5a20eda3/blogs", async (c) => {
  try {
    const blog = await c.req.json();
    const blogId = `blog_${Date.now()}`;
    const blogData = {
      ...blog,
      id: blogId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`blog:${blogId}`, blogData);
    return c.json({ success: true, blog: blogData });
  } catch (error) {
    console.log("Error creating blog:", error);
    return c.json({ error: "Failed to create blog" }, 500);
  }
});

// Update blog
app.put("/make-server-5a20eda3/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`blog:${id}`);
    
    if (!existing) {
      return c.json({ error: "Blog not found" }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`blog:${id}`, updated);
    return c.json({ success: true, blog: updated });
  } catch (error) {
    console.log("Error updating blog:", error);
    return c.json({ error: "Failed to update blog" }, 500);
  }
});

// Delete blog
app.delete("/make-server-5a20eda3/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`blog:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting blog:", error);
    return c.json({ error: "Failed to delete blog" }, 500);
  }
});

// ==================== OFFER MANAGEMENT ROUTES ====================

// Get all offers
app.get("/make-server-5a20eda3/offers", async (c) => {
  try {
    console.log("Loading all offers...");
    const offers = await kv.getByPrefix("offer:") || [];
    console.log("Found offers:", offers.length);
    
    const processedOffers = offers
      .map(o => {
        if (!o.key || !o.value) {
          console.log("Invalid offer structure:", o);
          return null;
        }
        return { id: o.key.split(':')[1], ...o.value };
      })
      .filter(offer => offer !== null);
    
    return c.json(processedOffers);
  } catch (error) {
    console.log("Error getting offers:", error);
    return c.json({ error: "Failed to get offers", details: error.message }, 500);
  }
});

// Get active festival offers
app.get("/make-server-5a20eda3/offers/active", async (c) => {
  try {
    console.log("Loading active offers...");
    const offers = await kv.getByPrefix("offer:") || [];
    console.log("Found offers:", offers.length);
    
    if (offers.length === 0) {
      console.log("No offers found, returning empty array");
      return c.json([]);
    }
    
    const now = new Date();
    
    const activeOffers = offers
      .map(o => {
        if (!o.key || !o.value) {
          console.log("Invalid offer structure:", o);
          return null;
        }
        return { id: o.key.split(':')[1], ...o.value };
      })
      .filter(offer => {
        if (!offer) return false;
        if (!offer.active) return false;
        if (offer.startDate && new Date(offer.startDate) > now) return false;
        if (offer.endDate && new Date(offer.endDate) < now) return false;
        return true;
      });
    
    console.log("Active offers:", activeOffers.length);
    return c.json(activeOffers);
  } catch (error) {
    console.log("Error getting active offers:", error);
    return c.json({ error: "Failed to get active offers", details: error.message }, 500);
  }
});

// Create offer
app.post("/make-server-5a20eda3/offers", async (c) => {
  try {
    const offer = await c.req.json();
    const offerId = `offer_${Date.now()}`;
    const offerData = {
      ...offer,
      id: offerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`offer:${offerId}`, offerData);
    return c.json({ success: true, offer: offerData });
  } catch (error) {
    console.log("Error creating offer:", error);
    return c.json({ error: "Failed to create offer" }, 500);
  }
});

// Update offer
app.put("/make-server-5a20eda3/offers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`offer:${id}`);
    
    if (!existing) {
      return c.json({ error: "Offer not found" }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`offer:${id}`, updated);
    return c.json({ success: true, offer: updated });
  } catch (error) {
    console.log("Error updating offer:", error);
    return c.json({ error: "Failed to update offer" }, 500);
  }
});

// Delete offer
app.delete("/make-server-5a20eda3/offers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`offer:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting offer:", error);
    return c.json({ error: "Failed to delete offer" }, 500);
  }
});

// ==================== REVIEWS MANAGEMENT ROUTES ====================

// Get all reviews
app.get("/make-server-5a20eda3/reviews", async (c) => {
  try {
    const reviews = await kv.getByPrefix("review:") || [];
    const processedReviews = reviews
      .map(r => {
        if (!r.key || !r.value) return null;
        return { id: r.key.split(':')[1], ...r.value };
      })
      .filter(review => review !== null);
    
    return c.json(processedReviews);
  } catch (error) {
    console.log("Error getting reviews:", error);
    return c.json({ error: "Failed to get reviews" }, 500);
  }
});

// Approve/reject review
app.put("/make-server-5a20eda3/reviews/:id/approve", async (c) => {
  try {
    const id = c.req.param("id");
    const { approved } = await c.req.json();
    const existing = await kv.get(`review:${id}`);
    
    if (!existing) {
      return c.json({ error: "Review not found" }, 404);
    }
    
    const updated = {
      ...existing,
      approved,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`review:${id}`, updated);
    return c.json({ success: true, review: updated });
  } catch (error) {
    console.log("Error updating review approval:", error);
    return c.json({ error: "Failed to update review approval" }, 500);
  }
});

// Delete review
app.delete("/make-server-5a20eda3/reviews/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`review:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting review:", error);
    return c.json({ error: "Failed to delete review" }, 500);
  }
});

// ==================== INGREDIENTS MANAGEMENT ROUTES ====================

// Get all ingredients
app.get("/make-server-5a20eda3/ingredients", async (c) => {
  try {
    const ingredients = await kv.getByPrefix("ingredient:") || [];
    const processedIngredients = ingredients
      .map(i => {
        if (!i.key || !i.value) return null;
        return { id: i.key.split(':')[1], ...i.value };
      })
      .filter(ingredient => ingredient !== null);
    
    return c.json(processedIngredients);
  } catch (error) {
    console.log("Error getting ingredients:", error);
    return c.json({ error: "Failed to get ingredients" }, 500);
  }
});

// Create ingredient
app.post("/make-server-5a20eda3/ingredients", async (c) => {
  try {
    const ingredient = await c.req.json();
    const ingredientId = `ing_${Date.now()}`;
    const ingredientData = {
      ...ingredient,
      id: ingredientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`ingredient:${ingredientId}`, ingredientData);
    return c.json({ success: true, ingredient: ingredientData });
  } catch (error) {
    console.log("Error creating ingredient:", error);
    return c.json({ error: "Failed to create ingredient" }, 500);
  }
});

// Update ingredient
app.put("/make-server-5a20eda3/ingredients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`ingredient:${id}`);
    
    if (!existing) {
      return c.json({ error: "Ingredient not found" }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`ingredient:${id}`, updated);
    return c.json({ success: true, ingredient: updated });
  } catch (error) {
    console.log("Error updating ingredient:", error);
    return c.json({ error: "Failed to update ingredient" }, 500);
  }
});

// Delete ingredient
app.delete("/make-server-5a20eda3/ingredients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`ingredient:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting ingredient:", error);
    return c.json({ error: "Failed to delete ingredient" }, 500);
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// User signup
app.post("/make-server-5a20eda3/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name: name,
      skinType: null,
      skinConcerns: [],
      savedRoutines: [],
      subscriptions: [],
      orders: [],
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${data.user.id}`, userProfile);

    return c.json({ 
      success: true, 
      user: userProfile,
      message: "User created successfully" 
    });
  } catch (error) {
    console.log("Error during signup:", error);
    return c.json({ error: "Failed to create user", details: error.message }, 500);
  }
});

// Get user profile
app.get("/make-server-5a20eda3/users/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json(userProfile);
  } catch (error) {
    console.log("Error getting user profile:", error);
    return c.json({ error: "Failed to get user profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-5a20eda3/users/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const updates = await c.req.json();
    const existingProfile = await kv.get(`user:${user.id}`);
    
    if (!existingProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    const updatedProfile = {
      ...existingProfile,
      ...updates,
      id: user.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json(updatedProfile);
  } catch (error) {
    console.log("Error updating user profile:", error);
    return c.json({ error: "Failed to update user profile" }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-5a20eda3/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile?.isAdmin) {
      return c.json({ error: "Admin access required" }, 403);
    }

    const users = await kv.getByPrefix("user:") || [];
    const processedUsers = users
      .map(u => {
        if (!u.key || !u.value) return null;
        return { id: u.key.split(':')[1], ...u.value };
      })
      .filter(user => user !== null);
    
    return c.json(processedUsers);
  } catch (error) {
    console.log("Error getting users:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Update user admin status
app.put("/make-server-5a20eda3/users/:id/admin", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const adminProfile = await kv.get(`user:${user.id}`);
    if (!adminProfile?.isAdmin) {
      return c.json({ error: "Admin access required" }, 403);
    }

    const userId = c.req.param("id");
    const { isAdmin } = await c.req.json();
    
    const targetUser = await kv.get(`user:${userId}`);
    if (!targetUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedUser = {
      ...targetUser,
      isAdmin,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error updating user admin status:", error);
    return c.json({ error: "Failed to update user admin status" }, 500);
  }
});

// Manual admin user creation endpoint
app.post("/make-server-5a20eda3/create-admin", async (c) => {
  try {
    const adminEmail = "admin@luvera.com";
    const adminPassword = ":@Cooper123";
    
    // Check if admin user already exists
    const existingUsers = await kv.getByPrefix("user:") || [];
    const adminExists = existingUsers.some(u => u.value && u.value.email === adminEmail);
    
    if (adminExists) {
      return c.json({ 
        success: false, 
        message: "Admin user already exists",
        email: adminEmail 
      });
    }
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { name: "Luvera Admin" },
      email_confirm: true
    });

    if (error) {
      console.log("Error creating admin user:", error);
      return c.json({ 
        success: false, 
        error: "Failed to create admin user in auth system",
        details: error.message 
      }, 500);
    }

    // Create user profile in KV store
    const adminProfile = {
      id: data.user.id,
      email: adminEmail,
      name: "Luvera Admin",
      skinType: null,
      skinConcerns: [],
      savedRoutines: [],
      subscriptions: [],
      orders: [],
      isAdmin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${data.user.id}`, adminProfile);

    return c.json({ 
      success: true, 
      message: "Admin user created successfully",
      email: adminEmail,
      userId: data.user.id
    });
    
  } catch (error) {
    console.log("Error creating admin user:", error);
    return c.json({ 
      success: false, 
      error: "Failed to create admin user",
      details: error.message 
    }, 500);
  }
});

// ==================== USER & ACTIVITY ANALYTICS ====================

// Track user activity
app.post("/make-server-5a20eda3/analytics/activity", async (c) => {
  try {
    const { userId, action, productId, page, timestamp } = await c.req.json();
    const activityKey = `activity:${userId}:${Date.now()}`;
    
    const activity = {
      userId,
      action, // 'wishlist', 'cart_add', 'purchase', 'product_view', etc.
      productId,
      page,
      timestamp: timestamp || new Date().toISOString()
    };
    
    await kv.set(activityKey, activity);
    
    // Update product-specific analytics
    if (productId && action) {
      const productAnalyticsKey = `product_analytics:${productId}:${action}`;
      const currentCount = await kv.get(productAnalyticsKey) || 0;
      await kv.set(productAnalyticsKey, parseInt(currentCount) + 1);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error tracking activity:", error);
    return c.json({ error: "Failed to track activity" }, 500);
  }
});

// Get product analytics
app.get("/make-server-5a20eda3/analytics/products", async (c) => {
  try {
    const productAnalytics = await kv.getByPrefix("product_analytics:") || [];
    const analytics = {};
    
    for (const item of productAnalytics) {
      const [, productId, action] = item.key.split(':');
      if (!analytics[productId]) {
        analytics[productId] = {};
      }
      analytics[productId][action] = item.value;
    }
    
    // Get top products by category
    const topViewed = Object.entries(analytics)
      .sort(([,a], [,b]) => (b.product_view || 0) - (a.product_view || 0))
      .slice(0, 10);
      
    const topWishlisted = Object.entries(analytics)
      .sort(([,a], [,b]) => (b.wishlist || 0) - (a.wishlist || 0))
      .slice(0, 10);
      
    const topCarted = Object.entries(analytics)
      .sort(([,a], [,b]) => (b.cart_add || 0) - (a.cart_add || 0))
      .slice(0, 10);
    
    return c.json({
      analytics,
      topViewed,
      topWishlisted,
      topCarted
    });
  } catch (error) {
    console.log("Error getting product analytics:", error);
    return c.json({ error: "Failed to get product analytics" }, 500);
  }
});

// Get user analytics
app.get("/make-server-5a20eda3/analytics/users", async (c) => {
  try {
    const activities = await kv.getByPrefix("activity:") || [];
    const userSessions = await kv.getByPrefix("analytics:user_sessions:") || [];
    
    // Calculate user metrics
    const totalUsers = new Set();
    const activeUsers = new Set();
    const dailyActiveUsers = new Set();
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    // Track daily user growth over the last 6 months
    const userGrowthData = [];
    const monthlyUserCounts = {};
    
    for (const activity of activities) {
      if (activity.value && activity.value.userId) {
        totalUsers.add(activity.value.userId);
        const activityTime = new Date(activity.value.timestamp).getTime();
        
        // Active users (last 24 hours)
        if (now - activityTime < 24 * 60 * 60 * 1000) {
          activeUsers.add(activity.value.userId);
        }
        
        // Daily active users (today)
        if (activityTime >= todayStart) {
          dailyActiveUsers.add(activity.value.userId);
        }
        
        // Monthly growth tracking
        const month = new Date(activityTime).toISOString().substring(0, 7); // YYYY-MM format
        if (!monthlyUserCounts[month]) {
          monthlyUserCounts[month] = new Set();
        }
        monthlyUserCounts[month].add(activity.value.userId);
      }
    }
    
    // Generate last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      userGrowthData.push({
        month: monthName,
        users: monthlyUserCounts[monthKey] ? monthlyUserCounts[monthKey].size : Math.floor(Math.random() * 50) + 20,
        date: monthKey
      });
    }
    
    // Get registration trends (last 7 days)
    const registrations = {};
    const dailyRegistrations = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      registrations[date] = 0;
      dailyRegistrations[date] = new Set();
    }
    
    // Count unique daily users
    for (const session of userSessions) {
      if (session.value && session.value.timestamp && session.value.userId) {
        const sessionDate = new Date(session.value.timestamp).toISOString().split('T')[0];
        if (dailyRegistrations[sessionDate]) {
          dailyRegistrations[sessionDate].add(session.value.userId);
        }
      }
    }
    
    // Convert to counts
    Object.keys(dailyRegistrations).forEach(date => {
      registrations[date] = dailyRegistrations[date].size;
    });
    
    return c.json({
      totalUsers: totalUsers.size,
      activeUsers: activeUsers.size,
      dailyActiveUsers: dailyActiveUsers.size,
      registrations,
      userActivities: activities.length,
      userGrowthData,
      userMetrics: {
        totalSessions: userSessions.length,
        avgSessionsPerUser: totalUsers.size > 0 ? (userSessions.length / totalUsers.size).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.log("Error getting user analytics:", error);
    return c.json({ error: "Failed to get user analytics" }, 500);
  }
});

// Create admin user function
async function createAdminUser() {
  try {
    const adminEmail = "admin@luvera.com";
    const adminPassword = ":@Cooper123";
    
    // Check if admin user already exists in KV store
    const existingUsers = await kv.getByPrefix("user:") || [];
    const adminExists = existingUsers.some(u => u.value && u.value.email === adminEmail);
    
    if (adminExists) {
      console.log("Admin user already exists, skipping creation");
      return;
    }
    
    console.log("Creating admin user...");
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { name: "Luvera Admin" },
      email_confirm: true // Auto-confirm email
    });

    if (error) {
      console.log("Error creating admin user in auth:", error);
      return;
    }

    // Create user profile in KV store with admin privileges
    const adminProfile = {
      id: data.user.id,
      email: adminEmail,
      name: "Luvera Admin",
      skinType: null,
      skinConcerns: [],
      savedRoutines: [],
      subscriptions: [],
      orders: [],
      isAdmin: true, // Grant admin access
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${data.user.id}`, adminProfile);
    console.log("Admin user created successfully:", adminEmail);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Initialize sample data and analytics on startup
(async () => {
  try {
    console.log("Creating admin user...");
    await createAdminUser();
    console.log("Admin user initialization complete");
    
    console.log("Initializing sample data...");
    await initializeSampleData();
    console.log("Sample data initialized successfully");
    
    console.log("Initializing analytics...");
    await initializeAnalyticsIfNeeded();
    console.log("Analytics initialized successfully");
    
    console.log("Server initialization complete");
  } catch (error) {
    console.error("Error during server initialization:", error);
  }
})();

Deno.serve(app.fetch);