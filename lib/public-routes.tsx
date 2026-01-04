"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocalStorageStore } from "@/store/use-local-storage-store";
import { StorageService } from "@/services/token/storage-service";

interface PublicRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component for public routes (like login, register)
 * Redirects to dashboard if user is already authenticated
 * Prevents rendering the page content if user is authenticated
 */
export default function PublicRouteGuard({ children }: PublicRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useLocalStorageStore();
  
  // Check authentication immediately on mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return StorageService.isAuthenticated();
  });

  // Use useLayoutEffect to redirect before paint
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const authenticated = StorageService.isAuthenticated();

    if (authenticated) {
      setIsAuthenticated(true);
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl && returnUrl !== "/auth/login") {
        localStorage.removeItem("returnUrl");
        router.replace(returnUrl);
      } else {
        router.replace("/");
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [router, pathname, user]);

  // If authenticated or checking, don't render children (redirect will happen)
  if (isAuthenticated === true || isAuthenticated === null) {
    return null;
  }

  // User is not authenticated, render children
  return <>{children}</>;
}

