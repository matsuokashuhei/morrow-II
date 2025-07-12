import React from 'react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  children,
  actions,
  className,
  variant = 'primary',
}) => {
  const variants = {
    primary: 'bg-orange-600 text-white',
    secondary: 'bg-white text-gray-900 border-b border-gray-200',
  };

  return (
    <header className={cn('shadow-md', variants[variant], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-1">
            {title && (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
            {subtitle && (
              <p className={cn(
                'text-sm mt-1',
                variant === 'primary' ? 'text-orange-100' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
            {children && !title && children}
          </div>

          {actions && (
            <div className="flex items-center space-x-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
export type { HeaderProps };
