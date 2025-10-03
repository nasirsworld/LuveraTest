import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ArrowRight, Search, Filter, Bookmark, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface BlogPageProps {
  navigateTo: (page: string, data?: any) => void;
}

export function BlogPage({ navigateTo }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(() => {
    const saved = localStorage.getItem('luvera-bookmarked-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog posts from backend
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/blogs`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match expected format
          const transformedPosts = data
            .filter((post: any) => post.published) // Only show published posts
            .map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              image: 'https://images.unsplash.com/photo-1729324738509-7935838d5ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmUlMjBpbmdyZWRpZW50cyUyMHBsYW50c3xlbnwxfHx8fDE3NTkzNzMxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
              author: post.author,
              publishedAt: post.publishDate || new Date().toISOString(),
              readTime: `${Math.ceil(post.content.split(' ').length / 200)} min read`,
              category: 'Skincare',
              tags: post.tags || [],
              featured: false,
              productRecommendations: []
            }));
          setPosts(transformedPosts);
        } else {
          console.error('Failed to fetch blog posts');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Bookmark functionality
  const toggleBookmark = (postId: string) => {
    const updatedBookmarks = bookmarkedPosts.includes(postId)
      ? bookmarkedPosts.filter(id => id !== postId)
      : [...bookmarkedPosts, postId];
    
    setBookmarkedPosts(updatedBookmarks);
    localStorage.setItem('luvera-bookmarked-posts', JSON.stringify(updatedBookmarks));
  };

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        // Mock popularity based on read time and featured status
        filtered.sort((a, b) => {
          const aScore = (a.featured ? 100 : 0) + parseInt(a.readTime);
          const bScore = (b.featured ? 100 : 0) + parseInt(b.readTime);
          return bScore - aScore;
        });
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  const categories = ['All', 'Skincare', 'Ingredients', 'Routines', 'Education', 'Tips', 'Bookmarked'];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl mb-4">Skincare Journal</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert tips, ingredient guides, and the latest in skincare science to help you achieve your best skin.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <ImageWithFallback
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-3">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-fit"
                    onClick={() => navigateTo('blog-detail', { blogPost: featuredPost })}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles, ingredients, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                    : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="text-center text-sm text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </div>
          )}
        </motion.div>

        {/* Blog Posts Grid or No Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            </div>
          ) : regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  {posts.length === 0 
                    ? "Articles will appear here once they are published by the admin."
                    : "Try different keywords or browse all categories to discover our skincare insights."
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={() => navigateTo('blog-detail', { blogPost: post })}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3"
                      >
                        {post.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 p-1 h-auto bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(post.id);
                        }}
                      >
                        <Bookmark 
                          className={`w-4 h-4 ${bookmarkedPosts.includes(post.id) 
                            ? 'fill-pink-500 text-pink-500' 
                            : 'text-gray-600'
                          }`} 
                        />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="mb-3 line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            {post.tags && post.tags.length > 0 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                {post.tags[0]}
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateTo('blog-detail', { blogPost: post });
                            }}
                          >
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest skincare tips and product updates delivered to your inbox
          </p>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
            Subscribe to Newsletter
          </Button>
        </motion.div>
      </div>
    </div>
  );
}