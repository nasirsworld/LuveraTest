import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { MobileNavigation } from './components/MobileNavigation';
import { MobileHeader } from './components/MobileHeader';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { SkinQuizPage } from './components/SkinQuizPage';
import { AccountPage } from './components/AccountPage';
import { CartPage } from './components/CartPage';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogPage } from './components/BlogPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { OffersPage } from './components/OffersPage';
import { AuthPage } from './components/AuthPage';
import { ProductUploadPage } from './components/ProductUploadPage';
import { Footer } from './components/Footer';
import { AdminFloatingButton } from './components/AdminFloatingButton';
import { CartProvider } from './components/CartContext';
import { UserProvider } from './components/UserContext';
import { ThemeProvider } from './components/ThemeContext';
import { useMobile } from './hooks/useMobile';
import { useAnalytics } from './hooks/useAnalytics';

// Simple routing state management
type Page = 'home' | 'shop' | 'product' | 'quiz' | 'account' | 'cart' | 'admin' | 'blog' | 'blog-detail' | 'offers' | 'auth' | 'product-upload';

interface AppState {
  currentPage: Page;
  selectedProduct?: any;
  selectedBlogPost?: any;
  quizResults?: any;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home'
  });
  const isMobile = useMobile();
  const { trackPageView } = useAnalytics();

  const navigateTo = (page: Page, data?: any) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      selectedProduct: data?.product || prev.selectedProduct,
      selectedBlogPost: data?.blogPost || prev.selectedBlogPost,
      quizResults: data?.quizResults || prev.quizResults
    }));
    
    // Track page view for analytics
    trackPageView(page);
  };

  // Track initial page view
  useEffect(() => {
    trackPageView('home');
  }, []);

  const getPageTitle = () => {
    switch (appState.currentPage) {
      case 'home':
        return 'Luvera';
      case 'shop':
        return 'Shop';
      case 'product':
        return appState.selectedProduct?.name || 'Product';
      case 'quiz':
        return 'Skin Quiz';
      case 'account':
        return 'Profile';
      case 'cart':
        return 'Cart';
      case 'admin':
        return 'Admin';
      case 'blog':
        return 'Journal';
      case 'blog-detail':
        return 'Article';
      case 'offers':
        return 'Special Offers';
      case 'auth':
        return 'Sign In';
      case 'product-upload':
        return 'Upload Products';
      default:
        return 'Luvera';
    }
  };

  const showBackButton = () => {
    return ['product', 'blog-detail', 'admin', 'product-upload'].includes(appState.currentPage);
  };

  const handleBack = () => {
    switch (appState.currentPage) {
      case 'product':
        navigateTo('shop');
        break;
      case 'blog-detail':
        navigateTo('blog');
        break;
      case 'admin':
        navigateTo('account');
        break;
      case 'product-upload':
        navigateTo('admin');
        break;
      default:
        navigateTo('home');
    }
  };

  const renderPage = () => {
    const pageProps = {
      navigateTo,
      appState
    };

    switch (appState.currentPage) {
      case 'home':
        return <HomePage {...pageProps} />;
      case 'shop':
        return <ShopPage {...pageProps} />;
      case 'product':
        return <ProductDetailPage {...pageProps} />;
      case 'quiz':
        return <SkinQuizPage {...pageProps} />;
      case 'account':
        return <AccountPage {...pageProps} />;
      case 'cart':
        return <CartPage {...pageProps} />;
      case 'admin':
        return <AdminDashboard {...pageProps} />;
      case 'blog':
        return <BlogPage {...pageProps} />;
      case 'blog-detail':
        return <BlogDetailPage {...pageProps} />;
      case 'offers':
        return <OffersPage {...pageProps} />;
      case 'auth':
        return <AuthPage {...pageProps} />;
      case 'product-upload':
        return <ProductUploadPage {...pageProps} />;
      default:
        return <HomePage {...pageProps} />;
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <div className={`min-h-screen bg-background text-foreground ${isMobile ? 'pb-20' : ''}`}>
            {/* Desktop Header */}
            {!isMobile && (
              <Header navigateTo={navigateTo} currentPage={appState.currentPage} />
            )}
            
            {/* Mobile Header */}
            {isMobile && (
              <MobileHeader
                title={getPageTitle()}
                showBack={showBackButton()}
                onBack={handleBack}
                rightAction={appState.currentPage === 'shop' ? 'search' : undefined}
              />
            )}
            
            <motion.main
              key={appState.currentPage}
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isMobile ? -10 : -20 }}
              transition={{ duration: 0.3 }}
              className={isMobile ? 'pt-20' : 'pt-24 md:pt-28 lg:pt-28'}
            >
              {renderPage()}
            </motion.main>
            
            {/* Desktop Footer */}
            {!isMobile && <Footer navigateTo={navigateTo} />}
            
            {/* Admin Floating Button - Mobile Only */}
            <AdminFloatingButton 
              navigateTo={navigateTo} 
              currentPage={appState.currentPage} 
            />
            
            {/* Mobile Bottom Navigation */}
            {isMobile && (
              <MobileNavigation 
                currentPage={appState.currentPage} 
                navigateTo={navigateTo} 
              />
            )}
          </div>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}