import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, Heart, ShoppingBag, User, Sparkles, Shield } from 'lucide-react';
import { useUser } from './UserContext';

interface MobileNavigationProps {
  currentPage: string;
  navigateTo: (page: string) => void;
}

export function MobileNavigation({ currentPage, navigateTo }: MobileNavigationProps) {
  const { user } = useUser();
  
  const baseNavItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      page: 'home'
    },
    {
      id: 'shop',
      icon: Search,
      label: 'Shop',
      page: 'shop'
    },
    {
      id: 'quiz',
      icon: Sparkles,
      label: 'Quiz',
      page: 'quiz'
    },
    {
      id: 'cart',
      icon: ShoppingBag,
      label: 'Cart',
      page: 'cart'
    }
  ];

  // Add the last nav item based on user role and login status
  const lastNavItem = user?.isAdmin ? {
    id: 'admin',
    icon: Shield,
    label: 'Admin',
    page: 'admin'
  } : user ? {
    id: 'account',
    icon: User,
    label: 'Profile',
    page: 'account'
  } : {
    id: 'auth',
    icon: User,
    label: 'Sign In',
    page: 'auth'
  };

  const navItems = [...baseNavItems, lastNavItem];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 ios-blur border-t border-gray-200/50 dark:border-gray-700/50 safe-area-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          if (!item || !item.icon) return null;
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => navigateTo(item.page)}
              className="flex flex-col items-center justify-center p-3 rounded-xl min-w-[64px] relative mobile-bounce"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {/* Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </motion.div>
              
              {/* Label */}
              <motion.span 
                className={`text-xs mt-1 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1
                }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}