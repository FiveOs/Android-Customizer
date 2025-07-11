import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GitHubHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-[#24292e] text-white border-b border-[#21262d]">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-[14px] font-semibold hover:opacity-80 cursor-pointer">
                Android Kernel Customizer
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/kernel-builder">
              <Button variant="ghost" size="sm" className="text-[#f0f6fc] hover:bg-[#30363d] border-0 h-8 px-3 text-[14px] font-normal">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80">
                    <AvatarImage src={(user as any)?.profileImageUrl} />
                    <AvatarFallback className="bg-gray-700 text-white text-xs">
                      {(user as any)?.firstName?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled className="text-xs text-gray-500">
                  Signed in as <br />
                  <span className="font-semibold text-gray-900">
                    {(user as any)?.email || 'User'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/configurations">
                    Your configurations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/build-history">
                    Your builds
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/android-tool">
                    Device tools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}