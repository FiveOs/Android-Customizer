import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
      <Link href="/" className="flex items-center hover:text-emerald-400 transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={14} className="text-slate-500" />
          {item.href && !item.current ? (
            <Link 
              href={item.href} 
              className="hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-emerald-400 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}