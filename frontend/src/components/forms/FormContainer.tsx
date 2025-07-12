import React from 'react';
import { cn } from '@/utils/cn';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  footer?: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  description,
  onSubmit,
  className,
  footer,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        {footer && (
          <div className="pt-4 border-t border-gray-200">{footer}</div>
        )}
      </form>
    </div>
  );
};

export { FormContainer };
export type { FormContainerProps };
