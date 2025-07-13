import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import React, { ReactNode } from 'react';
import {
  useEvents,
  useEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '../useEvents';
import {
  GetEventsDocument,
  GetEventDocument,
  CreateEventDocument,
  UpdateEventDocument,
  DeleteEventDocument,
  EventVisibility,
} from '../../generated';

// Mock data
const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'Test event description',
  startTime: '2025-07-20T10:00:00Z',
  endTime: '2025-07-20T12:00:00Z',
  emoji: '🎉',
  visibility: 'private' as const,
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  creator: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  participants: [],
};

const mockEvents = [mockEvent];

// Test wrapper component
const createWrapper = (mocks: MockedResponse[]) => {
  return ({ children }: { children: ReactNode }) =>
    React.createElement(
      MockedProvider,
      { mocks, addTypename: false },
      children
    );
};

describe('useEvents', () => {
  it('should fetch events successfully', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetEventsDocument,
        },
        result: {
          data: {
            events: mockEvents,
          },
        },
      },
    ];

    const { result } = renderHook(() => useEvents(), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle fetch events error', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetEventsDocument,
        },
        error: new Error('Failed to fetch events'),
      },
    ];

    const { result } = renderHook(() => useEvents(), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Failed to fetch events');
  });
});

describe('useEvent', () => {
  it('should fetch single event successfully', async () => {
    const eventId = '1';
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetEventDocument,
          variables: { id: eventId },
        },
        result: {
          data: {
            event: mockEvent,
          },
        },
      },
    ];

    const { result } = renderHook(() => useEvent(eventId), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.event).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toEqual(mockEvent);
    expect(result.current.error).toBeUndefined();
  });

  it('should skip query when id is empty', () => {
    const mocks: MockedResponse[] = [];

    const { result } = renderHook(() => useEvent(''), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.event).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });
});

describe('useCreateEvent', () => {
  it('should create event successfully', async () => {
    const inputData = {
      title: 'New Event',
      description: 'New event description',
      startTime: '2025-07-25T10:00:00Z',
      endTime: '2025-07-25T12:00:00Z',
      emoji: '🎊',
      visibility: EventVisibility.Private,
      creatorId: '1',
    };

    const expectedEvent = {
      ...mockEvent,
      ...inputData,
      id: '2',
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CreateEventDocument,
          variables: { input: inputData },
        },
        result: {
          data: {
            createEvent: expectedEvent,
          },
        },
      },
    ];

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(false);

    const createdEvent = await result.current.createEvent(inputData);

    expect(createdEvent).toEqual(expectedEvent);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle create event error', async () => {
    const inputData = {
      title: 'New Event',
      description: 'New event description',
      startTime: '2025-07-25T10:00:00Z',
      endTime: '2025-07-25T12:00:00Z',
      creatorId: '1',
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CreateEventDocument,
          variables: { input: inputData },
        },
        error: new Error('Failed to create event'),
      },
    ];

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(mocks),
    });

    await expect(result.current.createEvent(inputData)).rejects.toThrow(
      'Failed to create event'
    );
  });
});

describe('useUpdateEvent', () => {
  it('should update event successfully', async () => {
    const eventId = '1';
    const updateData = {
      title: 'Updated Event',
      description: 'Updated description',
    };

    const updatedEvent = {
      ...mockEvent,
      ...updateData,
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UpdateEventDocument,
          variables: { id: eventId, input: updateData },
        },
        result: {
          data: {
            updateEvent: updatedEvent,
          },
        },
      },
    ];

    const { result } = renderHook(() => useUpdateEvent(), {
      wrapper: createWrapper(mocks),
    });

    const updated = await result.current.updateEvent(eventId, updateData);

    expect(updated).toEqual(updatedEvent);
    expect(result.current.error).toBeUndefined();
  });
});

describe('useDeleteEvent', () => {
  it('should delete event successfully', async () => {
    const eventId = '1';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: DeleteEventDocument,
          variables: { id: eventId },
        },
        result: {
          data: {
            deleteEvent: true,
          },
        },
      },
    ];

    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(mocks),
    });

    const deleted = await result.current.deleteEvent(eventId);

    expect(deleted).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle delete event error', async () => {
    const eventId = '1';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: DeleteEventDocument,
          variables: { id: eventId },
        },
        error: new Error('Failed to delete event'),
      },
    ];

    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(mocks),
    });

    await expect(result.current.deleteEvent(eventId)).rejects.toThrow(
      'Failed to delete event'
    );
  });
});
