"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Cross2Icon, CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[];
  onChange?: (options: Option[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
  /** Maximum number of visible selected items. If exceeded, shows count. */
  maxVisible?: number;
  /** Enable/disable input search functionality. Default is true. */
  inputSearch?: boolean;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("px-2 py-4 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
      maxVisible,
      inputSearch = true,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [selected, setSelected] = React.useState<Option[]>(value || []);
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => {
          setOpen(true);
          setTimeout(() => inputRef?.current?.focus(), 100);
        },
        reset: () => setSelected([]),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setInputValue("");
      }
    };

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (inputValue === "" && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            // If last item is fixed, we should not remove it.
            if (lastSelectOption && !lastSelectOption.fixed) {
              handleUnselect(lastSelectOption);
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          setOpen(false);
          setInputValue("");
        }
      },
      [handleUnselect, selected, inputValue]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      /** sync search */
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      const exec = async () => {
        if (!onSearchSync || !open) return;

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    useEffect(() => {
      /** async search */
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer mx-1 mb-1"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }
            setInputValue("");
            const newOptions = [...selected, { value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator || "No items found"}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator || "No items found"}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = options;

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    const handleToggleDropdown = () => {
      if (disabled) return;
      setOpen(!open);
      if (!open) {
        setTimeout(() => inputRef?.current?.focus(), 100);
      } else {
        setInputValue("");
      }
    };

    return (
      <div ref={dropdownRef} className="relative">
        <Command
          {...commandProps}
          onKeyDown={(e) => {
            handleKeyDown(e);
            commandProps?.onKeyDown?.(e);
          }}
          className={cn(
            "h-auto overflow-visible bg-transparent",
            commandProps?.className
          )}
          shouldFilter={
            commandProps?.shouldFilter !== undefined
              ? commandProps.shouldFilter
              : !onSearch
          }
          filter={commandFilter()}
        >
          {/* Main trigger area */}
          <div
            className={cn(
              "relative min-h-10 rounded-full border border-input text-sm transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
              {
                "p-1": selected.length !== 0,
                "cursor-pointer": !disabled,
              },
              !hideClearAllButton && "pe-9",
              className
            )}
            onClick={handleToggleDropdown}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length === 0 ? (
                <span className="px-3 py-2.5 text-muted-foreground">
                  {placeholder || "Select options..."}
                </span>
              ) : (
                selected
                  .slice(
                    0,
                    typeof maxVisible === "number"
                      ? maxVisible
                      : selected.length
                  )
                  .map((option, idx) => (
                    <div
                      key={`${option.value}-${idx}`}
                      className={cn(
                        "animate-fadeIn relative inline-flex h-8 cursor-default items-center rounded-full border border-[#E4E7EC] bg-background pe-7 pl-2 ps-2 text-xs font-medium text-secondary-foreground transition-all hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 data-[fixed]:pe-2",
                        badgeClassName
                      )}
                      data-fixed={option.fixed}
                      data-disabled={disabled || undefined}
                    >
                      {option.label}
                      <button
                        className="absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-lg border border-transparent p-0 text-muted-foreground/80 outline-0 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring/70"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(option);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnselect(option);
                        }}
                        aria-label="Remove"
                      >
                        <Cross2Icon
                          width={14}
                          height={14}
                          strokeWidth={2}
                          className="mt-1"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ))
              )}
              {maxVisible && selected.length > maxVisible && (
                <div
                  className={cn(
                    "animate-fadeIn relative inline-flex h-8 px-3 cursor-default items-center rounded-full border border-[#E4E7EC] bg-background text-xs font-medium text-secondary-foreground transition-all hover:bg-background",
                    badgeClassName
                  )}
                >
                  +{selected.length - maxVisible}
                </div>
              )}

              {/* Chevron and Clear all button wrapper */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Clear all button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected.filter((s) => s.fixed));
                    onChange?.(selected.filter((s) => s.fixed));
                  }}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
                    (hideClearAllButton ||
                      disabled ||
                      selected.length < 1 ||
                      selected.filter((s) => s.fixed).length ===
                        selected.length) &&
                      "hidden"
                  )}
                  aria-label="Clear all"
                >
                  <Cross2Icon
                    width={16}
                    height={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>{" "}
                {/* Dropdown arrow */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex size-4 items-center justify-center text-muted-foreground transition-transform"
                  style={{
                    transform: `rotate(${open ? 180 : 0}deg)`,
                  }}
                  aria-label="Toggle dropdown"
                  onClick={handleToggleDropdown}
                >
                  <ChevronDownIcon width={16} height={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown */}
          <div
            className={cn(
              "absolute top-full z-50 w-full overflow-hidden rounded-lg border border-input bg-popover shadow-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              !open && "hidden"
            )}
            data-state={open ? "open" : "closed"}
          >
            {open && (
              <CommandList className="max-h-[300px] overflow-auto">
                {/* Search input at the top of the dropdown */}
                {inputSearch && (
                  <div className="sticky top-0 z-20 bg-popover px-2 py-2 border-b border-border">
                    <CommandPrimitive.Input
                      {...inputProps}
                      ref={inputRef}
                      value={inputValue}
                      disabled={disabled}
                      onValueChange={(value) => {
                        setInputValue(value);
                        inputProps?.onValueChange?.(value);
                      }}
                      placeholder={placeholder || "Search..."}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                      autoFocus
                    />
                  </div>
                )}

                {/* Dropdown options */}
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {loadingIndicator || "Loading..."}
                  </div>
                ) : (
                  <>
                    {EmptyItem()}
                    {CreatableItem()}
                    {!selectFirstItem && (
                      <CommandItem value="-" className="hidden" />
                    )}
                    {Object.entries(selectables).map(([key, dropdowns]) => (
                      <CommandGroup
                        key={key}
                        heading={key}
                        className="h-full overflow-auto"
                      >
                        {dropdowns.map((option) => {
                          const isSelected = selected.some(
                            (s) => s.value === option.value
                          );
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                const isSelected = selected.some(
                                  (s) => s.value === option.value
                                );
                                let newOptions;
                                if (isSelected) {
                                  newOptions = selected.filter(
                                    (s) => s.value !== option.value
                                  );
                                } else {
                                  if (selected.length >= maxSelected) {
                                    onMaxSelected?.(selected.length);
                                    return;
                                  }
                                  newOptions = [...selected, option];
                                }
                                setInputValue("");
                                setSelected(newOptions);
                                onChange?.(newOptions);
                              }}
                              className={cn(
                                "cursor-pointer flex items-center justify-between",
                                option.disable &&
                                  "cursor-not-allowed opacity-50"
                              )}
                            >
                              <span>{option.label}</span>
                              {isSelected && (
                                <CheckIcon className="ml-2 w-4 h-4 text-primary" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    ))}
                  </>
                )}
              </CommandList>
            )}
          </div>
        </Command>
      </div>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";
export { MultipleSelector };
