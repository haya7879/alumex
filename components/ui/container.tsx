"use client";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { usePathname, useParams } from "next/navigation";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  coachingLinks,
  digitalDownloadsLinks,
  productsLinks,
} from "@/module/products";
import { LucideIcon } from "lucide-react";
import { FluentIcon } from "@fluentui/react-icons";
import Image from "next/image";
import { useSettingsForm } from "@/store/use-settings-form";

/**
 * Container Component System
 *
 * A flexible container system for creating consistent layouts with headers, content areas,
 * navigation, and actions.
 *
 * Basic Usage:
 * ```tsx
 * <Container>
 *   <ContainerHeaderList>
 *     <ContainerHeaderLink label="Link 1" href="/link1" />
 *     <ContainerHeaderLink label="Link 2" href="/link2" />
 *   </ContainerHeaderList>
 *   <ContainerHeader>
 *     <ContainerHeaderContent>
 *       <ContainerHeaderTitle>Page Title</ContainerHeaderTitle>
 *       <ContainerHeaderDescription>Page description text</ContainerHeaderDescription>
 *     </ContainerHeaderContent>
 *     <ContainerHeaderActions>
 *       <Button>Action</Button>
 *     </ContainerHeaderActions>
 *   </ContainerHeader>
 *   <ContainerContent>
 *     Your page content goes here
 *   </ContainerContent>
 * </Container>
 * ```
 *
 * Advanced Usage with Sidebar:
 * ```tsx
 * <Container>
 *   <ContainerHeaderList>
 *     <ContainerHeaderDropdown label="Dropdown" options={options} />
 *     <ContainerHeaderLink label="Link" href="/link" icon={Icon} />
 *   </ContainerHeaderList>
 *   <ContainerHeader>
 *     <ContainerHeaderContent>
 *       <ContainerHeaderBreadcrumb path={breadcrumbPath} />
 *       <ContainerHeaderTitle>Page Title</ContainerHeaderTitle>
 *     </ContainerHeaderContent>
 *   </ContainerHeader>
 *   <ContainerContent>
 *     <div className="flex">
 *       <ContainerContentSidebar options={sidebarOptions} />
 *       <div className="flex-1 p-4">Main content area</div>
 *     </div>
 *   </ContainerContent>
 * </Container>
 * ```
 */

const CONTAINER_HEADER_HEIGHT = 170;

interface ContainerContextType {
  fullSize: boolean;
  hasHeaderList: boolean;
}

const ContainerContext = React.createContext<ContainerContextType | undefined>(
  undefined
);

function useContainer() {
  const context = React.useContext(ContainerContext);
  if (context === undefined) {
    throw new Error("useContainer must be used within a Container");
  }
  return context;
}

/**
 * Container - The root component that wraps all container elements
 *
 * @param fullSize - When true, the container will take up the full width without rounded corners on the top right
 * @example
 * <Container>
 *   {children}
 * </Container>
 *
 * <Container fullSize>
 *   {children}
 * </Container>
 */
function Container({
  children,
  fullSize = false,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  fullSize?: boolean;
}) {
  // Create a ref to check if header has actions
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldBeFullSize, setShouldBeFullSize] = React.useState(fullSize);
  const [hasHeaderList, setHasHeaderList] = React.useState(false);

  React.useEffect(() => {
    if (containerRef.current) {
      // Check if there are no header actions
      const headerActions = containerRef.current.querySelector(
        '[data-slot="container-header-actions"]'
      );
      if (!headerActions || headerActions.children.length === 0) {
        setShouldBeFullSize(true);
      } else {
        setShouldBeFullSize(fullSize);
      }

      // Check if there is a header list
      const headerList = containerRef.current.querySelector(
        '[data-slot="container-header-list"]'
      );
      setHasHeaderList(!!headerList);
    }
  }, [fullSize, children]);

  return (
    <ContainerContext.Provider
      value={{ fullSize: shouldBeFullSize, hasHeaderList }}
    >
      <main
        ref={containerRef}
        data-slot="container"
        className="h-full w-full bg-transparent"
        {...props}
      >
        {children}
      </main>
    </ContainerContext.Provider>
  );
}

/**
 * ContainerContent - The main content area of the container
 *
 * @example
 * <ContainerContent>
 *   <p>Your content here</p>
 * </ContainerContent>
 */
function ContainerContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  fullSize?: boolean;
}) {
  const { fullSize } = useContainer();

  return (
    <div
      data-slot="container-content"
      className={cn(
        "w-full bg-background rounded-b-2xl rounded-tr-2xl p-6 mb-[26px]",
        fullSize && "rounded-tr-none",
        className
      )}
      style={{
        minHeight: `calc(100vh - ${CONTAINER_HEADER_HEIGHT}px)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ContainerHeader - The header section that contains title, description, and actions
 *
 * @example
 * <ContainerHeader>
 *   <ContainerHeaderContent>
 *     <ContainerHeaderTitle>Title</ContainerHeaderTitle>
 *   </ContainerHeaderContent>
 *   <ContainerHeaderActions>
 *     <Button>Action</Button>
 *   </ContainerHeaderActions>
 * </ContainerHeader>
 */
function ContainerHeader({
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="container-header-body"
      className="flex items-center justify-between h-16"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ContainerHeaderList - A horizontal list of navigation links or dropdowns
 *
 * @example
 * <ContainerHeaderList>
 *   <ContainerHeaderLink label="Link 1" href="/link1" />
 *   <ContainerHeaderDropdown label="Dropdown" options={options} />
 * </ContainerHeaderList>
 */
function ContainerHeaderList({
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="container-header-list"
      className={cn(
        "flex items-center w-fit rounded-t-2xl relative pr-2.5 dark:bg-background/50 bg-white/50"
      )}
      {...props}
    >
      {children}
    </div>
  );
}
/**
 * ContainerLvl2Link - A component to render a list of secondary navigation links
 *
 * @param lvl2_nav - Array of navigation items with title, href, and optional icon
 *
 * @example
 * <ContainerLvl2Link
 *   lvl2_nav={[
 *     { title: "Dashboard", href: "/dashboard", icon: DashboardIcon },
 *     { title: "Settings", href: "/settings", icon: SettingsIcon }
 *   ]}
 * />
 */
function ContainerLvl2Link({ ...props }: React.ComponentProps<"div">) {
  const { lvl2_nav } = useSettingsForm();

  return (
    <div className="flex items-center gap-2" {...props}>
      {lvl2_nav.map(
        (item: { title: string; href: string; icon: React.ElementType }) => (
          <ContainerHeaderLink
            key={item.title}
            label={item.title}
            href={item.href}
            icon={item.icon}
          />
        )
      )}
    </div>
  );
}
/**
 * ContainerHeaderLink - A navigation link in the header
 *
 * @param label - The text to display
 * @param href - The URL to navigate to
 * @param icon - Optional icon component to display before the label
 *
 * @example
 * <ContainerHeaderLink label="Dashboard" href="/dashboard" />
 * <ContainerHeaderLink label="Settings" href="/settings" icon={SettingsIcon} />
 */
function ContainerHeaderLink({
  label,
  href,
  icon: Icon,
  exact = false,
  ...props
}: React.ComponentProps<"a"> & {
  label: string;
  href: string;
  icon?: React.ElementType;
  exact?: boolean;
}) {
  const pathname = usePathname();

  const normalizedPath = pathname.replace(/^\/(en|ar)/, "");
  const normalizedHref = href.replace(/^\/(en|ar)/, "");

  // Check if this is an exact match or if we should check for path segments
  const isActive = exact
    ? normalizedPath === normalizedHref
    : normalizedPath === normalizedHref;

  return (
    <Link
      href={href}
      data-active={isActive}
      className={cn(
        "text-sm font-medium px-6 py-3 relative flex items-center gap-2 rounded-t-lg transition-all cursor-pointer",
        "before:absolute before:bottom-0 before:-left-6 before:h-10 before:w-6 before:bg-[url('/carved-left.svg')]  dark:before:bg-[url('/carved-left-dark.svg')] before:bg-contain before:bg-bottom before:bg-no-repeat before:content-[''] before:opacity-0 before:transition-opacity",
        "after:absolute after:-bottom-6 after:-right-6 after:h-10 after:w-6 after:bg-[url('/carved-right.svg')] dark:after:bg-[url('/carved-right-dark.svg')]  after:bg-contain after:bg-bottom before:bg-no-repeat before:content-[''] after:opacity-0 after:transition-opacity",
        isActive
          ? "bg-background text-brand-primary before:opacity-100 after:opacity-100"
          : "hover:text-brand-primary hover:before:opacity-100 hover:after:opacity-100 hover:bg-background"
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="sr-only xl:not-sr-only">{label}</span>
    </Link>
  );
}

function ContainerHeaderTabs({
  product,
}: {
  product?: "digital-downloads" | "coaching";
}) {
  if (!product) {
    return null;
  }

  if (product === "digital-downloads") {
    return (
      <>
        {digitalDownloadsLinks.map((option, index) => (
          <ContainerHeaderLink
            key={index}
            label={option.label}
            href={option.href}
            icon={option.icon}
          />
        ))}
      </>
    );
  }

  if (product === "coaching") {
    return (
      <>
        {coachingLinks.map((option, index) => (
          <ContainerHeaderLink
            key={index}
            label={option.label}
            href={option.href}
            icon={option.icon}
          />
        ))}
      </>
    );
  }

  return null;
}

/**
 * ContainerHeaderDropdown - A dropdown menu in the header
 *
 * @param label - The text to display on the dropdown trigger
 * @param options - Array of options with label and href properties
 *
 * @example
 * <ContainerHeaderDropdown
 *   label="Categories"
 *   options={[
 *     { label: "Category 1", href: "/category1" },
 *     { label: "Category 2", href: "/category2" }
 *   ]}
 * />
 */
function ContainerHeaderDropdown({
  label,
  options = productsLinks,
  ...props
}: React.ComponentProps<"ul"> & {
  label: string;
  options?: {
    label: string;
    href: string;
    icon: LucideIcon | FluentIcon | string;
    style?: string;
  }[];
}) {
  if (!options) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem
            className={cn(
              "flex items-center gap-2",
              "text-sm font-medium px-6 py-3 relative rounded-t-lg transition-all !bg-transparent cursor-pointer min-h-[44px]"
            )}
          >
            {label}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "flex items-center gap-2",
              "text-sm font-medium pr-6 py-3 relative rounded-t-lg transition-all !bg-transparent cursor-pointer min-h-[44px]"
            )}
          >
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-4 w-[294px] p-4" {...props}>
              {options.map(({ label, icon: Icon, href, style }, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2 h-12 rounded-md p-2 cursor-pointer border-2 border-transparent transition-all duration-200 bg-gradient-to-t",
                      style
                    )}
                  >
                    {Icon && typeof Icon === "string" && (
                      <Image src={Icon} alt={label} width={20} height={20} />
                    )}
                    {Icon && typeof Icon !== "string" && (
                      <Icon className="w-4 h-4" />
                    )}
                    <p className="text-sm font-medium">{label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/**
 * ContainerHeaderTitle - The main title in the header
 *
 * @example
 * <ContainerHeaderTitle>Dashboard</ContainerHeaderTitle>
 */
function ContainerHeaderTitle({
  children,
  ...props
}: React.ComponentProps<"h1"> & {
  children: React.ReactNode;
}) {
  return (
    <h1
      className="text-primary dark:text-white text-xl font-semibold"
      {...props}
    >
      {children}
    </h1>
  );
}

/**
 * ContainerHeaderDescription - A description text below the title
 *
 * @example
 * <ContainerHeaderDescription>
 *   Manage your account settings and preferences
 * </ContainerHeaderDescription>
 */
function ContainerHeaderDescription({
  children,
  ...props
}: React.ComponentProps<"p"> & {
  children: React.ReactNode;
}) {
  return (
    <p
      className="text-gray-400 dark:text-gray-500 text-xs font-normal"
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * ContainerHeaderContent - Wrapper for title and description in the header
 *
 * @example
 * <ContainerHeaderContent>
 *   <ContainerHeaderTitle>Dashboard</ContainerHeaderTitle>
 *   <ContainerHeaderDescription>Overview of your account</ContainerHeaderDescription>
 * </ContainerHeaderContent>
 */
function ContainerHeaderContent({
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  const { fullSize, hasHeaderList } = useContainer();

  return (
    <div
      className={cn(
        "relative bg-background flex-1 flex items-center px-6 rounded-tr-2xl h-full transition-all",
        "after:absolute after:bottom-0 after:-right-4 after:h-6 after:w-4 after:bg-[url('/carved-right.svg')] after:bg-contain after:bg-bottom after:bg-no-repeat after:content-['']",
        fullSize && "after:hidden",
        !hasHeaderList && "rounded-tl-2xl"
      )}
    >
      <div className="flex flex-col gap-0.5" {...props}>
        {children}
      </div>
    </div>
  );
}

/**
 * ContainerHeaderBreadcrumb - Breadcrumb navigation in the header
 *
 * @param path - Optional custom breadcrumb path. If not provided, it will be generated from the URL
 *
 * @example
 * // Auto-generated from URL
 * <ContainerHeaderBreadcrumb />
 *
 * // Custom breadcrumb path
 * <ContainerHeaderBreadcrumb
 *   path={[
 *     { label: "Home", href: "/" },
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Settings", href: "/dashboard/settings" }
 *   ]}
 * />
 */
function ContainerHeaderBreadcrumb({
  path,
  ...props
}: React.ComponentProps<"nav"> & {
  path?: {
    label: string;
    href: string;
  }[];
}) {
  const { locale } = useParams();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean).slice(1);
  const rootSegment = segments[0];

  const pathFormatted = path
    ? path.map((item) => ({
        label: item.label,
        href: `/${locale}/${item.href}`,
      }))
    : [];

  const formatSegment = (segment: string) => {
    // Replace ampersand with space and capitalize first letter
    return (
      segment.charAt(0).toUpperCase() +
      segment.slice(1).replace(/-/g, " ").replace(/&/g, " ")
    );
  };

  const buildPath = (segmentIndex: number) => {
    return `/${locale}/${segments.slice(0, segmentIndex + 1).join("/")}`;
  };

  if (path && path.length > 0) {
    return (
      <Breadcrumb {...props}>
        <BreadcrumbList>
          {pathFormatted.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index === pathFormatted.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index !== pathFormatted.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={buildPath(0)}>
            {formatSegment(rootSegment)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {segments.length > 5 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">More breadcrumb items</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {segments.slice(1, -1).map((segment, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={buildPath(index + 1)}>
                        {formatSegment(segment)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {segments.length > 2 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={buildPath(1)}>
                {formatSegment(segments[1])}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>
            {formatSegment(segments[segments.length - 1])}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * ContainerHeaderActions - Container for action buttons in the header
 *
 * @example
 * <ContainerHeaderActions>
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </ContainerHeaderActions>
 */
function ContainerHeaderActions({
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="container-header-actions"
      className={cn("flex items-center justify-end gap-3 px-3 py-1")}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ContainerContentSidebar - A sidebar for the content area
 *
 * @param options - Array of navigation options with label and href properties
 *
 * @example
 * <ContainerContentSidebar
 *   options={[
 *     { label: "General", href: "/settings/general" },
 *     { label: "Security", href: "/settings/security" }
 *   ]}
 * />
 */
function ContainerContentSidebar({
  options,
  theme,
  ...props
}: React.ComponentProps<"div"> & {
  options: { label: string; href: string }[];
  theme?: "coaching" | "products" | "digital-download";
}) {
  const pathname = usePathname();

  const normalizedPath = pathname.replace(/^\/(en|ar)/, "");

  const normalizedPathArray = normalizedPath.split("/").filter(Boolean);

  return (
    <div
      data-slot="container-content-sidebar"
      className={cn(
        "flex flex-col gap-3 border-r !w-[176px] border-gray-50 dark:border-gray-800",
        "h-full px-1.5"
      )}
      {...props}
    >
      {options.map((option, index) => (
        <Link
          key={index}
          href={option.href}
          className={cn(
            "text-sm text-gray-500 dark:text-gray-400 font-normal px-2 py-1.5 transition-all cursor-pointer truncate whitespace-nowrap",
            theme === "products" &&
              "hover:text-brand2-700 dark:hover:text-brand2-500",
            theme === "coaching" &&
              "hover:text-[#EF507B] dark:hover:text-[#FF6B96]",
            option.href === `/${normalizedPathArray.join("/")}` &&
              theme === "coaching" &&
              "text-[#EF507B] dark:text-[#FF6B96] font-medium",
            theme === "products" &&
              option.href === `/${normalizedPathArray.join("/")}` &&
              "text-brand2-700 dark:text-brand2-500 font-medium",
            theme === "digital-download" &&
              option.href === `/${normalizedPathArray.join("/")}` &&
              "text-[#C99835] dark:text-[#E5B04D] font-medium"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

function ContainerPage({
  title,
  description,
  breadcrumb = false,
  actions,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
  breadcrumb?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <ContainerHeader>
        <ContainerHeaderContent>
          {breadcrumb && <ContainerHeaderBreadcrumb />}
          {title && <ContainerHeaderTitle>{title}</ContainerHeaderTitle>}
          {description && (
            <ContainerHeaderDescription>
              {description}
            </ContainerHeaderDescription>
          )}
        </ContainerHeaderContent>
        {actions && <ContainerHeaderActions>{actions}</ContainerHeaderActions>}
      </ContainerHeader>
      <ContainerContent className={cn(className)} {...props}>
        {children}
      </ContainerContent>
    </React.Fragment>
  );
}

export {
  Container,
  ContainerContent,
  ContainerHeaderList,
  ContainerHeaderTabs,
  ContainerLvl2Link,
  ContainerHeaderLink,
  ContainerHeaderDropdown,
  ContainerHeaderTitle,
  ContainerHeaderDescription,
  ContainerHeaderContent,
  ContainerHeaderBreadcrumb,
  ContainerHeaderActions,
  ContainerHeader,
  ContainerContentSidebar,
  ContainerPage,
  useContainer,
};
