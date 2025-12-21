// Temporary icons implementation using lucide-react
import React from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Settings,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

interface DashSvgProps {
  name: string;
  className?: string;
}

export const DashSvg = ({ name, className = "size-5" }: DashSvgProps) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    search: Search,
    notification: Bell,
    chat: MessageSquare,
    calender: Calendar,
    calendar: Calendar,
    settings: Settings,
    ai: Sparkles,
    image: ImageIcon,
  };

  const Icon = iconMap[name] || Search;

  return <Icon className={className} />;
};

