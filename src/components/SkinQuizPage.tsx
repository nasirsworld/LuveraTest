import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Zap,
  Shield,
  AlertCircle,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useCart } from './CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SkinQuizPageProps {
  navigateTo: (page: string, data?: any) => void;
}

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'scale';
  question: string;
  description?: string;
  icon?: React.ReactNode;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
}

export function SkinQuizPage({ navigateTo }: SkinQuizPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const { addItem } = useCart();

  const questions: Question[] = [
    {
      id: 'skinType',
      type: 'single',
      question: "What's your skin type?",
      description: "Choose the option that best describes your skin throughout most of the day",
      icon: <Droplets className="w-6 h-6" />,
      options: [
        {
          value: 'oily',
          label: 'Oily',
          description: 'Shiny, greasy, and prone to enlarged pores',
          icon: <Droplets className="w-5 h-5 text-blue-500" />
        },
        {
          value: 'dry',
          label: 'Dry',
          description: 'Tight, flaky, and sometimes itchy',
          icon: <Sun className="w-5 h-5 text-orange-500" />
        },
        {
          value: 'combination',
          label: 'Combination',
          description: 'Oily T-zone, but dry on cheeks',
          icon: <Zap className="w-5 h-5 text-purple-500" />
        },
        {
          value: 'sensitive',
          label: 'Sensitive',
          description: 'Easily irritated, reactive to products',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        },
        {
          value: 'normal',
          label: 'Normal',
          description: 'Balanced, not too oily or dry',
          icon: <Check className="w-5 h-5 text-green-500" />
        }
      ]
    },
    {
      id: 'concerns',
      type: 'multiple',
      question: "What are your main skin concerns?",
      description: "Select all that apply - we'll prioritize these in your routine",
      icon: <Shield className="w-6 h-6" />,
      options: [
        { value: 'acne', label: 'Acne & Breakouts' },
        { value: 'aging', label: 'Fine Lines & Wrinkles' },
        { value: 'dark-spots', label: 'Dark Spots & Hyperpigmentation' },
        { value: 'dryness', label: 'Dryness & Dehydration' },
        { value: 'sensitivity', label: 'Redness & Sensitivity' },
        { value: 'dullness', label: 'Dullness & Uneven Texture' },
        { value: 'pores', label: 'Large Pores' },
        { value: 'dark-circles', label: 'Dark Circles & Puffiness' }
      ]
    },
    {
      id: 'routine',
      type: 'single',
      question: "How extensive is your current skincare routine?",
      description: "This helps us recommend the right number of products",
      options: [
        {
          value: 'minimal',
          label: 'Minimal (1-3 products)',
          description: 'Basic cleanser, maybe moisturizer'
        },
        {
          value: 'moderate',
          label: 'Moderate (4-6 products)',
          description: 'Cleanser, toner, serum, moisturizer'
        },
        {
          value: 'extensive',
          label: 'Extensive (7+ products)',
          description: 'Full morning and evening routine'
        },
        {
          value: 'none',
          label: 'No routine',
          description: "I'm just starting my skincare journey"
        }
      ]
    },
    {
      id: 'goals',
      type: 'single',
      question: "What's your main skincare goal?",
      description: "We'll focus your routine around this primary objective",
      icon: <Sparkles className="w-6 h-6" />,
      options: [
        {
          value: 'clear',
          label: 'Clear, Blemish-Free Skin',
          description: 'Reduce acne and prevent breakouts'
        },
        {
          value: 'anti-aging',
          label: 'Youthful, Firm Skin',
          description: 'Prevent and reduce signs of aging'
        },
        {
          value: 'hydration',
          label: 'Hydrated, Plump Skin',
          description: 'Improve moisture and elasticity'
        },
        {
          value: 'brightness',
          label: 'Bright, Even Complexion',
          description: 'Reduce dark spots and improve radiance'
        },
        {
          value: 'gentle',
          label: 'Calm, Balanced Skin',
          description: 'Reduce sensitivity and irritation'
        }
      ]
    },
    {
      id: 'lifestyle',
      type: 'multiple',
      question: "Tell us about your lifestyle",
      description: "These factors help us customize your routine",
      options: [
        { value: 'outdoor', label: 'I spend a lot of time outdoors' },
        { value: 'makeup', label: 'I wear makeup regularly' },
        { value: 'exercise', label: 'I exercise frequently' },
        { value: 'travel', label: 'I travel often' },
        { value: 'stress', label: 'I have a stressful lifestyle' },
        { value: 'sleep', label: 'I often have irregular sleep' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Generate results
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAddToCart = (product: any, isSubscription = false) => {
    addItem({
      id: `${product.id}-${isSubscription ? 'sub' : 'one-time'}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      isSubscription,
      subscriptionFrequency: isSubscription ? 'monthly' : undefined
    });
  };

  const handleAddAllToCart = (products: any[], isSubscription = false) => {
    products.forEach(product => {
      handleAddToCart(product, isSubscription);
    });
  };

  const generateRecommendations = () => {
    const skinType = answers.skinType;
    const concerns = answers.concerns || [];
    const goal = answers.goals;

    // Mock recommendation logic - in a real app, this would be more sophisticated
    const recommendations = {
      skinType,
      primaryConcerns: concerns.slice(0, 3),
      products: [
        {
          id: '1',
          name: 'Gentle Foaming Cleanser',
          type: 'Cleanser',
          reason: 'Perfect for your skin type and won\'t strip natural oils',
          price: 28,
          image: 'https://images.unsplash.com/photo-1556227703-ab57dbc6f839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNsZWFuc2VyJTIwYm90dGxlfGVufDF8fHx8MTc1OTM4MDA5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: '2',
          name: 'Vitamin C Brightening Serum',
          type: 'Treatment',
          reason: 'Addresses your concern with dark spots and dullness',
          price: 45,
          image: 'https://images.unsplash.com/photo-1745159338135-39f6b462b382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwYyUyMHNlcnVtJTIwc2tpbmNhcmV8ZW58MXx8fHwxNzU5MzgwMTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: '3',
          name: 'Hydrating Day Moisturizer SPF 30',
          type: 'Moisturizer',
          reason: 'Provides hydration and essential sun protection',
          price: 38,
          image: 'https://images.unsplash.com/photo-1709551264885-06719a695b4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2lzdHVyaXplciUyMHNwZiUyMHN1bnNjcmVlbnxlbnwxfHx8fDE3NTkzODAxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: '4',
          name: 'Retinol Renewal Night Cream',
          type: 'Night Treatment',
          reason: 'Helps with anti-aging and skin renewal while you sleep',
          price: 52,
          image: 'https://images.unsplash.com/photo-1598460880248-71ec6d2d582b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpbm9sJTIwbmlnaHQlMjBjcmVhbSUyMHNraW5jYXJlfGVufDF8fHx8MTc1OTM4MDEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ],
      routine: {
        morning: ['Cleanser', 'Serum', 'Moisturizer with SPF'],
        evening: ['Cleanser', 'Night Treatment', 'Night Moisturizer']
      },
      totalValue: 163,
      subscriptionPrice: 138 // 15% discount
    };

    return recommendations;
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (showResults) {
    const recommendations = generateRecommendations();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-orange-900/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 gradient-bg-warm rounded-full flex items-center justify-center mx-auto mb-4 glow-golden">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl mb-4">Your Personalized Routine</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based on your answers, we've created a customized skincare routine just for you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skin Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Your Skin Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Skin Type</span>
                      <p className="font-medium capitalize">{recommendations.skinType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Primary Concerns</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recommendations.primaryConcerns.map((concern: string) => (
                          <Badge key={concern} variant="secondary" className="text-xs">
                            {concern.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Recommended Products</h3>
                  <div className="space-y-4">
                    {recommendations.products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="product-card flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="product-image w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{product.name}</h4>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {product.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {product.reason}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-lg">${product.price}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${Math.round(product.price / 0.85)}
                            </span>
                            <Badge className="subscription-badge bg-green-500 text-white text-xs">15% off</Badge>
                          </div>
                        </div>

                        {/* Add to Cart Buttons */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="add-to-cart-btn btn-gradient-primary text-white h-8 px-3 text-xs"
                              onClick={() => handleAddToCart(product, true)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Subscribe
                            </Button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="add-to-cart-btn h-8 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
                              onClick={() => handleAddToCart(product, false)}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              One-time
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center justify-between mb-2">
                      <span>Total Value:</span>
                      <span className="line-through text-muted-foreground">${recommendations.totalValue}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Subscription Price:</span>
                      <span className="text-xl font-bold text-green-600">${recommendations.subscriptionPrice}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">Save 15% with subscription</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Routine Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Your Daily Routine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-5 h-5 text-orange-500" />
                      <h4>Morning Routine</h4>
                    </div>
                    <ol className="space-y-2">
                      {recommendations.routine.morning.map((step, index) => (
                        <li key={step} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-5 h-5 text-purple-500" />
                      <h4>Evening Routine</h4>
                    </div>
                    <ol className="space-y-2">
                      {recommendations.routine.evening.map((step, index) => (
                        <li key={step} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add All to Cart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8"
          >
            <Card className="quiz-results-gradient border-2 glow-warm">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Complete Your Routine</h3>
                  <p className="text-muted-foreground">
                    Add all recommended products to your cart and start your skincare journey
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="btn-gradient-primary text-white px-8 py-3 h-auto glow-golden"
                      onClick={() => handleAddAllToCart(recommendations.products, true)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add All with Subscription
                      <div className="ml-3 text-xs bg-white/20 px-2 py-1 rounded-full">
                        Save ${recommendations.totalValue - recommendations.subscriptionPrice}
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 h-auto border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleAddAllToCart(recommendations.products, false)}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add All One-Time
                      <div className="ml-3 text-xs text-muted-foreground">
                        ${recommendations.totalValue}
                      </div>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
                  <span>✓ Free shipping on orders over $50</span>
                  <span className="hidden sm:inline">•</span>
                  <span>✓ 30-day money-back guarantee</span>
                  <span className="hidden sm:inline">•</span>
                  <span>✓ Cancel subscription anytime</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Secondary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-6 text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateTo('shop')}
            >
              Browse All Products
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setAnswers({});
              }}
            >
              Retake Quiz
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-orange-900/20 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 gradient-bg-warm rounded-full flex items-center justify-center mx-auto mb-4 glow-golden">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl mb-2">Skin Quiz</h1>
          <p className="text-muted-foreground">
            Answer a few questions to get your personalized skincare routine
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  {currentQuestion.icon && (
                    <div className="w-12 h-12 gradient-bg-warm rounded-full flex items-center justify-center mx-auto mb-4 text-white glow-golden">
                      {currentQuestion.icon}
                    </div>
                  )}
                  <h2 className="text-2xl mb-2">{currentQuestion.question}</h2>
                  {currentQuestion.description && (
                    <p className="text-muted-foreground">{currentQuestion.description}</p>
                  )}
                </div>

                {currentQuestion.type === 'single' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                            {option.icon}
                            <span className="font-medium">{option.label}</span>
                          </Label>
                          {option.description && (
                            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'multiple' && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={option.value}
                          checked={(answers[currentQuestion.id] || []).includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            if (checked) {
                              handleAnswer(currentQuestion.id, [...currentAnswers, option.value]);
                            } else {
                              handleAnswer(currentQuestion.id, currentAnswers.filter((a: string) => a !== option.value));
                            }
                          }}
                        />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || (currentQuestion.type === 'multiple' && (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0))}
            className="btn-gradient-primary text-white flex items-center gap-2"
          >
            {currentStep === questions.length - 1 ? 'Get Results' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}