/**
 * Screen Component Types
 *
 * This file contains all the types for screen components and their state
 * as specified in SOW Section 3.4.2
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

export interface HomeScreenState {
  selectedTab: 'events' | 'calendar' | 'profile';
  searchQuery?: string;
  filterBy?: 'all' | 'upcoming' | 'past';
}

export interface HomeScreenProps {
  // Future props when needed
}

export interface OnboardingScreenProps {
  // Future props when needed
}

// Event Screen Types (future implementation)
export interface EventScreenProps {
  eventId: string;
}

export interface EventScreenState {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

// Profile Screen Types (future implementation)
export interface ProfileScreenProps {
  userId?: string;
}

export interface ProfileScreenState {
  user: User | null;
  editing: boolean;
  loading: boolean;
  error: string | null;
}

// Screen Navigation Types
export interface ScreenRoute {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  title?: string;
  requiresAuth?: boolean;
}

// Screen Layout Types
export interface ScreenLayoutProps {
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

// Import base types from main index
import { Event, User } from './index';
