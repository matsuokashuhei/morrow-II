import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

// Mock localStorage for onboarding check
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Replace the global localStorage with our mock for this test
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders HomeScreen when onboarding is completed', () => {
    mockLocalStorage.getItem.mockReturnValue('true');
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText('Welcome to Morrow!')).toBeInTheDocument();
  });

  it('renders OnboardingScreen when accessing onboarding route', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText('スキップ')).toBeInTheDocument();
  });
});
