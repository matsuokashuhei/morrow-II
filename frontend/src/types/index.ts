/**
 * Core Domain Types
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isShared?: boolean;
  shareCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  role: 'owner' | 'participant';
  joinedAt: string;
}

/**
 * UI Component Props Types
 */

// Re-export from ui.ts to avoid duplication
export type {
  BaseComponentProps,
  ButtonProps,
  CardProps,
  InputProps,
  ModalProps,
  NavigationProps,
  NavigationItem,
  LoadingProps,
  ToastProps,
  ToastContainerProps,
  LayoutProps,
} from './ui';

/**
 * Screen Component Props
 */
export interface HomeScreenProps {
  // Future props when needed
}

export interface OnboardingScreenProps {
  // Future props when needed
}

/**
 * Onboarding Types
 */
export interface OnboardingStep {
  title: string;
  description: string;
  illustration?: string;
  action?: 'next' | 'skip' | 'start';
}

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  hasSeenBefore: boolean;
}

/**
 * Screen State Types
 */
export interface HomeScreenState {
  selectedTab: 'events' | 'calendar' | 'profile';
  searchQuery?: string;
  filterBy?: 'all' | 'upcoming' | 'past';
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Store/State Management Types
 */
export interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  clearError: () => void;
}

export interface UIStore {
  isCreateEventModalOpen: boolean;
  isOnboardingComplete: boolean;
  currentOnboardingStep: number;
  setCreateEventModalOpen: (open: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setCurrentOnboardingStep: (step: number) => void;
}

export interface AppState {
  user: User | null;
  events: Event[];
  loading: boolean;
  error: string | null;
  ui: {
    isCreateEventModalOpen: boolean;
    isOnboardingComplete: boolean;
    currentOnboardingStep: number;
  };
}

/**
 * Form Types
 */
export interface CreateEventForm {
  title: string;
  description: string;
  date: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Utility Types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ThemeMode = 'light' | 'dark' | 'system';

export type SortOrder = 'asc' | 'desc';

export type SortField = 'title' | 'date' | 'createdAt' | 'updatedAt';

/**
 * Event-related Helper Types
 */
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface EventFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

/**
 * Sharing Types
 */
export interface ShareOptions {
  platform: 'native' | 'clipboard' | 'url';
  title: string;
  text: string;
  url: string;
}
