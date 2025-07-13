import { 
  CreateEventMutation, 
  CreateEventInput,
  GetEventsDocument,
  useCreateEventMutation
} from '../graphql/generated';

interface UseCreateEventReturn {
  createEvent: (input: CreateEventInput) => Promise<CreateEventMutation['createEvent']>;
  loading: boolean;
  error?: Error;
}

export const useCreateEvent = (): UseCreateEventReturn => {
  const [createEventMutation, { loading, error }] = useCreateEventMutation({
    // Refetch events list after creating a new event
    refetchQueries: [{ query: GetEventsDocument }],
    awaitRefetchQueries: true,
  });

  const createEvent = async (input: CreateEventInput) => {
    try {
      const result = await createEventMutation({
        variables: { input },
      });

      if (!result.data?.createEvent) {
        throw new Error('Failed to create event');
      }

      return result.data.createEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  return {
    createEvent,
    loading,
    error: error ? new Error(error.message) : undefined,
  };
};
