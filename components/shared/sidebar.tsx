"use client";
import * as React from "react";
import { DashSvg } from "@/assets/icons";
import { Calendar, LogOut, Settings } from "lucide-react";
import { useModalStore } from "@/store/use-modal-store";
import { EModalType } from "@/config/enums";
import { LogoutModal } from "./logout-modal";
import { useLocalStorageStore } from "@/store/use-local-storage-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
const UserAvatar = () => {
  const { user } = useLocalStorageStore();

  return (
    <div className="flex items-center w-full">
      <Avatar className="size-12">
        <AvatarImage src="" />
        <AvatarFallback className="bg-slate-600 dark:bg-gray-800 text-white">
          {user?.full_name
            ?.split(" ")
            .map((name: string) => name.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-xs font-medium text-[#7B8495] sr-only">
        {user?.full_name}
      </p>
    </div>
  );
};

export const Sidebar = () => {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const pathname = usePathname();
  const [note_open, setNoteOpen] = React.useState(false);

  return (
    <>
      <div className="fixed right-0 top-0 h-full px-[15px] py-6">
        <div className="h-full p-3 rounded-full w-18 flex flex-col gap-4 items-center bg-white/30 dark:bg-[#0C111D4D]">
          {/* User Button */}
          <UserAvatar />

          {/* Quick Access Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full bg-white/40 dark:bg-[#0C111DB2]"
            onClick={() => router.push("/settings")}
          >
            <Settings className="size-4" />
          </Button>
          <div className="h-12 w-12 flex items-center justify-center">
            <ModeToggle />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full bg-white/40 dark:bg-[#0C111DB2]"
            onClick={() => onOpen(EModalType.LOGOUT)}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>

      <LogoutModal />
    </>
  );
};
