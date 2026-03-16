import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
}
