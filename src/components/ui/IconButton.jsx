"use client";

import Link from "next/link";

export default function IconButton({
  href,
  onClick,
  children,
  badge,
  label,
  className = "",
}) {
  const content = (
    <div
      className={`relative p-2 hover:text-gold transition-colors cursor-pointer ${className}`}
      aria-label={label}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return <button onClick={onClick}>{content}</button>;
}