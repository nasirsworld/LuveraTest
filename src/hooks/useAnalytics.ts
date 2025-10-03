import { useUser } from '../components/UserContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function useAnalytics() {
  const { user } = useUser();

  const trackPageView = async (page: string) => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/page-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          page,
          userId: user?.id || 'anonymous',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackActivity = async (action: string, productId?: string, page?: string) => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/analytics/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          action,
          productId,
          page: page || 'unknown',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return {
    trackPageView,
    trackActivity
  };
}