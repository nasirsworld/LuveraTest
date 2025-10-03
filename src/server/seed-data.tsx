// This file contains sample data for testing the admin dashboard
// In a real application, this would be populated through the admin interface

import * as kv from "./kv_store.tsx";

export async function seedSampleData() {
  try {
    // Sample products
    const sampleProducts = [
      {
        id: 'prod_1',
        name: 'Vitamin C Brightening Serum',
        price: 45,
        category: 'skincare',
        description: 'A powerful vitamin C serum that brightens skin and reduces dark spots.',
        images: ['https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYm90dGxlcyUyMHNlcnVtfGVufDF8fHx8MTc1OTM3MzExMXww&ixlib=rb-4.1.0&q=80&w=1080'],
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod_2',
        name: 'Hydrating Night Cream',
        price: 38,
        category: 'skincare',
        description: 'A rich night cream that deeply hydrates and repairs skin while you sleep.',
        images: ['https://images.unsplash.com/photo-1729324738509-7935838d5ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmUlMjBpbmdyZWRpZW50cyUyMHBsYW50c3xlbnwxfHx8fDE3NTkzNzMxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample blog posts
    const sampleBlogs = [
      {
        id: 'blog_1',
        title: 'The Complete Guide to Vitamin C in Skincare',
        content: 'Vitamin C is one of the most powerful ingredients in skincare. This essential antioxidant helps protect your skin from environmental damage, reduces signs of aging, and promotes a brighter, more even complexion. Here\'s everything you need to know about incorporating vitamin C into your routine for maximum benefits. Start with a lower concentration (10-15%) and gradually work your way up. Always use sunscreen when using vitamin C products, as they can increase photosensitivity.',
        excerpt: 'Discover the benefits of vitamin C and how to use it effectively in your skincare routine for brighter, healthier skin.',
        author: 'Dr. Sarah Johnson',
        published: true,
        publishDate: new Date().toISOString().split('T')[0],
        tags: ['vitamin-c', 'skincare', 'ingredients', 'anti-aging'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'blog_2',
        title: 'Winter Skincare Essentials: Keep Your Skin Glowing',
        content: 'Winter weather can be harsh on your skin, causing dryness, irritation, and dullness. Learn the essential steps to maintain healthy, glowing skin during the colder months. Focus on hydration, gentle cleansing, and protective barriers to keep your skin looking its best all season long.',
        excerpt: 'Essential tips and products to maintain healthy, hydrated skin during the harsh winter months.',
        author: 'Emma Chen',
        published: true,
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        tags: ['winter-skincare', 'hydration', 'seasonal', 'tips'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample offers
    const sampleOffers = [
      {
        id: 'offer_1',
        title: 'Winter Glow Sale - Up to 30% Off',
        description: 'Transform your winter skincare routine with our premium collection. Limited time festive offer!',
        discount: 30,
        image: 'https://images.unsplash.com/photo-1571513138419-0b5904c7d161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBza2luY2FyZSUyMHNhbGUlMjBmZXN0aXZlfGVufDF8fHx8MTc1OTM4ODA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        active: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        buttonText: 'Shop Winter Collection',
        buttonLink: '/shop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'offer_2',
        title: 'Golden Hour Glow - 25% Off Serums',
        description: 'Achieve that perfect golden hour glow! Get 25% off all our premium vitamin C serums and treatments.',
        discount: 25,
        image: 'https://images.unsplash.com/photo-1707300235308-ab312f702683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBza2luY2FyZSUyMHNlcnVtJTIwZ2xvd3xlbnwxfHx8fDE3NTkzODgwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        active: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        buttonText: 'Get Golden Glow',
        buttonLink: '/shop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Store sample data
    console.log('Storing sample products...');
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product);
      console.log(`Stored product: ${product.id}`);
    }

    console.log('Storing sample blogs...');
    for (const blog of sampleBlogs) {
      await kv.set(`blog:${blog.id}`, blog);
      console.log(`Stored blog: ${blog.id}`);
    }

    console.log('Storing sample offers...');
    for (const offer of sampleOffers) {
      await kv.set(`offer:${offer.id}`, offer);
      console.log(`Stored offer: ${offer.id}`);
    }

    console.log('Sample data seeded successfully');
    
    return {
      productsCount: sampleProducts.length,
      blogsCount: sampleBlogs.length,
      offersCount: sampleOffers.length
    };
  } catch (error) {
    console.error('Error seeding sample data:', error);
    throw error;
  }
}

// Initialize sample data
export async function initializeSampleData() {
  try {
    console.log('Checking for existing data...');
    
    // Check if data already exists
    const existingProducts = await kv.getByPrefix("product:") || [];
    console.log(`Found ${existingProducts.length} existing products`);
    
    if (existingProducts.length === 0) {
      console.log('No existing data found, seeding sample data...');
      const result = await seedSampleData();
      console.log('Sample data seeded successfully:', result);
      return result;
    } else {
      console.log('Sample data already exists, skipping seed');
      return { 
        productsCount: existingProducts.length, 
        blogsCount: 0, 
        offersCount: 0, 
        skipped: true 
      };
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}