import { useState } from 'react';
import { cn } from '@/utils/cn';

interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  mobile?: boolean;
}

const Navigation = ({ items, className, mobile = false }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (mobile) {
    return (
      <div className={cn('md:hidden', className)}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-orange-600 border-t border-orange-700 shadow-lg">
            <nav className="px-4 py-2">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base transition-colors',
                    item.active
                      ? 'bg-orange-700 text-white'
                      : 'text-orange-100 hover:text-white hover:bg-orange-700'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  return (
    <nav className={cn('hidden md:block', className)}>
      <ul className="flex space-x-6">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                item.active
                  ? 'bg-orange-700 text-white'
                  : 'text-orange-100 hover:text-white hover:bg-orange-700'
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { Navigation };
export type { NavigationProps, NavigationItem };
