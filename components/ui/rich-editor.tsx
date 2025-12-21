"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import RichEditorToolbar from "./rich-editor-toolbar";

import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";

interface RichEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export const RichEditor: React.FC<RichEditorProps> = ({
  initialContent,
  onChange,
  className,
  size = "md",
}) => {
  const editor = useEditor({  
    extensions: [
      StarterKit.configure({
        // Disable default heading behavior if you want custom control
        // e.g., using a dropdown for H1, H2, etc.
        // heading: false,
        // Disable default bold/italic/strike if using ToggleGroup
        // bold: false,
        // italic: false,
        // strike: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: false,
      }),
      TextStyle,
      FontFamily,
      FontSize.configure({
        types: ["textStyle"],
      }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base max-w-none p-4 focus:outline-none min-h-[150px]",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn("rounded-[24px] border dark:border-gray-200 flex flex-col p-4 pb-1", className)}
    >
      <RichEditorToolbar editor={editor} />
      <div className="overflow-hidden h-full">
        <ScrollArea
          className={cn(
            "flex-1 h-[300px]",
            size === "xs" && "h-[150px]",
            size === "sm" && "h-[200px]",
            size === "md" && "h-[300px]",
            size === "lg" && "h-[400px]"
          )}
        >
          <EditorContent editor={editor} />
        </ScrollArea>
      </div>
    </div>
  );
};
