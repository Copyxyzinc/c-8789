
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("openai_api_key") || ""
  );

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem("openai_api_key", newKey);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  apiKey={apiKey} 
                  onApiKeyChange={handleApiKeyChange} 
                />
              } 
            />
            <Route 
              path="/chat/:id" 
              element={
                <Chat 
                  apiKey={apiKey} 
                  onApiKeyChange={handleApiKeyChange} 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
