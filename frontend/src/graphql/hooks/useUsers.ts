import { useCallback } from 'react';
import { 
  useGetUsersQuery,
  useGetUserQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type CreateUserInput,
  type UpdateUserInput
} from '../generated';

// Custom hook for fetching all users
export function useUsers() {
  const { data, loading, error, refetch } = useGetUsersQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
  };
}

// Custom hook for fetching a single user
export function useUser(id: string) {
  const { data, loading, error, refetch } = useGetUserQuery({
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });

  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
}

// Custom hook for creating a user
export function useCreateUser() {
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetUsers'],
  });

  const createUser = useCallback(
    async (input: CreateUserInput) => {
      try {
        const result = await createUserMutation({
          variables: { input },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.createUser;
      } catch (err) {
        console.error('Failed to create user:', err);
        throw err;
      }
    },
    [createUserMutation]
  );

  return {
    createUser,
    loading,
    error,
  };
}

// Custom hook for updating a user
export function useUpdateUser() {
  const [updateUserMutation, { loading, error }] = useUpdateUserMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetUsers', 'GetUser'],
  });

  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput) => {
      try {
        const result = await updateUserMutation({
          variables: { id, input },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.updateUser;
      } catch (err) {
        console.error('Failed to update user:', err);
        throw err;
      }
    },
    [updateUserMutation]
  );

  return {
    updateUser,
    loading,
    error,
  };
}

// Custom hook for deleting a user
export function useDeleteUser() {
  const [deleteUserMutation, { loading, error }] = useDeleteUserMutation({
    errorPolicy: 'all',
    refetchQueries: ['GetUsers'],
  });

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const result = await deleteUserMutation({
          variables: { id },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        return result.data?.deleteUser;
      } catch (err) {
        console.error('Failed to delete user:', err);
        throw err;
      }
    },
    [deleteUserMutation]
  );

  return {
    deleteUser,
    loading,
    error,
  };
}
