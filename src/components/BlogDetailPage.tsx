import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark, Heart, MessageCircle, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogDetailPageProps {
  navigateTo: (page: string, data?: any) => void;
  appState: {
    selectedBlogPost?: any;
  };
}

export function BlogDetailPage({ navigateTo, appState }: BlogDetailPageProps) {
  const post = appState.selectedBlogPost;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentName, setNewCommentName] = useState('');

  useEffect(() => {
    if (post) {
      // Check if post is bookmarked
      const bookmarkedPosts = JSON.parse(localStorage.getItem('luvera-bookmarked-posts') || '[]');
      setIsBookmarked(bookmarkedPosts.includes(post.id));
      
      // Mock like count and comments
      setLikeCount(Math.floor(Math.random() * 100) + 20);
      setComments([
        {
          id: '1',
          name: 'Sarah Wilson',
          comment: 'This article was so helpful! I\'ve been struggling with my morning routine and this gave me the structure I needed.',
          timestamp: '2 hours ago',
          likes: 5
        },
        {
          id: '2', 
          name: 'Mike Chen',
          comment: 'Love the product recommendations. The Vitamin C serum mentioned here has been amazing for my skin.',
          timestamp: '1 day ago',
          likes: 3
        },
        {
          id: '3',
          name: 'Jessica Taylor',
          comment: 'Thank you Dr. Johnson for breaking this down so clearly. Finally understand the science behind it!',
          timestamp: '3 days ago',
          likes: 8
        }
      ]);
    }
  }, [post]);

  const toggleBookmark = () => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem('luvera-bookmarked-posts') || '[]');
    const updatedBookmarks = isBookmarked
      ? bookmarkedPosts.filter((id: string) => id !== post.id)
      : [...bookmarkedPosts, post.id];
    
    localStorage.setItem('luvera-bookmarked-posts', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && newCommentName.trim()) {
      const comment = {
        id: Date.now().toString(),
        name: newCommentName,
        comment: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setNewCommentName('');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Blog post not found</h2>
          <Button onClick={() => navigateTo('blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Extended content for the blog post
  const getFullContent = (postId: string) => {
    const contents: { [key: string]: string } = {
      '1': `
        <p>Vitamin C is one of the most powerful antioxidants in skincare, and for good reason. This powerhouse ingredient has been scientifically proven to brighten skin, boost collagen production, and protect against environmental damage.</p>
        
        <h3>What Makes Vitamin C So Special?</h3>
        <p>L-Ascorbic Acid, the purest form of Vitamin C, works at the cellular level to neutralize free radicals that cause premature aging. When applied topically, it penetrates the skin to stimulate collagen synthesis, resulting in firmer, more youthful-looking skin.</p>
        
        <h3>Key Benefits of Vitamin C:</h3>
        <ul>
          <li><strong>Brightening:</strong> Inhibits melanin production to fade dark spots and even skin tone</li>
          <li><strong>Anti-aging:</strong> Stimulates collagen production to reduce fine lines and wrinkles</li>
          <li><strong>Protection:</strong> Acts as a shield against UV damage and pollution</li>
          <li><strong>Healing:</strong> Accelerates wound healing and reduces inflammation</li>
        </ul>
        
        <h3>How to Use Vitamin C</h3>
        <p>For best results, apply Vitamin C serum in the morning after cleansing but before moisturizer and sunscreen. Start with a lower concentration (10-15%) and gradually increase as your skin builds tolerance.</p>
        
        <h3>Choosing the Right Vitamin C Product</h3>
        <p>Look for products in dark, air-tight packaging to prevent oxidation. The most effective forms include L-Ascorbic Acid, Magnesium Ascorbyl Phosphate, and Sodium Ascorbyl Phosphate.</p>
        
        <p>Remember, consistency is key with Vitamin C. With regular use, you'll notice brighter, more radiant skin in just 4-6 weeks.</p>
      `,
      '2': `
        <p>Your morning skincare routine sets the foundation for healthy skin throughout the day. A well-structured routine not only protects your skin from environmental stressors but also prepares it to look its best.</p>
        
        <h3>The Perfect Morning Routine: Step by Step</h3>
        
        <h4>Step 1: Gentle Cleansing</h4>
        <p>Start with a gentle, pH-balanced cleanser to remove overnight buildup without stripping your skin's natural barrier. Avoid harsh scrubs in the morning as your skin is most sensitive upon waking.</p>
        
        <h4>Step 2: Toning (Optional)</h4>
        <p>If you use a toner, choose one that balances your skin's pH and provides light hydration. Skip alcohol-based toners which can be drying.</p>
        
        <h4>Step 3: Vitamin C Serum</h4>
        <p>Apply a Vitamin C serum to brighten skin and provide antioxidant protection against free radical damage from pollution and UV exposure.</p>
        
        <h4>Step 4: Moisturizer</h4>
        <p>Choose a moisturizer appropriate for your skin type. Even oily skin needs hydration to maintain its barrier function.</p>
        
        <h4>Step 5: Sunscreen (Non-negotiable!)</h4>
        <p>Always finish with broad-spectrum SPF 30 or higher. This is the most important step for preventing premature aging and skin cancer.</p>
        
        <h3>Timing Tips</h3>
        <p>Allow 2-3 minutes between each step for products to absorb properly. Your entire routine should take 5-10 minutes maximum.</p>
        
        <h3>Common Mistakes to Avoid</h3>
        <ul>
          <li>Over-cleansing or using harsh products</li>
          <li>Skipping sunscreen on cloudy days</li>
          <li>Using too many active ingredients at once</li>
          <li>Not giving products time to absorb</li>
        </ul>
      `,
      '3': `
        <p>Understanding your skin type is the foundation of effective skincare. Many people misidentify their skin type, leading to ineffective routines and frustrated results.</p>
        
        <h3>The Five Main Skin Types</h3>
        
        <h4>Normal Skin</h4>
        <p>Balanced moisture and oil production, small pores, few imperfections. This skin type is relatively low-maintenance but still benefits from proper care.</p>
        
        <h4>Dry Skin</h4>
        <p>Lacks oil and/or water, may feel tight, rough, or flaky. Often has small pores and may be prone to fine lines.</p>
        
        <h4>Oily Skin</h4>
        <p>Produces excess sebum, appears shiny, has enlarged pores and is prone to blackheads and acne. However, it tends to age more slowly.</p>
        
        <h4>Combination Skin</h4>
        <p>Features both oily and dry areas, typically with an oily T-zone (forehead, nose, chin) and drier cheeks.</p>
        
        <h4>Sensitive Skin</h4>
        <p>Reacts easily to products or environmental factors, may experience redness, burning, or stinging sensations.</p>
        
        <h3>How to Determine Your Skin Type</h3>
        <p>The "Bare Face Test": Cleanse your face and leave it bare for one hour. Observe how your skin feels and looks.</p>
        
        <h3>Skin Type vs. Skin Conditions</h3>
        <p>Remember that skin type is largely genetic and consistent, while skin conditions (like acne, rosacea, or dehydration) can be temporary and treatable.</p>
        
        <h3>Tailoring Your Routine</h3>
        <p>Once you know your skin type, you can choose products and ingredients that work best for your specific needs, leading to healthier, happier skin.</p>
      `,
      '4': `
        <p>Hyaluronic acid has become a skincare superstar, but what makes it so special? This naturally occurring substance can hold up to 1,000 times its weight in water, making it one of the most effective hydrating ingredients available.</p>
        
        <h3>What is Hyaluronic Acid?</h3>
        <p>Hyaluronic acid (HA) is a glycosaminoglycan, a type of molecule that occurs naturally in our bodies. It's found in high concentrations in our skin, joints, and eyes, where it helps maintain moisture and cushioning.</p>
        
        <h3>How Does It Work?</h3>
        <p>HA works by attracting and binding water molecules to the skin's surface and deeper layers. This creates a moisture reservoir that keeps skin plump, smooth, and hydrated throughout the day.</p>
        
        <h3>Different Types of Hyaluronic Acid</h3>
        <ul>
          <li><strong>High Molecular Weight HA:</strong> Forms a film on skin's surface for immediate hydration</li>
          <li><strong>Low Molecular Weight HA:</strong> Penetrates deeper into skin for long-lasting moisture</li>
          <li><strong>Sodium Hyaluronate:</strong> A salt form that's more stable and penetrates easier</li>
        </ul>
        
        <h3>Benefits for All Skin Types</h3>
        <p>Unlike many skincare ingredients, hyaluronic acid is suitable for all skin types:</p>
        <ul>
          <li>Dry skin: Provides intense hydration without greasiness</li>
          <li>Oily skin: Hydrates without clogging pores</li>
          <li>Sensitive skin: Generally well-tolerated and non-irritating</li>
          <li>Aging skin: Plumps fine lines and restores bounce</li>
        </ul>
        
        <h3>How to Use Hyaluronic Acid</h3>
        <p>Apply to damp skin and follow with a moisturizer to seal in the hydration. This helps prevent the HA from drawing moisture from deeper skin layers.</p>
      `,
      '5': `
        <p>Even with the best intentions, we sometimes make mistakes in our skincare routine that can sabotage our results. Here are the most common pitfalls and how to avoid them.</p>
        
        <h3>Mistake #1: Over-Exfoliating</h3>
        <p>Using scrubs daily or combining multiple exfoliating acids can damage your skin barrier, leading to irritation, dryness, and increased sensitivity.</p>
        <p><strong>Fix:</strong> Limit physical exfoliation to 1-2 times per week and chemical exfoliation to 2-3 times per week, depending on your skin type.</p>
        
        <h3>Mistake #2: Skipping Sunscreen</h3>
        <p>UV damage is the leading cause of premature aging and skin cancer. Many people skip sunscreen on cloudy days or when staying indoors.</p>
        <p><strong>Fix:</strong> Apply broad-spectrum SPF 30+ daily, regardless of weather or plans. Reapply every 2 hours if you're outdoors.</p>
        
        <h3>Mistake #3: Using Too Many Products</h3>
        <p>More isn't always better. Using too many active ingredients can overwhelm your skin and cause irritation.</p>
        <p><strong>Fix:</strong> Start with a basic routine (cleanser, moisturizer, sunscreen) and gradually introduce new products one at a time.</p>
        
        <h3>Mistake #4: Not Patch Testing</h3>
        <p>Jumping straight into using a new product on your entire face can lead to reactions and breakouts.</p>
        <p><strong>Fix:</strong> Always patch test new products on a small area for 24-48 hours before full application.</p>
        
        <h3>Mistake #5: Inconsistent Application</h3>
        <p>Skincare results require consistency. Using products sporadically won't deliver the benefits you're looking for.</p>
        <p><strong>Fix:</strong> Stick to your routine for at least 6-8 weeks to see real results.</p>
        
        <h3>Mistake #6: Wrong Product Order</h3>
        <p>Applying products in the wrong order can reduce their effectiveness.</p>
        <p><strong>Fix:</strong> Apply products from thinnest to thickest consistency: toner, serum, moisturizer, oil, sunscreen.</p>
      `,
      '6': `
        <p>Your skin's needs change with the seasons, and your routine should adapt accordingly. Understanding these changes helps maintain healthy, comfortable skin year-round.</p>
        
        <h3>Spring Skincare</h3>
        <p>As temperatures rise and humidity increases, your skin may produce more oil. This is also allergy season, which can trigger sensitivity.</p>
        <p><strong>Adjustments:</strong></p>
        <ul>
          <li>Switch to a lighter moisturizer</li>
          <li>Introduce gentle exfoliation to remove winter buildup</li>
          <li>Increase antioxidant protection</li>
          <li>Consider products with anti-inflammatory ingredients</li>
        </ul>
        
        <h3>Summer Skincare</h3>
        <p>Heat, humidity, and increased sun exposure require more protection and oil control.</p>
        <p><strong>Adjustments:</strong></p>
        <ul>
          <li>Use gel-based or lightweight moisturizers</li>
          <li>Increase SPF to 50+ and reapply frequently</li>
          <li>Include products with niacinamide for oil control</li>
          <li>Stay hydrated and use hydrating mists</li>
        </ul>
        
        <h3>Fall Skincare</h3>
        <p>Decreasing humidity and temperature changes can start to dry out your skin.</p>
        <p><strong>Adjustments:</strong></p>
        <ul>
          <li>Gradually introduce richer moisturizers</li>
          <li>Start using more hydrating serums</li>
          <li>Consider beginning retinol treatments</li>
          <li>Repair summer sun damage with vitamin C</li>
        </ul>
        
        <h3>Winter Skincare</h3>
        <p>Cold air, low humidity, and indoor heating can severely dehydrate skin.</p>
        <p><strong>Adjustments:</strong></p>
        <ul>
          <li>Switch to cream-based cleansers</li>
          <li>Use heavier moisturizers and face oils</li>
          <li>Add a humidifier to your bedroom</li>
          <li>Focus on barrier repair ingredients</li>
        </ul>
        
        <h3>Year-Round Essentials</h3>
        <p>Some things never change: daily sunscreen, gentle cleansing, and consistent moisturizing remain important regardless of season.</p>
      `
    };
    
    return contents[postId] || post.content;
  };

  // Related posts (mock data)
  const relatedPosts = [
    {
      id: 'related-1',
      title: 'The Ultimate Guide to Retinol',
      excerpt: 'Everything you need to know about incorporating retinol into your routine.',
      image: 'https://images.unsplash.com/photo-1729324738509-7935838d5ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmUlMjBpbmdyZWRpZW50cyUyMHBsYW50c3xlbnwxfHx8fDE3NTkzNzMxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Ingredients',
      readTime: '8 min read'
    },
    {
      id: 'related-2',
      title: 'Building an Evening Skincare Routine',
      excerpt: 'Maximize your skin\'s overnight repair with the perfect PM routine.',
      image: 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYm90dGxlcyUyMHNlcnVtfGVufDF8fHx8MTc1OTM3MzExMXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Routines',
      readTime: '6 min read'
    },
    {
      id: 'related-3',
      title: 'Skincare Ingredients That Don\'t Mix',
      excerpt: 'Learn which ingredients to avoid combining to prevent skin irritation.',
      image: 'https://images.unsplash.com/photo-1620334267407-30621bae1d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBiZWF1dHklMjBtb2RlbHxlbnwxfHx8fDE3NTkzNzMxMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Education',
      readTime: '5 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-sm border-b sticky top-16 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigateTo('blog')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </motion.div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={toggleBookmark}>
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleLike}>
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              {likeCount}
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {comments.length} Comments
            </Button>
          </div>
          
          <Separator />
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: getFullContent(post.id) }}
        />

        <Separator className="my-12" />

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {post.author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">About {post.author}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {post.author.startsWith('Dr.') 
                      ? 'Board-certified dermatologist with over 10 years of experience in clinical skincare and cosmetic dermatology.'
                      : 'Licensed esthetician and skincare specialist passionate about helping people achieve their best skin through education and proper product selection.'
                    }
                  </p>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Recommendations */}
        {post.productRecommendations && post.productRecommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-12"
          >
            <h2 className="text-2xl mb-6">Recommended Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.productRecommendations.map((product: any, index: number) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <Badge variant="secondary" className="text-xs">{product.price}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 capitalize">{product.category}</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      Shop Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        <Separator className="my-12" />

        {/* Comments Section */}
        <motion.section
          id="comments-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl mb-6">Comments ({comments.length})</h2>
          
          {/* Add Comment Form */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-4">Join the conversation</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || !newCommentName.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                          {comment.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium">{comment.name}</h4>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{comment.comment}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Separator className="my-12" />

        {/* Related Posts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => navigateTo('blog-detail', { blogPost: relatedPost })}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <ImageWithFallback
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="text-sm mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {relatedPost.readTime}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </article>
    </div>
  );
}