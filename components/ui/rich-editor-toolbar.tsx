import React from "react";
import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2 as LinkIcon,
  Image as ImageIcon,
  Minus,
  Plus,
} from "lucide-react";

interface RichEditorToolbarProps {
  editor: Editor | null;
}

const fontFamilies = [
  { label: "Inter", value: "Inter" },
  { label: "Poppins", value: "Poppins" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Times New Roman", value: "Times New Roman" },
];

const RichEditorToolbar: React.FC<RichEditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleAddImage = () => {
    const url = window.prompt("Image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFontSize = (increase: boolean) => {
    if (!editor) return;

    const currentSizeAttr = editor.getAttributes("textStyle").fontSize;
    // Default to 12pt if no size is set (adjust default as needed)
    let currentSizePt = 12;
    if (
      currentSizeAttr &&
      typeof currentSizeAttr === "string" &&
      currentSizeAttr.endsWith("pt")
    ) {
      currentSizePt = parseInt(currentSizeAttr.replace("pt", ""), 10) || 12;
    }

    // Define step size (e.g., 2pt)
    const step = 2;
    // Use const as newSizePt is not reassigned after calculation
    const newSizePt = increase
      ? currentSizePt + step
      : Math.max(step, currentSizePt - step); // Ensure size doesn't go below step

    // Optional: Define min/max font sizes
    // const minSize = 8;
    // const maxSize = 72;
    // newSizePt = Math.max(minSize, Math.min(maxSize, newSizePt));

    editor.chain().focus().setFontSize(`${newSizePt}pt`).run();
  };

  const currentFontFamily =
    editor.getAttributes("textStyle")?.fontFamily || "Poppins";

  return (
    <div className="flex items-center gap-2 justify-start">
      <Select
        value={currentFontFamily}
        onValueChange={(value) => {
          if (typeof value === "string") {
            editor.chain().focus().setFontFamily(value).run();
          }
        }}
      >
        <SelectTrigger className="w-[150px] h-8 text-xs">
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem key={font.value} value={font.value} className="text-xs">
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToggleGroup
        type="multiple"
        size="sm"
        value={["bold", "italic", "underline"].filter((mark) =>
          editor.isActive(mark)
        )}
        onValueChange={(values) => {
          if (!values.includes("bold") && editor.isActive("bold"))
            editor.chain().focus().toggleBold().run();
          if (values.includes("bold") && !editor.isActive("bold"))
            editor.chain().focus().toggleBold().run();
          if (!values.includes("italic") && editor.isActive("italic"))
            editor.chain().focus().toggleItalic().run();
          if (values.includes("italic") && !editor.isActive("italic"))
            editor.chain().focus().toggleItalic().run();
          if (!values.includes("underline") && editor.isActive("underline"))
            editor.chain().focus().toggleUnderline().run();
          if (values.includes("underline") && !editor.isActive("underline"))
            editor.chain().focus().toggleUnderline().run();
        }}
      >
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          disabled={!editor.can().toggleBold()}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          disabled={!editor.can().toggleItalic()}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          disabled={!editor.can().toggleUnderline()}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Separator orientation="vertical" className="!h-6" />
      <Toggle
        size="sm"
        aria-label="Decrease font size"
        onPressedChange={() => handleFontSize(false)}
        className="relative"
      >
        <Minus className="!h-2 !w-2 absolute top-1 right-1" />A
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Increase font size"
        onPressedChange={() => handleFontSize(true)}
        className="relative"
      >
        <Plus className="!h-2 !w-2 absolute top-1 right-1" />A
      </Toggle>

      <Separator orientation="vertical" className="!h-6" />

      <ToggleGroup
        type="single"
        size="sm"
        value={
          ["left", "center", "right"].find((align) =>
            editor.isActive({ textAlign: align })
          ) || "left"
        }
        onValueChange={(value) => {
          if (value) editor.chain().focus().setTextAlign(value).run();
        }}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="!h-6" />

      <Toggle size="sm" aria-label="Add image" onPressedChange={handleAddImage}>
        <ImageIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Set link"
        pressed={editor.isActive("link")}
        onPressedChange={handleSetLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="!h-6" />

      <ToggleGroup
        type="multiple"
        size="sm"
        value={["bulletList", "orderedList"].filter((list) =>
          editor.isActive(list)
        )}
        onValueChange={(values) => {
          if (!values.includes("bulletList") && editor.isActive("bulletList"))
            editor.chain().focus().toggleBulletList().run();
          if (values.includes("bulletList") && !editor.isActive("bulletList"))
            editor.chain().focus().toggleBulletList().run();
          if (!values.includes("orderedList") && editor.isActive("orderedList"))
            editor.chain().focus().toggleOrderedList().run();
          if (values.includes("orderedList") && !editor.isActive("orderedList"))
            editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ToggleGroupItem value="bulletList">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="orderedList">
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default RichEditorToolbar;
