import React from 'react';
import { cn } from '@/utils/cn';

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({
  children,
  className,
  links,
  copyright,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-gray-50 border-t border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children ? (
          children
        ) : (
          <div className="text-center space-y-4">
            {links && links.length > 0 && (
              <nav className="flex justify-center space-x-6">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}

            <p className="text-sm text-gray-500">
              {copyright || `© ${currentYear} Morrow. All rights reserved.`}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export { Footer };
export type { FooterProps };
