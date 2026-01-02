"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  pathLabels,
  routeDefaultTitles,
  routeHeaderLinks,
} from "@/app/(dashboard)/projects/_components/constants";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Get the current route segment (the part after /projects/)
  const currentRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const projectsIndex = segments.indexOf("projects");
    if (projectsIndex !== -1 && segments.length > projectsIndex + 1) {
      return segments[projectsIndex + 1];
    }
    return null;
  }, [pathname]);

  // Get header links for current route
  const headerLinks = useMemo(() => {
    if (!currentRoute) return [];
    return routeHeaderLinks[currentRoute] || [];
  }, [currentRoute]);

  // Get default title for current route
  const defaultTitle = useMemo(() => {
    if (!currentRoute) return "المشاريع";
    return routeDefaultTitles[currentRoute] || "المشاريع";
  }, [currentRoute]);

  return (
    <DynamicLayout
      pathLabels={pathLabels}
      headerLinks={headerLinks}
      defaultTitle={defaultTitle}
    >
      {children}
    </DynamicLayout>
  );
}
