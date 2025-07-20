// Extremely simple toast that just logs to console
export function useToast() {
  return {
    toast: (props: { title?: string; description?: string; variant?: string }) => {
      console.log(`Toast: ${props.title || props.description}`);
      // Show a simple browser alert as fallback
      if (props.variant === 'destructive') {
        console.error(`Error: ${props.description}`);
      }
    },
    toasts: []
  };
}