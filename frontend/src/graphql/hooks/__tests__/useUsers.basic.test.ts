/**
 * Basic unit tests for useUsers hook
 * Tests the hook structure and basic functionality
 */

describe('useUsers Hook Structure', () => {
  it('should export useUsers function', () => {
    const { useUsers } = require('../useUsers');
    expect(typeof useUsers).toBe('function');
  });

  it('should export useUser function', () => {
    const { useUser } = require('../useUsers');
    expect(typeof useUser).toBe('function');
  });

  it('should export useCreateUser function', () => {
    const { useCreateUser } = require('../useUsers');
    expect(typeof useCreateUser).toBe('function');
  });

  it('should export useUpdateUser function', () => {
    const { useUpdateUser } = require('../useUsers');
    expect(typeof useUpdateUser).toBe('function');
  });

  it('should export useDeleteUser function', () => {
    const { useDeleteUser } = require('../useUsers');
    expect(typeof useDeleteUser).toBe('function');
  });
});

describe('User GraphQL Documents', () => {
  it('should export required User GraphQL documents', () => {
    const generated = require('../../generated');

    expect(generated.GetUsersDocument).toBeDefined();
    expect(generated.GetUserDocument).toBeDefined();
    expect(generated.CreateUserDocument).toBeDefined();
    expect(generated.UpdateUserDocument).toBeDefined();
    expect(generated.DeleteUserDocument).toBeDefined();
  });

  it('should export required User GraphQL hooks', () => {
    const generated = require('../../generated');

    expect(typeof generated.useGetUsersQuery).toBe('function');
    expect(typeof generated.useGetUserQuery).toBe('function');
    expect(typeof generated.useCreateUserMutation).toBe('function');
    expect(typeof generated.useUpdateUserMutation).toBe('function');
    expect(typeof generated.useDeleteUserMutation).toBe('function');
  });
});
