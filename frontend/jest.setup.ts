// Jest setup file for React DOM testing
import '@testing-library/jest-dom';

// Mock import.meta.env for Jest (scoped to GraphQL client needs)
// Only mock the specific environment variables needed for GraphQL tests
if (!(globalThis as any).import) {
  (globalThis as any).import = {
    meta: {
      env: {
        VITE_GRAPHQL_ENDPOINT: 'http://localhost:8080/api/v1/graphql',
        DEV: false, // Set to false for test environment
      },
    },
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
