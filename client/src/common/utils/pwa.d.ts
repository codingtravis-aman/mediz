// Type declarations for PWA-related browser APIs

// Add standalone property to Navigator interface for iOS Safari
interface Navigator {
  standalone?: boolean;
}

// BeforeInstallPromptEvent for PWA installation
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Declare the beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}