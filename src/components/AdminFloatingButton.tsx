import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from './UserContext';

interface AdminFloatingButtonProps {
  navigateTo: (page: string) => void;
  currentPage: string;
}

export function AdminFloatingButton({ navigateTo, currentPage }: AdminFloatingButtonProps) {
  const { user } = useUser();
  
  // Don't show if not admin or already on admin page
  if (!user?.isAdmin || currentPage === 'admin') {
    return null;
  }

  // Safety check for navigateTo function
  if (typeof navigateTo !== 'function') {
    console.warn('AdminFloatingButton: navigateTo prop is not a function');
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-4 z-[45] md:hidden sm:right-6"
    >
      {/* Pulse effect - behind the button */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping -z-10"></div>
      
      <Button
        onClick={() => navigateTo('admin')}
        className="relative w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 p-0 z-10"
      >
        <Shield className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}