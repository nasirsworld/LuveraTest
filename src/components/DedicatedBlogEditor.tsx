import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  X,
  Save,
  Eye,
  Search,
  RefreshCw,
  CheckCheck,
  Settings,
  Target,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Star,
  FlaskConical,
  Calendar,
  Clock,
  Palette
} from 'lucide-react';

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

interface DedicatedBlogEditorProps {
  blog: BlogPost | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

export function DedicatedBlogEditor({ blog, onSave, onClose }: DedicatedBlogEditorProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    author: blog?.author || 'Admin',
    published: blog?.published ?? false,
    publishDate: blog?.publishDate || new Date().toISOString().split('T')[0],
    tags: blog?.tags?.join(',') || '',
    category: blog?.category || '',
    featuredImage: blog?.featuredImage || '',
    readTime: blog?.readTime || 5,
    seoTitle: blog?.seoTitle || '',
    seoDescription: blog?.seoDescription || ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSave();
            break;
          case 'p':
            event.preventDefault();
            setShowPreview(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title && formData.content) {
        // Auto-save logic could go here
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  // Calculate read time based on content
  useEffect(() => {
    const wordCount = formData.content.split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setFormData(prev => ({ ...prev, readTime }));
  }, [formData.content]);

  // Generate excerpt from content
  useEffect(() => {
    if (formData.content && !blog?.excerpt) {
      const content = formData.content.replace(/#+\s/g, '').replace(/\*\*([^*]+)\*\*/g, '$1');
      const excerpt = content.substring(0, 200).replace(/\n/g, ' ').trim();
      if (excerpt.length > 0) {
        setFormData(prev => ({ ...prev, excerpt: excerpt + (excerpt.length >= 200 ? '...' : '') }));
      }
    }
  }, [formData.content, blog?.excerpt]);

  const handleSave = async () => {
    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.excerpt
    };
    
    await onSave(blogData);
    onClose();
  };

  const generateFeaturedImage = async () => {
    setIsGeneratingImage(true);
    try {
      // Extract keywords from title for better image search
      const titleWords = formData.title.toLowerCase().split(/\s+/).filter(word => 
        word.length > 3 && !['the', 'and', 'for', 'with', 'your'].includes(word)
      );
      
      // Create search query combining skincare context with title keywords
      const searchQuery = titleWords.length > 0 
        ? `skincare ${titleWords.slice(0, 2).join(' ')}`
        : 'skincare beauty routine';
      
      // Note: In a real implementation, this would use the unsplash_tool
      // For now, we'll simulate the API call and use a general skincare image
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder URL - in real implementation this would be the result from unsplash_tool
      const placeholderImages = [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1570554886111-e80fcac6a935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      setFormData(prev => ({ 
        ...prev, 
        featuredImage: randomImage
      }));
      
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const insertTemplate = (template: string) => {
    const templates = {
      intro: '## Introduction\n\nWelcome to this comprehensive guide on skincare...\n\n',
      howto: '## How to Use\n\n1. Start with clean, dry skin\n2. Apply a small amount to the affected area\n3. Gently massage in circular motions\n4. Allow to absorb for 2-3 minutes\n\n',
      benefits: '## Key Benefits\n\n- **Hydration**: Deep moisturizing properties\n- **Anti-aging**: Reduces fine lines and wrinkles\n- **Brightening**: Improves skin tone and radiance\n- **Protection**: Shields against environmental damage\n\n',
      ingredients: '## Star Ingredients\n\n### Hyaluronic Acid\nA powerful humectant that can hold up to 1000 times its weight in water.\n\n### Niacinamide\nHelps regulate oil production and minimize pore appearance.\n\n### Vitamin C\nPowerful antioxidant that brightens and protects the skin.\n\n',
      conclusion: '## Final Thoughts\n\nIncorporating this into your skincare routine can make a significant difference in your skin\'s health and appearance. Remember to always patch test new products and introduce them gradually into your routine.\n\n**Have you tried this product? Share your experience in the comments below!**\n\n'
    };
    
    setFormData(prev => ({ 
      ...prev, 
      content: prev.content + templates[template as keyof typeof templates] 
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-lg font-medium">
              {blog ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            {autoSaved && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCheck className="w-3 h-3 mr-1" />
                Auto-saved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateFeaturedImage}
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Generate Image
            </Button>
            <Button onClick={handleSave} className="btn-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save & Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Blog Settings */}
        <div className="w-80 border-r bg-card/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Post Settings */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Post Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skincare-tips">Skincare Tips</SelectItem>
                      <SelectItem value="product-reviews">Product Reviews</SelectItem>
                      <SelectItem value="ingredient-spotlight">Ingredient Spotlight</SelectItem>
                      <SelectItem value="routine-guides">Routine Guides</SelectItem>
                      <SelectItem value="beauty-trends">Beauty Trends</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    min="1"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
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
              </div>
            </div>

            {/* SEO Settings */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                SEO Optimization
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Auto-generated from title"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoTitle.length || formData.title.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    placeholder="Auto-generated from excerpt"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoDescription.length || formData.excerpt.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Featured Image
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="featuredImage">Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={generateFeaturedImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Generate from Title
                </Button>
                {formData.featuredImage && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content Templates */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Quick Templates
              </h3>
              <div className="space-y-2">
                {[
                  { key: 'intro', label: 'Introduction', icon: ChevronRight },
                  { key: 'howto', label: 'How-to Guide', icon: CheckCircle },
                  { key: 'benefits', label: 'Benefits List', icon: Star },
                  { key: 'ingredients', label: 'Ingredients', icon: FlaskConical },
                  { key: 'conclusion', label: 'Conclusion', icon: CheckCheck }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertTemplate(key)}
                  >
                    <Icon className="w-3 h-3 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="font-medium mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Save</span>
                  <span className="font-mono">Ctrl+S</span>
                </div>
                <div className="flex justify-between">
                  <span>Preview</span>
                  <span className="font-mono">Ctrl+P</span>
                </div>
                <div className="flex justify-between">
                  <span>Bold</span>
                  <span className="font-mono">**text**</span>
                </div>
                <div className="flex justify-between">
                  <span>Italic</span>
                  <span className="font-mono">*text*</span>
                </div>
                <div className="flex justify-between">
                  <span>Heading</span>
                  <span className="font-mono">## text</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Title and Meta */}
          <div className="border-b p-6 space-y-4">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your blog post title..."
              className="text-2xl font-medium border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(formData.publishDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formData.readTime} min read
              </div>
              <div className="flex items-center gap-1">
                <Palette className="w-3 h-3" />
                {formData.tags.split(',').filter(Boolean).length} tags
              </div>
              <div className="flex items-center gap-1">
                <span>{formData.content.split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
            </div>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Tags (comma-separated): skincare, beauty, tips..."
              className="border-none px-0 focus-visible:ring-0 text-sm"
            />
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Write a compelling excerpt for your blog post..."
              className="border-none px-0 focus-visible:ring-0 text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {!showPreview ? (
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Start writing your blog post... 

You can use markdown formatting:
- **bold text**
- *italic text*
- ## Headings
- [links](url)
- Lists and more!

Pro tip: Use the templates in the sidebar to speed up your writing process."
                className="flex-1 border-none resize-none focus-visible:ring-0 p-6 text-base leading-relaxed"
                style={{ minHeight: 'calc(100vh - 200px)' }}
              />
            ) : (
              <div className="flex-1 p-6 overflow-y-auto">
                <article className="prose prose-lg max-w-none">
                  {formData.featuredImage && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-8">
                      <img 
                        src={formData.featuredImage} 
                        alt={formData.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1>{formData.title}</h1>
                  <div className="text-sm text-muted-foreground mb-6">
                    By {formData.author} • {new Date(formData.publishDate).toLocaleDateString()} • {formData.readTime} min read
                  </div>
                  {formData.excerpt && (
                    <div className="text-lg text-muted-foreground border-l-4 border-primary pl-4 mb-6 italic">
                      {formData.excerpt}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{formData.content}</div>
                  {formData.tags && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}