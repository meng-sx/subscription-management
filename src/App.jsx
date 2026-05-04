import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { SubscriptionProvider, useSubscriptions } from "@/contexts/SubscriptionContext.jsx";
import { navItems } from "./nav-items";

const queryClient = new QueryClient();

const AppContent = () => {
  const { hasSeenWelcome } = useSubscriptions();
  
  return (
    <HashRouter>
      <Routes>
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
        <Route 
          path="*" 
          element={
            hasSeenWelcome ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/welcome" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubscriptionProvider>
        <Toaster />
        <AppContent />
      </SubscriptionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
