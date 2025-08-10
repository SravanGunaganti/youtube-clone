import React from 'react';

const Loader = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className={`fixed top-14 bottom-0 right-0 bg-white flex flex-1 max-h-dvh w-full items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-t-blue-600 border-gray-300 rounded-full animate-spin`}
      ></div>

    </div>
  );
};

export default Loader;
