import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import HomePage from "@/pages/home";
import KernelBuilderPage from "@/pages/kernel-builder";
import TWRPCustomizerPage from "@/pages/twrp-customizer";
import AndroidToolPage from "@/pages/android-tool";
import BuildHistoryPage from "@/pages/build-history";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/login";
import SubscriptionPage from "@/pages/subscription";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-emerald-400">Loading Android Customizer...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/subscription" component={SubscriptionPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/kernel-builder" component={KernelBuilderPage} />
          <Route path="/twrp-customizer" component={TWRPCustomizerPage} />
          <Route path="/android-tool" component={AndroidToolPage} />
          <Route path="/build-history" component={BuildHistoryPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/subscription" component={SubscriptionPage} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="android-kernel-customizer-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;