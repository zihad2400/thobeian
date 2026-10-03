export default function Skeleton({ className = "", variant = "text" }) {
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-32",
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant] || ""} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-border overflow-hidden rounded-2xl">
      {/* Image skeleton with SAME ratio */}
      <div
        className="relative w-full bg-gray-200 animate-pulse"
        style={{ paddingBottom: "133.33%" }}
      />
      <div className="p-4 md:p-5 space-y-3">
        <Skeleton variant="title" className="h-5 w-full" />
        <Skeleton variant="text" className="h-3 w-1/2" />
        <Skeleton variant="text" className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
