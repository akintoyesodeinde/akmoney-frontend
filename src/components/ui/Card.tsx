import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'navy' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    white: 'bg-white border border-slate-200/80 shadow-sm text-slate-900',
    navy: 'bg-[#0A2540] text-white shadow-md border border-slate-700/50',
    subtle: 'bg-slate-50 border border-slate-200 text-slate-900',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-xl transition-all duration-150 ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
