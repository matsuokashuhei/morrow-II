import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
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

// Modal context to manage multiple modals
class ModalManager {
  private static modalCount = 0;
  private static originalBodyOverflow: string | null = null;

  static openModal() {
    if (this.modalCount === 0) {
      this.originalBodyOverflow = document.body.style.overflow || null;
      document.body.style.overflow = 'hidden';
    }
    this.modalCount++;
  }

  static closeModal() {
    this.modalCount = Math.max(0, this.modalCount - 1);
    if (this.modalCount === 0) {
      document.body.style.overflow = this.originalBodyOverflow || '';
    }
  }

  static getModalCount() {
    return this.modalCount;
  }
}

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
  // Handle ESC key press and body scroll lock
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      ModalManager.openModal();
      document.addEventListener('keydown', handleEsc);
    }

    // Cleanup function
    return () => {
      if (isOpen) {
        ModalManager.closeModal();
        document.removeEventListener('keydown', handleEsc);
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
