import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';

// Mock localStorage for onboarding check
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {component}
    </BrowserRouter>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('true'); // Simulate completed onboarding
  });

  it('should render without crashing', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('Welcome to Morrow!')).toBeInTheDocument();
  });

  it('should display the welcome message', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('Event Countdown Sharing App')).toBeInTheDocument();
  });

  it('should display the enhanced description', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(
      getByText(/Create, manage, and share your upcoming events with friends and family/i)
    ).toBeInTheDocument();
  });

  it('should display feature cards', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('イベント作成')).toBeInTheDocument();
    expect(getByText('リアルタイム表示')).toBeInTheDocument();
    expect(getByText('友達と共有')).toBeInTheDocument();
  });

  it('should display the main CTA button', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('今すぐ始める')).toBeInTheDocument();
  });

  it('should display the secondary CTA section', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('Ready to start counting?')).toBeInTheDocument();
    expect(getByText('Create Your First Event')).toBeInTheDocument();
  });

  it('should display stats section', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('10K+')).toBeInTheDocument();
    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText('50K+')).toBeInTheDocument();
    expect(getByText('Events Created')).toBeInTheDocument();
  });
});
