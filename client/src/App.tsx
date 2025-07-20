import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/theme-provider";
import Sidebar from "@/components/sidebar";
import HomePage from "@/pages/home";
import KernelBuilderPage from "@/pages/kernel-builder";
import TWRPCustomizerPage from "@/pages/twrp-customizer";
import AndroidToolPage from "@/pages/android-tool";
import BuildHistoryPage from "@/pages/build-history";
import SettingsPage from "@/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="android-kernel-customizer-theme">
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
            </Switch>
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;