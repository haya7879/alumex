"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Maximize2,
  Minimize2,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { StorageService } from "@/lib/storage-service";

export interface PageHeaderProps {
  title?: string;
  breadcrumb?: { label: string; href: string }[];
  className?: string;
}

export default function PageHeader({
  title,
  breadcrumb,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();
  const user = StorageService.getUser();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate breadcrumb from pathname if not provided
  const generateBreadcrumb = () => {
    if (breadcrumb) return breadcrumb;

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: { label: string; href: string }[] = [];

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbItems.push({ label, href });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumb();

  // Get page title from breadcrumb or use provided title
  const pageTitle =
    title || breadcrumbItems[breadcrumbItems.length - 1]?.label || "Page";

  // Get user initials
  const userInitials =
    user?.full_name
      ?.split(" ")
      .map((name: string) => name.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Check fullscreen state on mount and when it changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    // TODO: Implement language change logic
    console.log("Language changed to:", lang);
  };

  // Handle profile actions
  const handleProfileAction = (action: string) => {
    switch (action) {
      case "profile":
        // TODO: Navigate to profile page
        console.log("Navigate to profile");
        break;
      case "settings":
        // TODO: Navigate to settings
        console.log("Navigate to settings");
        break;
      case "logout":
        // Clear user data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        break;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white p-4 rounded-lg mb-4 border-b",
        className
      )}
    >
      <div className="flex-1">
        {/* Page Title */}
        <h1 className="font-bold text-gray-900 mb-2">{pageTitle}</h1>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
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
          <DropdownMenuContent align="end" className="w-56">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
