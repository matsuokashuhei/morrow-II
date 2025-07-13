import { useCallback } from 'react';
import { 
  useGetEventsQuery,
  useGetEventQuery, 
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  type CreateEventInput,
  type UpdateEventInput
} from '../generated';

// Custom hook for fetching all events
export function useEvents() {
  const { data, loading, error, refetch } = useGetEventsQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    events: data?.events || [],
    loading,
    error,
    refetch,
  };
}

// Custom hook for fetching a single event
export function useEvent(id: string) {
  const { data, loading, error, refetch } = useGetEventQuery({
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });

  return {
    event: data?.event,
    loading,
    error,
    refetch,
  };
}

// Custom hook for creating an event
export function useCreateEvent() {
  const [createEventMutation, { loading, error }] = useCreateEventMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetEvents'],
  });

  const createEvent = useCallback(
    async (input: CreateEventInput) => {
      try {
        const result = await createEventMutation({
          variables: { input },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.createEvent;
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      }
    },
    [createEventMutation]
  );

  return {
    createEvent,
    loading,
    error,
  };
}

// Custom hook for updating an event
export function useUpdateEvent() {
  const [updateEventMutation, { loading, error }] = useUpdateEventMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetEvents', 'GetEvent'],
  });

  const updateEvent = useCallback(
    async (id: string, input: UpdateEventInput) => {
      try {
        const result = await updateEventMutation({
          variables: { id, input },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.updateEvent;
      } catch (err) {
        console.error('Failed to update event:', err);
        throw err;
      }
    },
    [updateEventMutation]
  );

  return {
    updateEvent,
    loading,
    error,
  };
}

// Custom hook for deleting an event
export function useDeleteEvent() {
  const [deleteEventMutation, { loading, error }] = useDeleteEventMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetEvents'],
  });

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        const result = await deleteEventMutation({
          variables: { id },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.deleteEvent;
      } catch (err) {
        console.error('Failed to delete event:', err);
        throw err;
      }
    },
    [deleteEventMutation]
  );

  return {
    deleteEvent,
    loading,
    error,
  };
}
