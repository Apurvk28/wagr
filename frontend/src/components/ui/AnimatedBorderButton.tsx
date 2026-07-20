import React from 'react';

interface AnimatedBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  rounded?: string;
}

export const AnimatedBorderButton: React.FC<AnimatedBorderButtonProps> = ({
  children,
  className = '',
  wrapperClassName = '',
  rounded = 'rounded-full',
  ...props
}) => {
  return (
    <div className={`btn-border-wrap inline-flex ${rounded} ${wrapperClassName}`}>
      <button
        className={`relative overflow-hidden ${rounded} bg-dark-card border border-dark-border/80 px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-xl group transition-all duration-300 ${className}`}
        {...props}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {children}
        </span>
      </button>
    </div>
  );
};
