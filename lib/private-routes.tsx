"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocalStorageStore } from "@/store/use-local-storage-store";
import { StorageService } from "@/services/token/storage-service";

interface PrivateRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component to protect private routes
 * Redirects to login if user is not authenticated
 */
export default function PrivateRouteGuard({ children }: PrivateRouteGuardProps) {
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

    setIsAuthenticated(authenticated);

    // If not authenticated, redirect to login
    if (!authenticated) {
      // Store the current path to redirect back after login
      const returnUrl = pathname !== "/auth/login" ? pathname : "/sales/daily-follow-up";
      localStorage.setItem("returnUrl", returnUrl);
      router.replace("/auth/login");
    }
  }, [router, pathname, user]);

  // If not authenticated or checking, don't render children (redirect will happen)
  if (isAuthenticated === false || isAuthenticated === null) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

