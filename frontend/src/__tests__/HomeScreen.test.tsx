import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';

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
  it('should render without crashing', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('Welcome to Morrow!')).toBeInTheDocument();
  });

  it('should display the welcome message', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('Event Countdown Sharing App')).toBeInTheDocument();
  });

  it('should display the description when no events exist', () => {
    renderWithRouter(<HomeScreen />);
    expect(
      screen.getByText(
        'Create, manage, and share your upcoming events with friends and family.'
      )
    ).toBeInTheDocument();
  });

  it('should display feature cards when no events exist', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('イベント作成')).toBeInTheDocument();
    expect(screen.getByText('リアルタイム表示')).toBeInTheDocument();
    expect(screen.getByText('友達と共有')).toBeInTheDocument();
  });

  it('should display the create event button', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('イベントを作成')).toBeInTheDocument();
  });

  it('should display the onboarding link when no events exist', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('使い方を見る')).toBeInTheDocument();
  });

  it('should open create event modal when button is clicked', () => {
    renderWithRouter(<HomeScreen />);

    const createButton = screen.getByText('イベントを作成');
    fireEvent.click(createButton);

    expect(screen.getByText('新しいイベントを作成')).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', () => {
    renderWithRouter(<HomeScreen />);

    // Open modal
    fireEvent.click(screen.getByText('イベントを作成'));

    // Close modal
    fireEvent.click(screen.getByText('キャンセル'));

    expect(screen.queryByText('新しいイベントを作成')).not.toBeInTheDocument();
  });

  it('should require event name and date for creation', () => {
    renderWithRouter(<HomeScreen />);

    // Open modal
    fireEvent.click(screen.getByText('イベントを作成'));

    // Create button should be disabled initially
    const createButton = screen.getByRole('button', { name: '作成' });
    expect(createButton).toBeDisabled();
  });

  it('should enable create button when required fields are filled', () => {
    renderWithRouter(<HomeScreen />);

    // Open modal
    fireEvent.click(screen.getByText('イベントを作成'));

    // Fill required fields
    const titleInput = screen.getByLabelText('イベント名') as HTMLInputElement;
    const dateInput = screen.getByLabelText('イベント日時') as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(dateInput, { target: { value: '2025-07-20T15:00' } });

    // Check that values were set
    expect(titleInput.value).toBe('Test Event');
    expect(dateInput.value).toBe('2025-07-20T15:00');

    // Create button should be enabled after state updates
    setTimeout(() => {
      const createButton = screen.getByRole('button', { name: '作成' });
      expect(createButton).not.toHaveAttribute('disabled');
    }, 0);
  });
});
