import React from 'react';
import { Input, InputProps } from '../ui/Input';
import { cn } from '@/utils/cn';

interface FormFieldProps extends Omit<InputProps, 'label'> {
  label: string;
  name: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      error,
      helpText,
      required = false,
      className,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-gray-700',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </label>

        <Input
          ref={ref}
          id={name}
          name={name}
          className={cn(
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
          {...inputProps}
        />

        {error && (
          <p id={`${name}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={`${name}-help`} className="text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
export type { FormFieldProps };
