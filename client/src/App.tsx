import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./common/utils/queryClient";
import { Toaster } from "./common/ui/toaster";
import { OfflineNotification, InstallPrompt } from "./common/hooks/use-pwa";
import AppRoutes from "./routes";

function App() {
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
