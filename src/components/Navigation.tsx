import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Upload, Search, Library, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavigationProps {
  user?: SupabaseUser | null;
}

export const Navigation = ({ user }: NavigationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <nav className="border-b border-[#3e3e42] bg-[#252526] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand - Left */}
          <Link to="/" className="text-lg font-bold text-[#d4d4d4] flex-shrink-0">
            CodeBits
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          {user && (
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/search")}
                  className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/library")}
                  className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                >
                  <Library className="h-4 w-4 mr-2" />
                  Library
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <>
                {/* Upload Button - Visible on desktop */}
                <Button 
                  size="sm" 
                  onClick={() => navigate("/upload")}
                  className="hidden sm:flex rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white hover:shadow-lg h-10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-lg hover:bg-[#2d2d30]"
                    >
                      <User className="h-5 w-5 text-[#d4d4d4]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#252526] border-[#3e3e42]">
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer text-[#d4d4d4] focus:bg-[#2d2d30] focus:text-white"
                    >
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer text-[#d4d4d4] focus:bg-[#2d2d30] focus:text-white"
                    >
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/upload")}
                      className="cursor-pointer md:hidden text-[#d4d4d4] focus:bg-[#2d2d30] focus:text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Upload</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-400 focus:bg-[#2d2d30] focus:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-lg hover:bg-[#2d2d30]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 text-[#d4d4d4]" />
                  ) : (
                    <Menu className="h-5 w-5 text-[#d4d4d4]" />
                  )}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className="rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white hover:shadow-lg h-10"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu - Logged In Users */}
        {user && mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#3e3e42] mt-2">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                onClick={() => {
                  navigate("/search");
                  setMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                onClick={() => {
                  navigate("/library");
                  setMobileMenuOpen(false);
                }}
              >
                <Library className="h-4 w-4 mr-2" />
                Library
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start text-[#d4d4d4] hover:text-white hover:bg-[#2d2d30]"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
