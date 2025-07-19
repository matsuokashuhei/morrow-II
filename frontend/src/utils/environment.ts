/**
 * Environment configuration utility
 */

export const getGraphQLEndpoint = (): string => {
  // In test environment (Playwright), use Docker internal network
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return process.env.GRAPHQL_ENDPOINT || 'http://backend:8080/api/v1/graphql';
  }

  // In browser environment, use environment variable or default
  return import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/api/v1/graphql';
};

export const getBaseApiUrl = (): string => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return process.env.API_BASE_URL || 'http://backend:8080';
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
};
