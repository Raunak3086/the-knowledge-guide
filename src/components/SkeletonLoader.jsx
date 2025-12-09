import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ className, count = 1, style }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`skeleton-loader ${className || ''}`} style={style}></div>
  ));

  return <>{skeletons}</>;
};

export default SkeletonLoader;
