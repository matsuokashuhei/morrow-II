import React from 'react';
import { cn } from '@/utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = 'md',
  className,
  contentClassName,
}) => {
  const sidebarWidthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const hasSidebar = !!sidebar;

  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {/* Header */}
      {header && header}

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        {hasSidebar && sidebarPosition === 'left' && (
          <aside className={cn(
            'hidden lg:flex lg:flex-shrink-0 bg-white border-r border-gray-200',
            sidebarWidthClasses[sidebarWidth]
          )}>
            <div className="w-full overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          'flex-1 min-w-0 bg-gray-50',
          contentClassName
        )}>
          {children}
        </main>

        {/* Right Sidebar */}
        {hasSidebar && sidebarPosition === 'right' && (
          <aside className={cn(
            'hidden lg:flex lg:flex-shrink-0 bg-white border-l border-gray-200',
            sidebarWidthClasses[sidebarWidth]
          )}>
            <div className="w-full overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      {footer && footer}
    </div>
  );
};

export { Layout };
export type { LayoutProps };
