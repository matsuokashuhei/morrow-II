import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  width?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  overlay?: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  isOpen = false,
  onToggle,
  width = 'md',
  position = 'left',
  overlay = true,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isOpen ?? internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen(!internalOpen));

  const widthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  const transformClasses = {
    left: open ? 'translate-x-0' : '-translate-x-full',
    right: open ? 'translate-x-0' : 'translate-x-full',
  };

  return (
    <>
      {/* Overlay */}
      {overlay && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out',
          widthClasses[width],
          positionClasses[position],
          transformClasses[position],
          'lg:translate-x-0 lg:static lg:z-auto lg:shadow-none',
          className
        )}
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </aside>
    </>
  );
};

export { Sidebar };
export type { SidebarProps };
