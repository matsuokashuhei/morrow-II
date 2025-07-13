import {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  GetUsersDocument,
} from '../generated';
import {
  createCreateMutationWrapper,
  createUpdateMutationWrapper,
  createDeleteMutationWrapper,
} from './useMutationWrapper';

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
    refetchQueries: [{ query: GetUsersDocument }],
  });

  const createUser = createCreateMutationWrapper(
    createUserMutation,
    'create user',
    'createUser'
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
    refetchQueries: [{ query: GetUsersDocument }],
  });

  const updateUser = createUpdateMutationWrapper(
    updateUserMutation,
    'update user',
    'updateUser'
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
    refetchQueries: [{ query: GetUsersDocument }],
  });

  const deleteUser = createDeleteMutationWrapper(
    deleteUserMutation,
    'delete user',
    'deleteUser'
  );

  return {
    deleteUser,
    loading,
    error,
  };
}
