import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Lenis from "lenis";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SecurityShield from "./components/SecurityShield.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Lenis removido daqui, centralizado no SmoothScroll.tsx
  }, []);

  return (
    <SecurityShield>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SecurityShield>
  );
};

export default App;