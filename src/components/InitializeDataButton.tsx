import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function InitializeDataButton() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setIsInitializing(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log('Triggering manual data initialization...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5a20eda3/system/init`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        const result = await response.json();
        setStatus('success');
        setMessage('Data initialized successfully!');
        console.log('Initialization result:', result);
      } else {
        const errorText = await response.text();
        setStatus('error');
        setMessage(`Failed to initialize: ${response.status} - ${errorText}`);
        console.error('Initialization failed:', response.status, errorText);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
      console.error('Initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleInitialize}
        disabled={isInitializing}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isInitializing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          getStatusIcon()
        )}
        {isInitializing ? 'Initializing...' : 'Initialize Sample Data'}
      </Button>
      
      {(status !== 'idle' || message) && (
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {message && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </span>
          )}
        </div>
      )}
    </div>
  );
}