import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

let supabase: any = null;

try {
  if (typeof window !== 'undefined' && projectId && publicAnonKey) {
    supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  skinType?: string;
  skinConcerns?: string[];
  savedRoutines?: any[];
  subscriptions?: any[];
  orders?: any[];
  isAdmin?: boolean;
  accessToken?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not available, auth features disabled');
      setLoading(false);
      setInitialized(true);
      return;
    }
    
    // Check for existing session
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        await loadUserProfile(session.user.id, session.access_token);
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    });

    // Set initialized after a short delay to prevent timing issues
    setTimeout(() => setInitialized(true), 100);

    return () => subscription?.unsubscribe();
  }, []);

  const checkSession = async () => {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      setLoading(false);
      return;
    }
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        await loadUserProfile(session.user.id, session.access_token);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string, accessToken: string) => {
    if (!supabase) {
      console.warn('Cannot load user profile - Supabase client not available');
      return;
    }
    
    try {
      // Fetch user profile from backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/users/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({ ...userData, accessToken });
      } else if (response.status === 404) {
        // Profile doesn't exist, create a new one only for new users
        console.log('User profile not found, creating new profile');
        const { data } = await supabase.auth.getUser(accessToken);
        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
            skinType: undefined,
            skinConcerns: [],
            savedRoutines: [],
            subscriptions: [],
            orders: [],
            isAdmin: false, // Default to false, admin users should already exist
            accessToken
          };
          
          // Save to backend
          await updateProfile(newUser);
          setUser(newUser);
        }
      } else {
        console.error('Failed to load user profile:', response.status, response.statusText);
        // Don't create a new user profile if there's an error other than 404
        const { data } = await supabase.auth.getUser(accessToken);
        if (data.user) {
          // Minimal user object for error cases
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
            isAdmin: false,
            accessToken
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.user) {
        await loadUserProfile(data.session.user.id, data.session.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
    
    try {
      setLoading(true);
      
      // Create user via backend (with email confirmation)
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const { user: newUser } = await response.json();
      
      // Now sign in the user
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user?.accessToken) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...updatedUser, accessToken: user.accessToken });
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const refreshUserData = async () => {
    if (!user?.accessToken) {
      console.warn('Cannot refresh user data - no access token');
      return;
    }
    
    try {
      await loadUserProfile(user.id, user.accessToken);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Show loading spinner while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        refreshUserData,
        isLoggedIn: !!user,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Return a safe fallback instead of throwing error
    return { 
      user: null, 
      login: async () => {
        console.warn('Authentication not available - user context not initialized');
      }, 
      loginWithGoogle: async () => {
        console.warn('Authentication not available - user context not initialized');
      },
      register: async () => {
        console.warn('Authentication not available - user context not initialized');
      }, 
      logout: async () => {
        console.warn('Authentication not available - user context not initialized');
      }, 
      updateProfile: async () => {
        console.warn('Authentication not available - user context not initialized');
      },
      refreshUserData: async () => {
        console.warn('Authentication not available - user context not initialized');
      }, 
      isLoggedIn: false,
      loading: false
    };
  }
  return context;
}