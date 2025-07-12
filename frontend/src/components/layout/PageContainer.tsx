import React from 'react';
import { cn } from '@/utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  className,
  centered = true,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-6',
    md: 'px-4 sm:px-6 lg:px-8 py-8',
    lg: 'px-6 sm:px-8 lg:px-12 py-12',
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export { PageContainer };
export type { PageContainerProps };
