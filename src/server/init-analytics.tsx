// Initialize sample analytics data for demonstration
import * as kv from "./kv_store.tsx";

export async function initializeSampleAnalytics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Sample page views
    const pageViews = [
      { page: 'home', date: today, views: 156 },
      { page: 'shop', date: today, views: 89 },
      { page: 'product', date: today, views: 67 },
      { page: 'quiz', date: today, views: 34 },
      { page: 'offers', date: today, views: 23 },
      { page: 'home', date: yesterday, views: 142 },
      { page: 'shop', date: yesterday, views: 78 },
      { page: 'product', date: yesterday, views: 56 },
      { page: 'quiz', date: yesterday, views: 29 },
      { page: 'offers', date: yesterday, views: 18 }
    ];

    // Set page view analytics
    for (const pv of pageViews) {
      const key = `analytics:page_views:${pv.page}:${pv.date}`;
      await kv.set(key, pv.views);
    }

    // Sample user sessions
    const sampleUsers = ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now - Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const userId = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const pages = ['home', 'shop', 'product', 'quiz', 'offers'];
      const page = pages[Math.floor(Math.random() * pages.length)];
      
      const sessionKey = `analytics:user_sessions:${userId}:${timestamp}`;
      await kv.set(sessionKey, { page, timestamp, userId });
    }

    // Sample product analytics
    const products = ['prod_1', 'prod_2'];
    const actions = ['product_view', 'wishlist', 'cart_add'];
    
    for (const productId of products) {
      for (const action of actions) {
        const count = Math.floor(Math.random() * 50) + 10;
        const key = `product_analytics:${productId}:${action}`;
        await kv.set(key, count);
      }
    }

    // Sample user activities
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      const userId = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const productId = products[Math.floor(Math.random() * products.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const pages = ['home', 'shop', 'product'];
      const page = pages[Math.floor(Math.random() * pages.length)];
      
      const activityKey = `activity:${userId}:${now + i}`;
      await kv.set(activityKey, {
        userId,
        action,
        productId,
        page,
        timestamp
      });
    }

    // Sample reviews
    const sampleReviews = [
      { userId: 'user_1', productId: 'prod_1', rating: 5, title: 'Amazing product!', content: 'This serum has transformed my skin. Highly recommend!', approved: true },
      { userId: 'user_2', productId: 'prod_1', rating: 4, title: 'Great results', content: 'Saw improvement after 2 weeks of use.', approved: true },
      { userId: 'user_3', productId: 'prod_2', rating: 5, title: 'Love it!', content: 'Perfect for my sensitive skin.', approved: false },
      { userId: 'user_4', productId: 'prod_2', rating: 3, title: 'Good but expensive', content: 'Works well but price is high.', approved: true },
    ];

    for (let i = 0; i < sampleReviews.length; i++) {
      const review = sampleReviews[i];
      const reviewId = `rev_${Date.now()}_${i}`;
      await kv.set(`review:${reviewId}`, {
        id: reviewId,
        ...review,
        timestamp: new Date(now - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulVotes: Math.floor(Math.random() * 10)
      });
    }

    // Sample ingredients
    const sampleIngredients = [
      {
        name: 'Hyaluronic Acid',
        description: 'A powerful humectant that can hold up to 1000 times its weight in water.',
        benefits: ['Deep hydration', 'Plumps fine lines', 'Improves skin texture'],
        category: 'Hydrating',
        concentration: '1-2%'
      },
      {
        name: 'Niacinamide',
        description: 'Also known as Vitamin B3, helps improve skin barrier function.',
        benefits: ['Reduces pore appearance', 'Controls oil production', 'Evens skin tone'],
        category: 'Treatment',
        concentration: '5-10%'
      },
      {
        name: 'Retinol',
        description: 'A form of Vitamin A that promotes cell turnover.',
        benefits: ['Anti-aging', 'Improves skin texture', 'Reduces fine lines'],
        category: 'Anti-aging',
        concentration: '0.25-1%',
        contraindications: 'Not suitable for pregnancy or breastfeeding'
      },
      {
        name: 'Vitamin C',
        description: 'A potent antioxidant that brightens and protects skin.',
        benefits: ['Brightening', 'Antioxidant protection', 'Collagen synthesis'],
        category: 'Antioxidant',
        concentration: '10-20%'
      }
    ];

    for (let i = 0; i < sampleIngredients.length; i++) {
      const ingredient = sampleIngredients[i];
      const ingredientId = `ing_${Date.now()}_${i}`;
      await kv.set(`ingredient:${ingredientId}`, {
        id: ingredientId,
        ...ingredient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    console.log('Sample analytics data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing sample analytics:', error);
    return false;
  }
}

// Initialize analytics data on first run
export async function initializeAnalyticsIfNeeded() {
  try {
    // Check if analytics data already exists
    const existingAnalytics = await kv.getByPrefix("analytics:page_views:") || [];
    
    if (existingAnalytics.length === 0) {
      console.log('No existing analytics data found, initializing sample data...');
      await initializeSampleAnalytics();
    } else {
      console.log('Analytics data already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error checking analytics data:', error);
  }
}