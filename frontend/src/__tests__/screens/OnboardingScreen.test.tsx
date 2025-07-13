import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnboardingScreen from '../../screens/OnboardingScreen';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {component}
    </BrowserRouter>
  );
};

describe('OnboardingScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the first step correctly', () => {
    renderWithRouter(<OnboardingScreen />);

    expect(screen.getByText('Morrowへようこそ')).toBeInTheDocument();
    expect(
      screen.getByText(/イベントカウントダウン共有アプリです/)
    ).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('shows correct progress indicators', () => {
    renderWithRouter(<OnboardingScreen />);

    // Check progress dots
    const progressDots = document.querySelectorAll('.w-3.h-3.rounded-full');
    expect(progressDots).toHaveLength(4);

    // First dot should be active (orange), others inactive
    expect(progressDots[0]).toHaveClass('bg-orange-600');
    expect(progressDots[1]).toHaveClass('bg-orange-200');
    expect(progressDots[2]).toHaveClass('bg-orange-200');
    expect(progressDots[3]).toHaveClass('bg-orange-200');
  });

  it('navigates to next step when next button is clicked', () => {
    renderWithRouter(<OnboardingScreen />);

    const nextButton = screen.getByText('次へ');
    fireEvent.click(nextButton);

    // Should show second step
    expect(screen.getByText('イベントを作成')).toBeInTheDocument();
    expect(
      screen.getByText(/大切な予定やイベントを簡単に登録/)
    ).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });

  it('navigates to previous step when back button is clicked', () => {
    renderWithRouter(<OnboardingScreen />);

    // Go to second step first
    fireEvent.click(screen.getByText('次へ'));

    // Now go back
    const backButton = screen.getByText('戻る');
    fireEvent.click(backButton);

    // Should be back to first step
    expect(screen.getByText('Morrowへようこそ')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('shows start button on final step', () => {
    renderWithRouter(<OnboardingScreen />);

    // Navigate to final step
    fireEvent.click(screen.getByText('次へ')); // Step 2
    fireEvent.click(screen.getByText('次へ')); // Step 3
    fireEvent.click(screen.getByText('次へ')); // Step 4

    expect(screen.getByText('友達と共有')).toBeInTheDocument();
    expect(screen.getByText('始める')).toBeInTheDocument();
    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('navigates to home when start button is clicked', () => {
    renderWithRouter(<OnboardingScreen />);

    // Navigate to final step
    fireEvent.click(screen.getByText('次へ')); // Step 2
    fireEvent.click(screen.getByText('次へ')); // Step 3
    fireEvent.click(screen.getByText('次へ')); // Step 4

    // Click start button
    fireEvent.click(screen.getByText('始める'));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to home when skip button is clicked', () => {
    renderWithRouter(<OnboardingScreen />);

    const skipButton = screen.getByText('スキップ');
    fireEvent.click(skipButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not show back button on first step', () => {
    renderWithRouter(<OnboardingScreen />);

    expect(screen.queryByText('戻る')).not.toBeInTheDocument();
  });

  it('shows all four onboarding steps with correct content', () => {
    renderWithRouter(<OnboardingScreen />);

    // Step 1
    expect(screen.getByText('Morrowへようこそ')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();

    // Go to step 2
    fireEvent.click(screen.getByText('次へ'));
    expect(screen.getByText('イベントを作成')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();

    // Go to step 3
    fireEvent.click(screen.getByText('次へ'));
    expect(screen.getByText('カウントダウンを楽しむ')).toBeInTheDocument();
    expect(screen.getByText('⏰')).toBeInTheDocument();

    // Go to step 4
    fireEvent.click(screen.getByText('次へ'));
    expect(screen.getByText('友達と共有')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('applies correct gradient background styling', () => {
    const { container } = renderWithRouter(<OnboardingScreen />);

    const backgroundDiv = container.querySelector(
      '.bg-gradient-to-br.from-orange-50.to-orange-100'
    );
    expect(backgroundDiv).toBeInTheDocument();
  });
});
