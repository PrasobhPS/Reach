import React, { useState } from 'react';
import { Rating } from 'react-simple-star-rating';

interface StarRatingProps {
 onClick: (rate: number) => void;
  size?: number; 
  transition?: boolean; 
  allowFraction?: boolean;
  showTooltip?: boolean; 
  tooltipArray?: string[]; 
  expertRating?:number;
  showRating?:boolean;
}
export const StarRating: React.FC<StarRatingProps> = ({
  onClick,
  size = 20,
  transition = true,
  allowFraction = true,
  showTooltip = true,
  tooltipArray = [],
  expertRating,
  showRating=false,
}) => {
  const [rating, setRating] = useState<number>(expertRating?expertRating:0);

  return (
    <div className='rating-section'>
      <Rating
        onClick={onClick}
        size={size}
        transition={transition}
        allowFraction={allowFraction}
        showTooltip={showRating && showTooltip}
        tooltipArray={tooltipArray}
        initialValue={rating}
      />
      {showRating && (
        <div className='rating-count'>
          <p className='rating-text'>Rating : </p>
          <p className='rating-num'>{rating}</p>
        </div>
      )}
      
    </div>
  );
};

export default StarRating;
