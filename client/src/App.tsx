
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { OfflineNotification, InstallPrompt } from "./hooks/use-pwa";
import AppRoutes from "./routes";

function App() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check if it's first time app use
    const hasCompletedOnboarding = localStorage.getItem('mediz-onboarding-complete');
    
    if (!hasCompletedOnboarding && location === '/') {
      // Redirect to onboarding flow
      navigate('/onboarding');
    }
  }, [location, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster />
      <OfflineNotification />
      <InstallPrompt />
    </QueryClientProvider>
  );
}

export default App;
