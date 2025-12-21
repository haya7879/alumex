import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Coaching Program Card Skeleton Component
interface CoachingProgramCardSkeletonProps {
  viewMode?: "grid" | "list";
}

function CoachingProgramCardSkeleton({
  viewMode = "grid",
}: CoachingProgramCardSkeletonProps) {
  const cardContainerStyles = cn(
    "group relative overflow-hidden",
    viewMode === "grid" ? "rounded-lg space-y-2" : "flex items-center gap-6"
  );

  const imageContainerStyles = cn(
    "relative",
    viewMode === "grid" ? "h-[164px]" : "h-[85.5px] w-[152px]"
  );

  const contentContainerStyles = cn(
    viewMode === "grid"
      ? "space-y-2"
      : "flex-1 flex items-center justify-between"
  );

  const titleContainerStyles = cn(
    "flex flex-col gap-2",
    viewMode === "grid" ? "w-full" : "w-[300px]"
  );

  const statisticsContainerStyles = cn(
    "flex items-center gap-2",
    viewMode === "grid"
      ? "justify-between"
      : "w-[400px] justify-end flex-row-reverse"
  );

  return (
    <article className={cardContainerStyles}>
      {/* Program Image Skeleton */}
      <div className={imageContainerStyles}>
        <Skeleton className="size-full rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className={contentContainerStyles}>
        {/* Title and Coach Information Skeleton */}
        <div className={titleContainerStyles}>
          {/* Title Skeleton */}
          <Skeleton className="h-5 w-full" />

          {/* Coach Information Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Avatar Skeleton */}
              <Skeleton className="size-8 rounded-full" />
              {/* Coach Name Skeleton */}
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Date Skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-4" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Statistics and Badge Skeleton */}
        <div className={statisticsContainerStyles}>
          {/* Statistics Skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Skeleton className="size-2.5" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-2.5" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          {/* Badge Skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Action Buttons Skeleton for List View */}
        {viewMode === "list" && (
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        )}
      </div>
    </article>
  );
}

export { Skeleton, CoachingProgramCardSkeleton };
