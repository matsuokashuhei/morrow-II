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
    expect(screen.getByText('Morrowへようこそ')).toBeInTheDocument();
  });

  it('should display the first step by default', () => {
    renderWithRouter();
    expect(
      screen.getByText(
        'イベントカウントダウン共有アプリです。大切な日を友達や家族と一緒に楽しみに待ちましょう。'
      )
    ).toBeInTheDocument();
  });

  it('should show Skip button', () => {
    renderWithRouter();
    expect(screen.getByText('スキップ')).toBeInTheDocument();
  });

  it('should show navigation buttons', () => {
    renderWithRouter();
    expect(screen.getByText('スキップ')).toBeInTheDocument();
    expect(screen.getByText('次へ')).toBeInTheDocument();
  });

  it('should show previous button on second step', () => {
    renderWithRouter();
    const nextButton = screen.getByText('次へ');
    fireEvent.click(nextButton);
    expect(screen.getByText('戻る')).toBeInTheDocument();
  });

  it('should show correct step indicator', () => {
    renderWithRouter();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('should set localStorage and navigate when skip is clicked', () => {
    renderWithRouter();
    const skipButton = screen.getByText('スキップ');
    fireEvent.click(skipButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should advance step when Next is clicked', () => {
    renderWithRouter();
    const nextButton = screen.getByText('次へ');
    fireEvent.click(nextButton);
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });
});
