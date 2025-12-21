import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  maxLength?: number;
  showCount?: boolean;
}

function Textarea({
  className,
  maxLength = 200,
  showCount = true,
  ...props
}: TextareaProps) {
  const [charCount, setCharCount] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      setCharCount(textareaRef.current.value.length || 0);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length || 0);
    props.onChange?.(e);
  };

  React.useEffect(() => {
    if (props.value !== undefined) {
      setCharCount(String(props.value).length || 0);
    } else if (props.defaultValue !== undefined) {
      setCharCount(String(props.defaultValue).length || 0);
    }
  }, [props.value, props.defaultValue]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "relative placeholder:text-muted-foreground border-border-secondary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-2xl border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          showCount && "pb-6",
          className
        )}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      {showCount && (
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground font-medium">
          {charCount} of {maxLength} characters
        </div>
      )}
    </div>
  );
}

export { Textarea };
