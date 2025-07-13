import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

// Custom render function that includes Apollo Provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockedResponse[];
  addTypename?: boolean;
}

export function renderWithApollo(
  ui: ReactElement,
  {
    mocks = [],
    addTypename = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks} addTypename={addTypename}>
        {children}
      </MockedProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data for tests
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  cognitoId: 'cognito-123',
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  createdEvents: [],
  participants: [],
};

export const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'Test event description',
  startTime: '2025-07-20T10:00:00Z',
  endTime: '2025-07-20T12:00:00Z',
  emoji: '🎉',
  visibility: 'private' as const,
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  creator: mockUser,
  participants: [],
};

export const mockParticipant = {
  id: '1',
  role: 'viewer' as const,
  status: 'accepted' as const,
  joinedAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  user: mockUser,
  event: mockEvent,
};

// Re-export testing utilities
export * from '@testing-library/react';
export { MockedProvider } from '@apollo/client/testing';
