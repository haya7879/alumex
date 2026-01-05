import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook for copying text to clipboard
 * Provides a function to copy text and show success/error notifications
 * Includes copied state management
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  /**
   * Copies text to clipboard and shows a success toast
   * @param text - The text to copy to clipboard
   * @param successMessage - Optional custom success message (default: "تم النسخ بنجاح")
   * @param resetTimeout - Optional timeout to reset copied state (in ms, default: 2000)
   */
  const copyToClipboard = async (
    text: string,
    successMessage?: string,
    resetTimeout?: number
  ): Promise<void> => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage || "تم النسخ بنجاح");
      
      if (resetTimeout !== undefined) {
        setTimeout(() => setCopied(false), resetTimeout);
      }
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
      toast.error("فشل نسخ النص");
    }
  };

  return {
    copyToClipboard,
    copied,
    setCopied,
  };
}

