import {
  useGetParticipantsQuery,
  useGetParticipantQuery,
  useCreateParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
  GetParticipantsDocument,
  GetParticipantDocument,
  GetEventDocument,
} from '../generated';
import {
  createCreateMutationWrapper,
  createUpdateMutationWrapper,
  createDeleteMutationWrapper,
} from './useMutationWrapper';

// Custom hook for fetching all participants
export function useParticipants() {
  const { data, loading, error, refetch } = useGetParticipantsQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    participants: data?.participants || [],
    loading,
    error,
    refetch,
  };
}

// Custom hook for fetching a single participant
export function useParticipant(id: string) {
  const { data, loading, error, refetch } = useGetParticipantQuery({
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });

  return {
    participant: data?.participant,
    loading,
    error,
    refetch,
  };
}

// Custom hook for creating a participant
export function useCreateParticipant() {
  const [createParticipantMutation, { loading, error }] =
    useCreateParticipantMutation({
      errorPolicy: 'all',
      refetchQueries: [{ query: GetParticipantsDocument }],
    });

  const createParticipant = createCreateMutationWrapper(
    createParticipantMutation,
    'create participant',
    'createParticipant'
  );

  return {
    createParticipant,
    loading,
    error,
  };
}

// Custom hook for updating a participant
export function useUpdateParticipant() {
  const [updateParticipantMutation, { loading, error }] =
    useUpdateParticipantMutation({
      errorPolicy: 'all',
      refetchQueries: [
        { query: GetParticipantsDocument },
        { query: GetParticipantDocument },
      ],
    });

  const updateParticipant = createUpdateMutationWrapper(
    updateParticipantMutation,
    'update participant',
    'updateParticipant'
  );

  return {
    updateParticipant,
    loading,
    error,
  };
}

// Custom hook for deleting a participant
export function useDeleteParticipant() {
  const [deleteParticipantMutation, { loading, error }] =
    useDeleteParticipantMutation({
      errorPolicy: 'all',
      refetchQueries: [
        { query: GetParticipantsDocument },
        { query: GetEventDocument },
      ],
    });

  const deleteParticipant = createDeleteMutationWrapper(
    deleteParticipantMutation,
    'delete participant',
    'deleteParticipant'
  );

  return {
    deleteParticipant,
    loading,
    error,
  };
}
