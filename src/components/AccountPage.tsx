import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Heart, Package, CreditCard, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { useUser } from './UserContext';

interface AccountPageProps {
  navigateTo: (page: string) => void;
}

export function AccountPage({ navigateTo }: AccountPageProps) {
  const { user, logout, isLoggedIn, updateProfile, loading, refreshUserData } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Sign In Required</CardTitle>
            <p className="text-muted-foreground">
              Please sign in to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigateTo('auth')} 
              className="w-full btn-gradient-primary"
            >
              Go to Sign In
            </Button>
            <Button 
              onClick={() => navigateTo('home')} 
              variant="outline"
              className="w-full"
            >
              Continue as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your profile and orders</p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Debug Admin Status */}
                  {user?.email === 'admin@luvera.com' && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Admin Status Debug</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                        Current admin status: <strong>{user?.isAdmin ? 'Admin' : 'Regular User'}</strong>
                      </p>
                      {!user?.isAdmin && (
                        <div className="space-y-2">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            If you should have admin access, try these buttons:
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={refreshUserData}
                              variant="outline"
                              size="sm"
                              disabled={isBootstrapping}
                            >
                              Refresh Profile
                            </Button>
                            <Button
                              onClick={bootstrapAdmin}
                              variant="outline"
                              size="sm"
                              disabled={isBootstrapping}
                            >
                              {isBootstrapping ? 'Granting...' : 'Become Admin'}
                            </Button>
                          </div>
                        </div>
                      )}
                      {user?.isAdmin && (
                        <Button
                          onClick={() => navigateTo('admin')}
                          className="btn-gradient-primary"
                          size="sm"
                        >
                          Access Admin Dashboard
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input id="profile-name" defaultValue={user?.name} />
                    </div>
                    <div>
                      <Label htmlFor="profile-email">Email</Label>
                      <Input id="profile-email" type="email" defaultValue={user?.email} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="skin-type">Skin Type</Label>
                    <Input id="skin-type" defaultValue={user?.skinType || ''} placeholder="e.g. Combination" />
                  </div>
                  
                  <Button className="w-full md:w-auto">Update Profile</Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <p>No orders yet. Start shopping to see your orders here!</p>
                    <Button className="mt-4" onClick={() => navigateTo('shop')}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-4" />
                    <p>No active subscriptions. Subscribe to your favorite products for savings!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4" />
                    <p>No favorites yet. Heart products to save them here!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Account Actions</h3>
                  <p className="text-sm text-muted-foreground">Manage your account settings</p>
                </div>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}