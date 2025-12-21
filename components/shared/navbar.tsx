"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const user = StorageService.getUser();
  const { toggle, isOpen } = useSidebarStore();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
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

        <div className="relative w-[300px]">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pr-10 bg-gray-50 border-gray-200 focus-visible:ring-gray-300"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Globe className="size-5 text-gray-700" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Grid3x3 className="size-5 text-gray-700" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Maximize2 className="size-5 text-gray-700" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
          <Bell className="size-5 text-gray-700" />
          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
          <Avatar className="size-8 cursor-pointer">
            <AvatarImage src="" alt={user?.full_name || "User"} />
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {user?.full_name
                ?.split(" ")
                .map((name: string) => name.charAt(0))
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {user?.full_name || "User"}
          </span>
          <ChevronDown className="size-4 text-gray-500" />
        </div>

        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Settings className="size-5 text-gray-700" />
        </Button>
      </div>
    </div>
  );
};
