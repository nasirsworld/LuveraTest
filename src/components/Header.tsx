import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Heart,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeContext';
import { useUser } from './UserContext';
import { useCart } from './CartContext';

interface HeaderProps {
  navigateTo: (page: string, data?: any) => void;
  currentPage: string;
}

export function Header({ navigateTo, currentPage }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { getTotalItems } = useCart();

  const navigation = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'shop' },
    { name: 'Skin Quiz', page: 'quiz' },
    { name: 'Journal', page: 'blog' }
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 ios-blur"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 lg:pt-3">
        {/* Main Header Row */}
        <div className="flex items-center md:items-start justify-between h-20 md:h-24 lg:h-20 md:py-3 lg:py-0">
          
          {/* Section 1: Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer min-w-0 flex-shrink-0"
            onClick={() => navigateTo('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-10 h-10 gradient-bg-warm rounded-2xl flex items-center justify-center shadow-lg glow-golden"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text">
                Luvera
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Skincare Reimagined</p>
            </div>
          </motion.div>

          {/* Section 2: Navigation - Desktop and Tablet */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-md">
            <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl p-1 backdrop-blur-sm">
              {navigation.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => navigateTo(item.page)}
                  className={`relative px-3 md:px-4 lg:px-6 py-2 lg:py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                    currentPage === item.page
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentPage === item.page && (
                    <motion.div
                      className="absolute inset-0 gradient-bg-warm rounded-xl shadow-lg glow-golden"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Section 3: Right Side - Desktop and Tablet */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            
            {/* Desktop: Accessories + Sign-in inline */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Desktop Accessories */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-sm">
                {/* Search */}
                <motion.div className="relative">
                  <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                      <motion.div
                        key="search-input"
                        initial={{ width: 40, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ width: 40, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex items-center"
                      >
                        <Input
                          type="text"
                          placeholder="Search..."
                          className="h-9 pr-9 bg-white/80 dark:bg-gray-700/80 border-0 text-sm rounded-xl"
                          autoFocus
                          onBlur={() => setIsSearchOpen(false)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 h-7 w-7 p-0"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="search-button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.button
                          className="h-9 w-9 p-0 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center"
                          onClick={() => setIsSearchOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Search className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div>
                  <motion.button
                    className="h-9 w-9 p-0 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center"
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* Favorites */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-9 w-9 p-0 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 relative transition-all duration-200"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Cart */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 relative transition-all duration-200"
                    onClick={() => navigateTo('cart')}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {getTotalItems() > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge
                          className="h-4 w-4 p-0 text-xs gradient-bg-warm border-0 flex items-center justify-center shadow-md"
                        >
                          {getTotalItems()}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Desktop Sign In */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className="h-10 px-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 border-0"
                        onClick={() => navigateTo('account')}
                      >
                        <div className="w-6 h-6 gradient-bg-primary rounded-full flex items-center justify-center mr-2 glow-golden">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </Button>
                    </motion.div>
                    
                    {user.isAdmin && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                          onClick={() => navigateTo('admin')}
                        >
                          Admin
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="h-10 px-6 btn-gradient-primary text-white rounded-xl shadow-lg border-0 font-medium"
                      onClick={() => navigateTo('auth')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tablet: Sign-in in horizontal line, with accessories below */}
            <div className="hidden md:flex lg:hidden flex-col items-end">
              {/* Sign In Button Row - Horizontal */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className="h-9 px-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 border-0"
                        onClick={() => navigateTo('account')}
                      >
                        <div className="w-5 h-5 gradient-bg-primary rounded-full flex items-center justify-center mr-2 glow-golden">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </Button>
                    </motion.div>
                    
                    {user.isAdmin && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs rounded-xl border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                          onClick={() => navigateTo('admin')}
                        >
                          Admin
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="h-9 px-4 btn-gradient-primary text-white rounded-xl shadow-lg border-0 font-medium text-sm"
                      onClick={() => navigateTo('auth')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Accessories Row - Below Sign In (Tablet Only) */}
              <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl accessories-below-signin mt-2">
                {/* Top Row */}
                <motion.div>
                  <motion.button
                    className="h-8 w-8 p-0 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center"
                    onClick={() => setIsSearchOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>

                <motion.div>
                  <motion.button
                    className="h-8 w-8 p-0 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center"
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* Bottom Row */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 relative transition-all duration-200"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>

                <motion.div>
                  <motion.button
                    className="h-8 w-8 p-0 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 relative transition-all duration-200 flex items-center justify-center"
                    onClick={() => navigateTo('cart')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {getTotalItems() > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge
                          className="h-3 w-3 p-0 text-xs gradient-bg-warm border-0 flex items-center justify-center shadow-md"
                        >
                          {getTotalItems()}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Pills (Hidden by default, shown on smaller screens) */}
        <div className="lg:hidden pb-4">
          <div className="flex items-center justify-center">

          </div>
        </div>

        {/* Mobile Accessories Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center justify-center space-x-4">
            {/* Search */}
            <motion.div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Theme */}
            <motion.div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                onClick={toggleTheme}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </motion.div>

            {/* Heart */}
            <motion.div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 relative"
                onClick={() => navigateTo('cart')}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs gradient-bg-warm">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}