/**
 * Environment configuration utility
 */

// Helper function to safely access environment variables in different environments
const getEnvVariable = (viteKey: string, fallback: string): string => {
  // In test environment (Jest or Playwright), use environment variables or defaults
  if (
    typeof process !== 'undefined' &&
    (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID)
  ) {
    // For test environment, use process.env with mapped keys
    if (viteKey === 'VITE_GRAPHQL_ENDPOINT') {
      return process.env.GRAPHQL_ENDPOINT || fallback;
    }
    if (viteKey === 'VITE_API_BASE_URL') {
      return process.env.API_BASE_URL || fallback;
    }
    return fallback;
  }

  // In browser environment, try to access import.meta.env
  // Use conditional access to avoid Jest parsing issues
  if (typeof window !== 'undefined') {
    try {
      const env = (import.meta as any).env;
      if (env[viteKey]) {
        return env[viteKey];
      }
    } catch (error) {
      // Fallback to the default value if import.meta.env is not accessible
    }
  }

  return fallback;
};

export const getGraphQLEndpoint = (): string => {
  return getEnvVariable(
    'VITE_GRAPHQL_ENDPOINT',
    'http://localhost:8080/api/v1/graphql'
  );
};

export const getBaseApiUrl = (): string => {
  return getEnvVariable('VITE_API_BASE_URL', 'http://localhost:8080');
};
