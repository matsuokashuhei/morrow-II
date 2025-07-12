import { renderHook, act } from '@testing-library/react';
import { useEventStore, useUIStore, useOnboardingStore, useUserStore } from '../../store';

describe('Event Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useEventStore());
    act(() => {
      result.current.events.forEach(event => {
        result.current.deleteEvent(event.id);
      });
    });
  });

  it('should add an event', () => {
    const { result } = renderHook(() => useEventStore());

    act(() => {
      result.current.addEvent({
        title: 'Test Event',
        description: 'Test Description',
        date: '2025-07-20T15:00:00Z',
      });
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('Test Event');
    expect(result.current.events[0].description).toBe('Test Description');
    expect(result.current.events[0].id).toBeDefined();
    expect(result.current.events[0].createdAt).toBeDefined();
    expect(result.current.events[0].updatedAt).toBeDefined();
  });

  it('should update an event', () => {
    const { result } = renderHook(() => useEventStore());

    // Add an event first
    act(() => {
      result.current.addEvent({
        title: 'Original Title',
        description: 'Original Description',
        date: '2025-07-20T15:00:00Z',
      });
    });

    const eventId = result.current.events[0].id;

    // Update the event
    act(() => {
      result.current.updateEvent(eventId, {
        title: 'Updated Title',
        description: 'Updated Description',
      });
    });

    expect(result.current.events[0].title).toBe('Updated Title');
    expect(result.current.events[0].description).toBe('Updated Description');
    // Just check that updatedAt exists and is a valid ISO string
    expect(result.current.events[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should delete an event', () => {
    const { result } = renderHook(() => useEventStore());

    // Add an event first
    act(() => {
      result.current.addEvent({
        title: 'Test Event',
        description: 'Test Description',
        date: '2025-07-20T15:00:00Z',
      });
    });

    const eventId = result.current.events[0].id;

    // Delete the event
    act(() => {
      result.current.deleteEvent(eventId);
    });

    expect(result.current.events).toHaveLength(0);
  });

  it('should select an event', () => {
    const { result } = renderHook(() => useEventStore());

    act(() => {
      result.current.addEvent({
        title: 'Test Event',
        description: 'Test Description',
        date: '2025-07-20T15:00:00Z',
      });
    });

    const event = result.current.events[0];

    act(() => {
      result.current.selectEvent(event);
    });

    expect(result.current.selectedEvent).toBe(event);
  });

  it('should manage loading state', () => {
    const { result } = renderHook(() => useEventStore());

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should manage error state', () => {
    const { result } = renderHook(() => useEventStore());

    expect(result.current.error).toBe(null);

    act(() => {
      result.current.setError('Test error message');
    });

    expect(result.current.error).toBe('Test error message');
  });
});

describe('UI Store', () => {
  it('should manage theme state', () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should manage modal states', () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.isCreateEventModalOpen).toBe(false);

    act(() => {
      result.current.setCreateEventModalOpen(true);
    });

    expect(result.current.isCreateEventModalOpen).toBe(true);
  });

  it('should manage mobile menu state', () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.isMobileMenuOpen).toBe(false);

    act(() => {
      result.current.setMobileMenuOpen(true);
    });

    expect(result.current.isMobileMenuOpen).toBe(true);
  });
});

describe('Onboarding Store', () => {
  it('should manage onboarding completion state', () => {
    const { result } = renderHook(() => useOnboardingStore());

    expect(result.current.hasCompletedOnboarding).toBe(false);

    act(() => {
      result.current.setOnboardingComplete(true);
    });

    expect(result.current.hasCompletedOnboarding).toBe(true);
  });

  it('should manage current step', () => {
    const { result } = renderHook(() => useOnboardingStore());

    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.currentStep).toBe(2);
  });
});

describe('User Store', () => {
  it('should manage user authentication state', () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);

    const testUser = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.user).toBe(testUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useUserStore());

    const testUser = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    };

    // Set user first
    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
