import * as React from "react";

// Simple toast implementation to replace problematic version
interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Simple global toast state without complex reducers
let toastCallbacks: ((toast: ToastProps) => void)[] = [];

const addToast = (toast: ToastProps) => {
  toastCallbacks.forEach(callback => callback(toast));
  // Auto-remove after 3 seconds
  setTimeout(() => {
    console.log('Toast:', toast.title || toast.description);
  }, 3000);
};

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  React.useEffect(() => {
    const callback = (toast: ToastProps) => {
      setToasts(prev => [...prev, toast]);
      // Remove after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 3000);
    };
    
    toastCallbacks.push(callback);
    
    return () => {
      toastCallbacks = toastCallbacks.filter(cb => cb !== callback);
    };
  }, []);

  return {
    toast: addToast,
    toasts
  };
}