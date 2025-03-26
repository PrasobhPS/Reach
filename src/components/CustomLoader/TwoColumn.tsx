import React, { ReactNode } from 'react';
import ContentLoader from 'react-content-loader';

interface TwoColumnProps {
  speed?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  className?: string;
  children?: ReactNode;
}

const TwoColumn: React.FC<TwoColumnProps> = ({
  speed = 2,
  width = 1500,
  height = 450,
  viewBox = "0 0 1500 450",
  backgroundColor = "#1A232B",
  foregroundColor = "#fff",
  className,
  children,
}) => {
  const outerX = width * 0.7 + 6;
  const outerY = 64;
  const outerWidth = width * 0.3 - 25;
  const outerHeight = 400;

  const padding = 10;

  const innerX = outerX + padding;
  const innerY = outerY + padding;
  const innerWidth = outerWidth - 2 * padding;
  const innerHeight = outerHeight - 2 * padding;

  const innerBackgroundColor = "#ff0000"; // Define the background color for the inner rectangle

  return (
    <div className={`d-flex ${className}`}>
      <ContentLoader
        speed={speed}
        width={width}
        height={height}
        viewBox={viewBox}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      >
        <rect x="19" y="64" rx="0" ry="0" width={width * 0.7 - 25} height="400" />
        <rect x={outerX} y={outerY} rx="0" ry="0" width="200" height={outerHeight} />
        <rect x={outerX} y={outerY} rx="16" ry="16" width="800" height="8" />
        <rect x="300" y={outerY} rx="16" ry="16" width="6" height={outerHeight} />
        <rect x="200" y={outerY} rx="3" ry="6" width="100" height={outerHeight} />
      </ContentLoader>
    </div>
  );
}

export default TwoColumn;
