"use client";

import { Logo } from "@/components/shared/logo";
import { Routes } from "./routes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StorageService } from "@/lib/storage-service";

export const Navbar = () => {
  const user = StorageService.getUser();

  return (
    <div className="relative min-h-[96px] flex justify-between items-center">
      <div className="flex items-center gap-12">
        <Logo />
      </div>
      <Avatar className="size-11 cursor-pointer">
        <AvatarImage src="" alt={user?.full_name || "User"} />
        <AvatarFallback>
          {user?.full_name
            ?.split(" ")
            .map((name: string) => name.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
