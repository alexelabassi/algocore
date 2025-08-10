import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'medium', className = '' }) => {
  const sizeStyles = {
    small: { width: '1rem', height: '1rem' },
    medium: { width: '2rem', height: '2rem' },
    large: { width: '3rem', height: '3rem' }
  };

  return (
    <div className={`flex justify-center items-center ${className}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        className="loader"
        style={{
          ...sizeStyles[size],
          border: '4px solid #e5e7eb',
          borderRadius: '50%',
          borderTopColor: '#2563eb',
          animation: 'spin 1s ease-in-out infinite'
        }}
      ></div>
    </div>
  );
}; 