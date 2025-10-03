import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Sparkles,
  Heart,
  Shield
} from 'lucide-react';
import { useUser } from './UserContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface FooterProps {
  navigateTo: (page: string) => void;
}

export function Footer({ navigateTo }: FooterProps) {
  const { user } = useUser();
  
  const footerLinks = {
    company: [
      { name: 'About Us', page: 'about' },
      { name: 'Our Story', page: 'story' },
      { name: 'Careers', page: 'careers' },
      { name: 'Press', page: 'press' }
    ],
    support: [
      { name: 'Contact Us', page: 'contact' },
      { name: 'FAQ', page: 'faq' },
      { name: 'Shipping Info', page: 'shipping' },
      { name: 'Returns', page: 'returns' }
    ],
    skincare: [
      { name: 'Skin Quiz', page: 'quiz' },
      { name: 'Ingredients', page: 'ingredients' },
      { name: 'Skin Types', page: 'skin-types' },
      { name: 'Routines', page: 'routines' }
    ],
    legal: [
      { name: 'Privacy Policy', page: 'privacy' },
      { name: 'Terms of Service', page: 'terms' },
      { name: 'Cookie Policy', page: 'cookies' },
      { name: 'Refund Policy', page: 'refunds' }
    ]
  };

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: '#' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#' },
    { name: 'Youtube', icon: <Youtube className="w-5 h-5" />, url: '#' }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl mb-4">Stay in the Loop</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest skincare tips, product launches, and exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="btn-gradient-primary text-white">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-bg-warm rounded-full flex items-center justify-center glow-golden">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  Luvera
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6 max-w-sm">
                Personalized skincare solutions designed to help you achieve your healthiest, 
                most radiant skin naturally.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  hello@luvera.com
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  1-800-LUVERA-1
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  San Francisco, CA
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 hover:gradient-bg-warm hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-4">Skincare</h4>
            <ul className="space-y-2">
              {footerLinks.skincare.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              
              {/* Admin Link - Only visible for admin users */}
              {user?.isAdmin && (
                <li className="pt-2 border-t border-border/50 mt-3">
                  <button
                    onClick={() => navigateTo('admin')}
                    className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 group"
                  >
                    <Shield className="w-3 h-3 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <span>© 2024 Luvera. All rights reserved.</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              Made with <Heart className="w-3 h-3 mx-1 text-pink-500" /> for beautiful skin
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Admin Quick Access - Visible for admin users */}
            {user?.isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTo('admin')}
                  className="hidden sm:flex items-center text-xs border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                >
                  <Shield className="w-3 h-3 mr-1.5" />
                  Admin
                </Button>
                <span className="hidden sm:inline">•</span>
              </>
            )}
            <span>🌱 Cruelty-Free</span>
            <span>♻️ Sustainable</span>
            <span>🧪 Dermatologist Tested</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}