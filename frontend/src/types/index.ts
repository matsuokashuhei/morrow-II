/**
 * Component Props Types
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Component Props
 */

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Page Props
 */

export interface HomeScreenProps {
  // Add props when they are needed in the future
}

/**
 * API Response Types
 */

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Store/State Types
 */

export interface AppState {
  user: User | null;
  events: Event[];
  loading: boolean;
  error: string | null;
}