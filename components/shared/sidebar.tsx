"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, FolderKanban, Ruler, DollarSign, ClipboardList, LogOut, Moon, Sun } from "lucide-react";
import { useModalStore, EModalType } from "@/store/use-modal-store";
import { LogoutModal } from "./logout-modal";
import { StorageService } from "@/lib/storage-service";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
const UserAvatar = () => {
  const user = StorageService.getUser();

  return (
    <div className="flex items-center w-full">
      <Avatar className="size-13">
        <AvatarImage src="" />
        <AvatarFallback className="bg-slate-600 text-white">
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
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const buttons = [
    {
      icon: <ShoppingCart className="size-5" />,
      href: "/sales/daily-follow-up"
    },
    {
      icon: <FolderKanban className="size-5" />,
      href: "/projects"
    },
    {
      icon: <Ruler className="size-5" />,
      href: "/measurements"
    },
    {
      icon: <DollarSign className="size-5" />,
      href: "/financial"
    },
    {
      icon: <ClipboardList className="size-5" />,
      href: "/tasks-management"
    },
    {
      icon: <LogOut className="size-5" />,
      onClick: () => onOpen(EModalType.LOGOUT),
    },
    {
      icon: mounted && theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      ),
      className: "size-13 rounded-full bg-white/40",
      onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
  ];

  return (
    <>
      <div className="fixed right-0 top-0 h-full px-[15px] py-6">
        <div className="h-full p-3 rounded-full w-18 flex flex-col gap-4 items-center bg-white/30">
          <UserAvatar />

          {buttons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={"size-13 rounded-full bg-white/20 cursor-pointer text-black/70"}
              onClick={() => {
                if (button.onClick) {
                  button.onClick();
                } else if (button.href) {
                  router.push(button.href);
                }
              }}
            >
              {button.icon}
            </Button>
          ))}
        </div>
      </div>
      <LogoutModal />
    </>
  );
};
