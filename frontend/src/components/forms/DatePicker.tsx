import React from 'react';
import { cn } from '@/utils/cn';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  showTime?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    { label, error, helpText, showTime = false, className, type, ...props },
    ref
  ) => {
    const inputType = showTime ? 'datetime-local' : type || 'date';

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={inputType}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm',
            'focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${props.id}-error`
              : helpText
                ? `${props.id}-help`
                : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={`${props.id}-help`} className="text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
