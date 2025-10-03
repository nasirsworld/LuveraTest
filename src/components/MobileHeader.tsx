import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MoreHorizontal, Bell, Search } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: 'search' | 'menu' | 'notifications' | null;
  onRightAction?: () => void;
  className?: string;
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  onBack, 
  rightAction = null,
  onRightAction,
  className = "" 
}: MobileHeaderProps) {
  const getRightIcon = () => {
    switch (rightAction) {
      case 'search':
        return Search;
      case 'menu':
        return MoreHorizontal;
      case 'notifications':
        return Bell;
      default:
        return null;
    }
  };

  const RightIcon = getRightIcon();

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-40 ios-blur border-b border-gray-200/50 dark:border-gray-700/50 safe-area-top ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center min-w-[44px]">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2 mobile-bounce"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        <motion.h1 
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-center flex-1 mx-4 truncate"
        >
          {title}
        </motion.h1>

        {/* Right Side */}
        <div className="flex items-center min-w-[44px] justify-end">
          {RightIcon && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRightAction}
              className="p-2 -mr-2 mobile-bounce"
            >
              <RightIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}