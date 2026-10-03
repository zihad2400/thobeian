"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingStars({
  value = 0,
  onChange,
  size = 24,
  readonly = false,
  showCount = true,
  className = "",
}) {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  const handleClick = (star) => {
    if (readonly) return;
    onChange?.(star);
  };

  const handleMouseEnter = (star) => {
    if (readonly) return;
    setHover(star);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHover(0);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform duration-200`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                star <= displayValue
                  ? "fill-gold text-gold"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      {showCount && displayValue > 0 && (
        <span className="ml-2 text-xs text-text-secondary font-medium min-w-[60px]">
          {displayValue} / 5
        </span>
      )}
    </div>
  );
}
