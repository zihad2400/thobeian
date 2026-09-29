export default function Skeleton({ className = "", variant = "text" }) {
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    image: "h-64 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-32",
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="image" className="aspect-[3/4]" />
      <Skeleton variant="title" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}

export function SkeletonGrid({ count = 8, columns = 4 }) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}