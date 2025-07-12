import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

// Global modal counter to handle multiple modals
let modalCount = 0;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) => {
  const previousBodyOverflow = useRef<string | null>(null);

  // Handle ESC key press and body scroll lock
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Store original overflow value when first modal opens
      if (modalCount === 0) {
        previousBodyOverflow.current = document.body.style.overflow || null;
        document.body.style.overflow = 'hidden';
      }

      modalCount++;
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      if (isOpen) {
        modalCount--;
        document.removeEventListener('keydown', handleEsc);

        // Only restore body overflow when all modals are closed
        if (modalCount === 0) {
          document.body.style.overflow = previousBodyOverflow.current || '';
        }
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl w-full transform transition-all',
          sizeClasses[size],
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {showCloseButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="ml-auto bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  // Create portal to render modal at body level
  return createPortal(modalContent, document.body);
};

export { Modal };
export type { ModalProps };
