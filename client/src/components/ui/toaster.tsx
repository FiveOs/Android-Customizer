import * as React from "react";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`
            px-4 py-3 rounded-lg border shadow-lg max-w-sm
            ${toast.variant === 'destructive' 
              ? 'bg-red-900 border-red-600 text-red-100' 
              : 'bg-slate-800 border-emerald-500/30 text-emerald-100'
            }
          `}
        >
          {toast.title && (
            <div className="font-semibold mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}