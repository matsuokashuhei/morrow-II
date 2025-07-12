import { create } from 'zustand';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  setOnboardingComplete: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  selectEvent: (event: Event | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface UIState {
  theme: 'light' | 'dark';
  isCreateEventModalOpen: boolean;
  isMobileMenuOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setCreateEventModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

// Onboarding Store
export const useOnboardingStore = create<OnboardingState>(set => ({
  hasCompletedOnboarding: false,
  currentStep: 0,
  setOnboardingComplete: (completed: boolean) =>
    set({ hasCompletedOnboarding: completed }),
  setCurrentStep: (step: number) => set({ currentStep: step }),
}));

// Events Store
export const useEventStore = create<EventState>(set => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  addEvent: eventData => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set(state => ({
      events: [...state.events, newEvent],
      error: null,
    }));
  },

  updateEvent: (id, updates) => {
    set(state => ({
      events: state.events.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      ),
      error: null,
    }));
  },

  deleteEvent: id => {
    set(state => ({
      events: state.events.filter(event => event.id !== id),
      selectedEvent:
        state.selectedEvent?.id === id ? null : state.selectedEvent,
      error: null,
    }));
  },

  selectEvent: event => set({ selectedEvent: event }),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
}));

// User Store
export const useUserStore = create<UserState>(set => ({
  user: null,
  isAuthenticated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

// UI Store
export const useUIStore = create<UIState>(set => ({
  theme: 'light',
  isCreateEventModalOpen: false,
  isMobileMenuOpen: false,

  setTheme: theme => set({ theme }),
  setCreateEventModalOpen: open => set({ isCreateEventModalOpen: open }),
  setMobileMenuOpen: open => set({ isMobileMenuOpen: open }),
}));
