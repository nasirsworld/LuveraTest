import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Package, Plus, Trash2, Save, FileText, Image, DollarSign, Tag, Clock, Users, Star, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useUser } from './UserContext';
import { useMobile } from '../hooks/useMobile';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Ingredient {
  id: string;
  name: string;
  concentration?: string;
  purpose: string;
  benefits: string[];
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  skinTypes: string[];
  skinConcerns: string[];
  ingredients: Ingredient[];
  howToUse: string[];
  benefits: string[];
  productType: string;
  size: string;
  isActive: boolean;
  stock: number;
  images: string[];
  tags: string[];
  subscriptionDiscount: number;
}

interface ProductUploadPageProps {
  navigateTo: (page: string) => void;
}

export function ProductUploadPage({ navigateTo }: ProductUploadPageProps) {
  const [activeTab, setActiveTab] = useState('single');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedIngredients, setSavedIngredients] = useState<Ingredient[]>([]);
  
  const { user } = useUser();
  const isMobile = useMobile();

  // Single product form state
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    skinTypes: [],
    skinConcerns: [],
    ingredients: [],
    howToUse: [],
    benefits: [],
    productType: '',
    size: '',
    isActive: true,
    stock: 0,
    images: [],
    tags: [],
    subscriptionDiscount: 15
  });

  // Bulk upload state
  const [bulkData, setBulkData] = useState('');
  const [bulkPreview, setBulkPreview] = useState<ProductData[]>([]);

  useEffect(() => {
    loadSavedIngredients();
  }, []);

  const loadSavedIngredients = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients`, {
        headers: {
          'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
        }
      });

      if (response.ok) {
        const ingredients = await response.json();
        setSavedIngredients(ingredients);
      }
    } catch (error) {
      console.error('Error loading saved ingredients:', error);
    }
  };

  const categories = [
    'Cleansers', 'Moisturizers', 'Serums', 'Treatments', 'Sunscreen', 'Masks', 'Toners', 'Oils', 'Eye Care', 'Lip Care'
  ];

  const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal', 'Mature'];
  const skinConcerns = ['Acne', 'Dark Spots', 'Wrinkles', 'Dryness', 'Sensitivity', 'Dullness', 'Pores', 'Redness'];
  const productTypes = ['Liquid', 'Cream', 'Gel', 'Oil', 'Powder', 'Serum', 'Lotion', 'Foam', 'Balm'];

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof ProductData, value: string, checked: boolean) => {
    setProductData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      concentration: '',
      purpose: '',
      benefits: []
    };
    
    setProductData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    setProductData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index: number) => {
    setProductData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const saveIngredient = async (ingredient: Ingredient) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/ingredients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredient)
      });

      if (response.ok) {
        await loadSavedIngredients();
        setSuccess('Ingredient saved for future use');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const addFromSavedIngredients = (ingredient: Ingredient) => {
    setProductData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...ingredient, id: Date.now().toString() }]
    }));
  };

  const addHowToUseStep = () => {
    setProductData(prev => ({
      ...prev,
      howToUse: [...prev.howToUse, '']
    }));
  };

  const updateHowToUseStep = (index: number, value: string) => {
    setProductData(prev => ({
      ...prev,
      howToUse: prev.howToUse.map((step, i) => i === index ? value : step)
    }));
  };

  const removeHowToUseStep = (index: number) => {
    setProductData(prev => ({
      ...prev,
      howToUse: prev.howToUse.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    setProductData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setProductData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index: number) => {
    setProductData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSingleUpload = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setSuccess('Product uploaded successfully!');
        // Reset form
        setProductData({
          name: '',
          description: '',
          price: 0,
          category: '',
          skinTypes: [],
          skinConcerns: [],
          ingredients: [],
          howToUse: [],
          benefits: [],
          productType: '',
          size: '',
          isActive: true,
          stock: 0,
          images: [],
          tags: [],
          subscriptionDiscount: 15
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const parseBulkData = () => {
    try {
      const products = JSON.parse(bulkData);
      if (Array.isArray(products)) {
        setBulkPreview(products);
        setError('');
      } else {
        setError('Data must be an array of products');
      }
    } catch (error) {
      setError('Invalid JSON format');
    }
  };

  const handleBulkUpload = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      for (const product of bulkPreview) {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${product.name}`);
        }
      }

      setSuccess(`${bulkPreview.length} products uploaded successfully!`);
      setBulkData('');
      setBulkPreview([]);
    } catch (error: any) {
      setError(error.message || 'Bulk upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('home')} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Product Upload Center</h1>
          <p className="text-muted-foreground">Add new products to the Luvera catalog</p>
        </motion.div>
      </div>

      {error && (
        <Alert className="mb-6 border-destructive/50 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500/50 text-green-600">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Single Product
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Information
              </CardTitle>
              <CardDescription>
                Enter detailed product information including ingredients and usage instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter detailed product description"
                  rows={3}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={productData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g., 50ml, 30g"
                  />
                </div>
              </div>

              {/* Product Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select value={productData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map(type => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isActive"
                    checked={productData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Product Active</Label>
                </div>
              </div>

              <Separator />

              {/* Skin Types */}
              <div className="space-y-3">
                <Label>Suitable Skin Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skinTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`skinType-${type}`}
                        checked={productData.skinTypes.includes(type.toLowerCase())}
                        onChange={(e) => handleArrayChange('skinTypes', type.toLowerCase(), e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`skinType-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skin Concerns */}
              <div className="space-y-3">
                <Label>Addresses Skin Concerns</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {skinConcerns.map(concern => (
                    <div key={concern} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`concern-${concern}`}
                        checked={productData.skinConcerns.includes(concern.toLowerCase())}
                        onChange={(e) => handleArrayChange('skinConcerns', concern.toLowerCase(), e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`concern-${concern}`} className="text-sm">{concern}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Ingredients Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Ingredients</Label>
                  <Button onClick={addIngredient} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>

                {/* Saved Ingredients */}
                {savedIngredients.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Quick Add from Saved Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {savedIngredients.map(ingredient => (
                        <Badge
                          key={ingredient.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => addFromSavedIngredients(ingredient)}
                        >
                          {ingredient.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {productData.ingredients.map((ingredient, index) => (
                  <Card key={ingredient.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Ingredient {index + 1}</h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => saveIngredient(ingredient)}
                            variant="outline"
                            size="sm"
                            disabled={!ingredient.name}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => removeIngredient(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Concentration (e.g., 2%)"
                          value={ingredient.concentration || ''}
                          onChange={(e) => updateIngredient(index, 'concentration', e.target.value)}
                        />
                      </div>
                      
                      <Input
                        placeholder="Purpose (e.g., Moisturizing, Anti-aging)"
                        value={ingredient.purpose}
                        onChange={(e) => updateIngredient(index, 'purpose', e.target.value)}
                      />
                      
                      <Textarea
                        placeholder="Benefits (one per line)"
                        value={ingredient.benefits.join('\n')}
                        onChange={(e) => updateIngredient(index, 'benefits', e.target.value.split('\n').filter(b => b.trim()))}
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* How to Use Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">How to Use</Label>
                  <Button onClick={addHowToUseStep} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                {productData.howToUse.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Input
                      className="flex-1"
                      placeholder={`Step ${index + 1}`}
                      value={step}
                      onChange={(e) => updateHowToUseStep(index, e.target.value)}
                    />
                    <Button
                      onClick={() => removeHowToUseStep(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Benefits Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Key Benefits</Label>
                  <Button onClick={addBenefit} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>

                {productData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      className="flex-1"
                      placeholder={`Benefit ${index + 1}`}
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                    />
                    <Button
                      onClick={() => removeBenefit(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSingleUpload}
                  disabled={isLoading}
                  className="btn-gradient-primary min-w-32"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Product
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk Product Upload
              </CardTitle>
              <CardDescription>
                Upload multiple products using JSON format. Paste your JSON data below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulkData">JSON Data</Label>
                <Textarea
                  id="bulkData"
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder='[{"name": "Product 1", "price": 29.99, ...}, {...}]'
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={parseBulkData} variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Preview Data
                </Button>
                
                {bulkPreview.length > 0 && (
                  <Button
                    onClick={handleBulkUpload}
                    disabled={isLoading}
                    className="btn-gradient-primary"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {bulkPreview.length} Products
                      </>
                    )}
                  </Button>
                )}
              </div>

              {bulkPreview.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Preview ({bulkPreview.length} products)</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bulkPreview.map((product, index) => (
                      <div key={index} className="p-2 bg-muted rounded flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="outline">${product.price}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>JSON Format Example:</strong> Each product should include name, description, price, category, skinTypes, skinConcerns, ingredients, howToUse, benefits, productType, size, stock, and isActive fields.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}