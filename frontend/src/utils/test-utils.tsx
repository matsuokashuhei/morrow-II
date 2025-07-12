import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

/**
 * Test utility to render components with React Router context
 * @param component - React component to render
 * @returns Testing Library render result
 */
export const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * Test utility to render components with all necessary providers
 * @param component - React component to render
 * @returns Testing Library render result
 */
export const renderWithProviders = (component: ReactElement) => {
  // In the future, add more providers like Apollo Client, theme providers, etc.
  return renderWithRouter(component);
};

/**
 * Mock data for testing
 */
export const mockEventData = {
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  date: '2024-12-31T23:59:59Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};
