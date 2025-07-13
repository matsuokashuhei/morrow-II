import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import React, { ReactNode } from 'react';
import {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../useUsers';
import {
  GetUsersDocument,
  GetUserDocument,
  CreateUserDocument,
  UpdateUserDocument,
  DeleteUserDocument,
} from '../../generated';

// Mock data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  cognitoId: 'cognito-123',
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
};

const mockUsers = [mockUser];

// Test wrapper component
const createWrapper = (mocks: MockedResponse[]) => {
  return ({ children }: { children: ReactNode }) =>
    React.createElement(
      MockedProvider,
      { mocks, addTypename: false },
      children
    );
};

describe('useUsers', () => {
  it('should fetch users successfully', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetUsersDocument,
        },
        result: {
          data: {
            users: mockUsers,
          },
        },
      },
    ];

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle fetch users error', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetUsersDocument,
        },
        error: new Error('Failed to fetch users'),
      },
    ];

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Failed to fetch users');
  });
});

describe('useUser', () => {
  it('should fetch single user successfully', async () => {
    const userId = '1';
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GetUserDocument,
          variables: { id: userId },
        },
        result: {
          data: {
            user: mockUser,
          },
        },
      },
    ];

    const { result } = renderHook(() => useUser(userId), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeUndefined();
  });

  it('should skip query when id is empty', () => {
    const mocks: MockedResponse[] = [];

    const { result } = renderHook(() => useUser(''), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });
});

describe('useCreateUser', () => {
  it('should create user successfully', async () => {
    const inputData = {
      email: 'new@example.com',
      name: 'New User',
      avatarUrl: 'https://example.com/new-avatar.jpg',
      cognitoId: 'cognito-456',
    };

    const expectedUser = {
      ...mockUser,
      ...inputData,
      id: '2',
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CreateUserDocument,
          variables: { input: inputData },
        },
        result: {
          data: {
            createUser: expectedUser,
          },
        },
      },
    ];

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(false);

    const createdUser = await result.current.createUser(inputData);

    expect(createdUser).toEqual(expectedUser);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle create user error', async () => {
    const inputData = {
      email: 'new@example.com',
      name: 'New User',
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CreateUserDocument,
          variables: { input: inputData },
        },
        error: new Error('Failed to create user'),
      },
    ];

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(mocks),
    });

    await expect(result.current.createUser(inputData)).rejects.toThrow(
      'Failed to create user'
    );
  });
});

describe('useUpdateUser', () => {
  it('should update user successfully', async () => {
    const userId = '1';
    const updateData = {
      name: 'Updated User',
      avatarUrl: 'https://example.com/updated-avatar.jpg',
    };

    const updatedUser = {
      ...mockUser,
      ...updateData,
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UpdateUserDocument,
          variables: { id: userId, input: updateData },
        },
        result: {
          data: {
            updateUser: updatedUser,
          },
        },
      },
    ];

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(mocks),
    });

    const updated = await result.current.updateUser(userId, updateData);

    expect(updated).toEqual(updatedUser);
    expect(result.current.error).toBeUndefined();
  });
});

describe('useDeleteUser', () => {
  it('should delete user successfully', async () => {
    const userId = '1';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: DeleteUserDocument,
          variables: { id: userId },
        },
        result: {
          data: {
            deleteUser: true,
          },
        },
      },
    ];

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(mocks),
    });

    const deleted = await result.current.deleteUser(userId);

    expect(deleted).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle delete user error', async () => {
    const userId = '1';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: DeleteUserDocument,
          variables: { id: userId },
        },
        error: new Error('Failed to delete user'),
      },
    ];

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(mocks),
    });

    await expect(result.current.deleteUser(userId)).rejects.toThrow(
      'Failed to delete user'
    );
  });
});
