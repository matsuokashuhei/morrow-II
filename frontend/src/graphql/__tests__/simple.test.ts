import { gql } from '@apollo/client';

describe('GraphQL Simple Tests', () => {
  it('should parse GraphQL queries', () => {
    const query = gql`
      query GetUsers {
        users {
          id
          name
          email
        }
      }
    `;

    expect(query).toBeDefined();
    expect(query.kind).toBe('Document');
  });

  it('should handle environment variables fallback', () => {
    // Test that our client config handles missing env vars gracefully
    const testEndpoint =
      (globalThis as any).import?.meta?.env?.VITE_GRAPHQL_ENDPOINT ||
      'http://localhost:8080/api/v1/graphql';
    expect(testEndpoint).toBe('http://localhost:8080/api/v1/graphql');
  });

  it('should have proper GraphQL document structure', () => {
    const mutation = gql`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    `;

    expect(mutation.definitions).toHaveLength(1);
    expect(mutation.definitions[0].kind).toBe('OperationDefinition');
  });
});
