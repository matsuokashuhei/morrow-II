import { useCallback } from 'react';
import {
  useGetParticipantsQuery,
  useGetParticipantQuery,
  useCreateParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
  GetParticipantsDocument,
  GetParticipantDocument,
  GetEventDocument,
  type CreateParticipantInput,
  type UpdateParticipantInput,
} from '../generated';

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

  const createParticipant = useCallback(
    async (input: CreateParticipantInput) => {
      try {
        const result = await createParticipantMutation({
          variables: { input },
        });

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data?.createParticipant;
      } catch (err) {
        console.error('Failed to create participant:', err);
        throw err;
      }
    },
    [createParticipantMutation]
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

  const updateParticipant = useCallback(
    async (id: string, input: UpdateParticipantInput) => {
      try {
        const result = await updateParticipantMutation({
          variables: { id, input },
        });

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data?.updateParticipant;
      } catch (err) {
        console.error('Failed to update participant:', err);
        throw err;
      }
    },
    [updateParticipantMutation]
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

  const deleteParticipant = useCallback(
    async (id: string) => {
      try {
        const result = await deleteParticipantMutation({
          variables: { id },
        });

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data?.deleteParticipant;
      } catch (err) {
        console.error('Failed to delete participant:', err);
        throw err;
      }
    },
    [deleteParticipantMutation]
  );

  return {
    deleteParticipant,
    loading,
    error,
  };
}
