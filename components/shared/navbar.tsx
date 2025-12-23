"use client";

import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  Bell,
  Settings,
  Maximize2,
  Grid3x3,
  Globe,
  ChevronDown,
} from "lucide-react";
import { StorageService } from "@/lib/storage-service";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Minimize2,
} from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const user = StorageService.getUser();
  const { toggle, isOpen } = useSidebarStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get user initials
  const userInitials = user?.full_name
    ?.split(" ")
    .map((name: string) => name.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    // TODO: Implement language change logic
    console.log("Language changed to:", lang);
  };

  // Handle profile actions
  const handleProfileAction = (action: string) => {
    // TODO: Implement profile action logic
    console.log("Profile action:", action);
  };

  return (
    <div 
      className="border-b fixed top-0 left-0 h-16 bg-white z-50 flex items-center justify-between  transition-all duration-300"
      style={{ width: isOpen ? 'calc(100vw - 235px)' : 'calc(100vw - 79px)' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="hover:bg-gray-100"
        >
          <Menu className="size-5 text-gray-700" />
        </Button>
      </div>


      {/* Right Section - Icons and User Info */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="hover:bg-gray-100 size-9"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="size-5 text-gray-700" />
          ) : (
            <Maximize2 className="size-5 text-gray-700" />
          )}
        </Button>

        {/* Language Icon */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 size-9"
              title="Language"
            >
              <Globe className="size-5 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
              <span className="text-sm">العربية</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              <span className="text-sm">English</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 size-9 relative"
          title="Notifications"
        >
          <Bell className="size-5 text-gray-700" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors">
              <div className="text-left text-xs">
                <p className="text-sm font-medium text-gray-900">
                  {user?.full_name || "User Name"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "User"}</p>
              </div>
              <Avatar className="size-8">
                <AvatarImage src="" alt={user?.full_name || "User"} />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 text-gray-500" />
            </div>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleProfileAction("profile")}>
              <User className="size-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileAction("settings")}>
              <Settings className="size-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleProfileAction("logout")}
              variant="destructive"
            >
              <LogOut className="size-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </div>
  );
};
