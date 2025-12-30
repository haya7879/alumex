"use client";
import React, {
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
const BACKGROUND_THEMES = {
  default: {
    topRight: "bg-[#C4D2De]",
    bottomLeft: "bg-[#3675AF]",
    topLeft: "bg-[#3675AF]",
    bottomRight: "bg-[#3675AF]",
  },
};

type ThemeVariant = keyof typeof BACKGROUND_THEMES;
// Simple debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}

interface BackgroundGradientProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ThemeVariant;
}

export const BackgroundGradient = ({
  className,
  variant = "default",
  ...props
}: BackgroundGradientProps) => {
  const colors = BACKGROUND_THEMES[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const pathname = usePathname();

  // Use useCallback to memoize the height update function
  const updateHeight = useCallback(() => {
    // Calculate height based on document scrollHeight for content changes
    // and window.innerHeight for viewport size
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    setPageHeight(Math.max(windowHeight, documentHeight));
  }, []);

  useEffect(() => {
    // Debounced resize handler
    const debouncedUpdateHeight = debounce(updateHeight, 250); // Adjust debounce time as needed

    // Initial height calculation
    updateHeight();

    // Update height after initial content loads
    window.addEventListener("load", updateHeight);

    // Update on window resize (debounced)
    window.addEventListener("resize", debouncedUpdateHeight);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("load", updateHeight);
      window.removeEventListener("resize", debouncedUpdateHeight);
    };
    // Rerun effect if updateHeight function identity changes (shouldn't with useCallback)
    // or if the route changes (pathname)
  }, [pathname, updateHeight]);

  // Memoize style objects
  const topRightStyle = useMemo(
    () => ({
      top: `-${pageHeight * 0.15}px`,
      right: "-15%",
      height: `${pageHeight * 0.5}px`,
    }),
    [pageHeight]
  );

  const bottomLeftStyle = useMemo(
    () => ({
      bottom: `-${pageHeight * 0.15}px`,
      left: "-15%",
      height: `${pageHeight * 0.5}px`,
    }),
    [pageHeight]
  );

  const topLeftStyle = useMemo(
    () => ({
      top: `-${pageHeight * 0.1}px`,
      left: "-15%",
      height: `${pageHeight * 0.9}px`,
    }),
    [pageHeight]
  );

  const bottomRightStyle = useMemo(
    () => ({
      bottom: `-${pageHeight * 0.1}px`,
      right: "-15%",
      height: `${pageHeight * 0.9}px`,
    }),
    [pageHeight]
  );

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 -z-10 overflow-hidden", className)}
      // Use minHeight to ensure it covers at least the viewport initially
      // Style calculation remains the same, but relies on less frequent updates
      style={{ minHeight: `${pageHeight}px` }}
      {...props}
    >
      <div
        className={cn(
          "absolute w-[45%]",
          colors.topRight,
          "rounded-full blur-[80px] opacity-40 z-10 transition-all duration-500"
        )}
        style={topRightStyle}
      />
      <div
        className={cn(
          "absolute w-[45%]",
          colors.bottomLeft,
          "rounded-full blur-[80px] opacity-90 z-10 transition-all duration-500"
        )}
        style={bottomLeftStyle}
      />
      <div
        className={cn(
          "absolute w-[80%]",
          colors.topLeft,
          "rounded-br-full blur-[150px] opacity-50 z-10 transition-all duration-500"
        )}
        style={topLeftStyle}
      />
      <div
        className={cn(
          "absolute w-[80%]",
          colors.bottomRight,
          "rounded-tl-full blur-[150px] opacity-40 z-10 transition-all duration-500"
        )}
        style={bottomRightStyle}
      />
    </div>
  );
};
