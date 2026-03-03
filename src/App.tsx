import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getProfile } from "@/lib/storage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DailyLog from "./pages/DailyLog";
import WeeklyVitals from "./pages/WeeklyVitals";
import HabitsPage from "./pages/HabitsPage";
import IllnessEpisodePage from "./pages/IllnessEpisodePage";
import WomensHealthPage from "./pages/WomensHealthPage";
import TrendsPage from "./pages/TrendsPage";
import DoctorReportPage from "./pages/DoctorReportPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const profile = getProfile();
  const needsOnboarding = !profile?.onboardingComplete;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {needsOnboarding ? (
            <Routes>
              <Route path="*" element={<Onboarding />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/log" element={<DailyLog />} />
              <Route path="/vitals" element={<WeeklyVitals />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/illness" element={<IllnessEpisodePage />} />
              <Route path="/womens-health" element={<WomensHealthPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/report" element={<DoctorReportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
