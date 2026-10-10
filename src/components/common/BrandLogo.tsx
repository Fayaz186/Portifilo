import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl'
  };

  // Default Distinctive Logo
  return (
    <div
      className={`${sizeClasses[size]} overflow-hidden shadow-sm shadow-indigo-950/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 bg-white ${className}`}
    >
      <img
        src="/logo.jpeg"
        alt="Fayaz Ahmad Malikzai Logo"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
};
