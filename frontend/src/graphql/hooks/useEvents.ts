import {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  GetEventsDocument,
} from '../generated';
import {
  createCreateMutationWrapper,
  createUpdateMutationWrapper,
  createDeleteMutationWrapper,
} from './useMutationWrapper';

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
    refetchQueries: [{ query: GetEventsDocument }],
  });

  const createEvent = createCreateMutationWrapper(
    createEventMutation,
    'create event',
    'createEvent'
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
    refetchQueries: [{ query: GetEventsDocument }],
  });

  const updateEvent = createUpdateMutationWrapper(
    updateEventMutation,
    'update event',
    'updateEvent'
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
    refetchQueries: [{ query: GetEventsDocument }],
  });

  const deleteEvent = createDeleteMutationWrapper(
    deleteEventMutation,
    'delete event',
    'deleteEvent'
  );

  return {
    deleteEvent,
    loading,
    error,
  };
}
