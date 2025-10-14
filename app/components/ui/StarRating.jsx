import React, { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ 
  rating = 0, 
  onRatingChange, 
  interactive = true, 
  size = "sm" 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform duration-150`}
          >
            <Star
              className={`${
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-[#dbeafe]"
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
}
