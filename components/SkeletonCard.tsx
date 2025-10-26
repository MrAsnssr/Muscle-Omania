import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 p-4 space-y-4">
      <div className="bg-gray-800 h-48 rounded-md animate-pulse"></div>
      <div className="space-y-2">
        <div className="bg-gray-800 h-6 rounded-md animate-pulse w-3/4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
