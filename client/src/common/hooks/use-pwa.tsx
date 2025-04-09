import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPrompt: () => Promise<void>;
  isOnline: boolean;
}

export const usePWA = (): PWAStatus => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Online/offline status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const installPrompt = async (): Promise<void> => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone,
    installPrompt,
    isOnline
  };
};

// Component to show a toast when offline
export const OfflineNotification: React.FC = () => {
  const { isOnline } = usePWA();
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);
  
  if (isOnline || !showNotification) return null;
  
  return (
    <div className="fixed bottom-20 left-0 right-0 mx-auto w-[90%] max-w-sm p-3 bg-yellow-100 border border-yellow-300 rounded-md shadow-lg z-50">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-medium text-yellow-800">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

// Component for install prompt
export const InstallPrompt: React.FC = () => {
  const { isInstallable, installPrompt } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  
  if (!isInstallable || dismissed) return null;
  
  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-sm p-4 bg-white border border-indigo-200 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900">Install Mediz App</h3>
        <button 
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-3">Add Mediz to your home screen for quicker access to your medications and prescriptions</p>
      <div className="flex justify-end">
        <button
          onClick={installPrompt}
          className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Install
        </button>
      </div>
    </div>
  );
};