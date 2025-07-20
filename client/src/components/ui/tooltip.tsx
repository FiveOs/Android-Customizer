import * as React from "react";

// Simple tooltip implementation without Radix UI to avoid hooks issues
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-emerald-100 rounded border border-emerald-500/30 whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
};

// Compatibility exports for existing code
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };