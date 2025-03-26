import React from 'react';
import ContentLoader from 'react-content-loader';

interface CustomLoaderProps {
  speed?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  className:string;
   children?: React.ReactNode; 
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  speed = 2,
  width = 400,
  height = 160,
  viewBox = "0 0 400 160",
  backgroundColor = "#f5f5f5",
  foregroundColor = "#f5f5f5",
  ...props
}) => (
<div className="d-flex align-items-center justify-content-center">
  <ContentLoader 
    speed={2}
    width={400}
    height={300}
    viewBox="0 0 400 320 700"
    backgroundColor="#1A232B"
    foregroundColor="#fff"
  >
     <rect x="0" y="0" rx="10" ry="10" width="400" height="200" />
    <rect x="0" y="220" rx="5" ry="5" width="400" height="20" />
    <rect x="0" y="250" rx="5" ry="5" width="300" height="20" />
    <rect x="0" y="280" rx="5" ry="5" width="350" height="20" />
    <rect x="0" y="310" rx="5" ry="5" width="380" height="20" />
    <rect x="0" y="340" rx="5" ry="5" width="400" height="20" />
  </ContentLoader>
  </div>
);

export default CustomLoader;
