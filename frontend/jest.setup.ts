// Jest setup file for React DOM testing
import '@testing-library/jest-dom';

// Mock import.meta.env for Jest
(globalThis as any).import = {
  meta: {
    env: {
      VITE_GRAPHQL_ENDPOINT: 'http://localhost:8080/api/v1/graphql',
    },
  },
};

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
