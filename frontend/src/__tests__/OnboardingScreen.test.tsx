import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingScreen from '../screens/OnboardingScreen';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <OnboardingScreen />
    </MemoryRouter>
  );
};

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithRouter();
    expect(screen.getByText(/Welcome to Morrow!/)).toBeInTheDocument();
  });

  it('should display the first step by default', () => {
    renderWithRouter();
    expect(screen.getByText(/Create memorable countdowns/)).toBeInTheDocument();
  });

  it('should show Skip button', () => {
    renderWithRouter();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('should show navigation buttons', () => {
    renderWithRouter();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should disable Previous button on first step', () => {
    renderWithRouter();
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('should show correct step indicator', () => {
    renderWithRouter();
    expect(screen.getByText('1 of 4')).toBeInTheDocument();
  });

  it('should set localStorage and navigate when skip is clicked', () => {
    renderWithRouter();
    const skipButton = screen.getByText('Skip');
    fireEvent.click(skipButton);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('onboardingCompleted', 'true');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should advance step when Next is clicked', () => {
    renderWithRouter();
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(screen.getByText('2 of 4')).toBeInTheDocument();
  });
});