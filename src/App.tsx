import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminGateway from "./pages/AdminGateway";
import AdminDashboard from "./pages/AdminDashboard";
import CertGen from "./pages/CertGen";
import CertificatesDisplay from "./pages/CertificatesDisplay";
import CertificateDetails from "./pages/CertificateDetails";
import VerifyCertificate from "./pages/VerifyCertificate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminGateway />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/certgen" element={<CertGen />} />
          <Route path="/certificates/:name" element={<CertificatesDisplay />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
