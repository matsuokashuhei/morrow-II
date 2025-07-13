/**
 * UI Component Props Types
 *
 * This file contains all the prop types for UI components
 * as specified in SOW Section 3.4.1
 */

import React from 'react';

// Base component props for all UI components
export interface BaseComponentProps {
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends Omit<BaseComponentProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  mobile?: boolean;
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export interface ToastProps {
  id?: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

export interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
  position?: ToastProps['position'];
}

export interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
}

// Form Component Props
export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface TextAreaProps {
  label?: string;
  error?: string;
  helpText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  rows?: number;
  className?: string;
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface DatePickerProps {
  label?: string;
  error?: string;
  helpText?: string;
  showTime?: boolean;
  className?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  footer?: React.ReactNode;
}

// Layout Component Props
export interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export interface FooterProps {
  children?: React.ReactNode;
  className?: string;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  copyright?: string;
}

export interface SidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  width?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  overlay?: boolean;
  className?: string;
}

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}
