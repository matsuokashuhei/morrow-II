import { screen } from '@testing-library/react';
import { renderWithRouter } from '../utils/test-utils';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('Welcome to Morrow!')).toBeInTheDocument();
  });

  it('should display the welcome message', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('Event Countdown Sharing App')).toBeInTheDocument();
  });

  it('should display the description', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(
      getByText(
        'Create, manage, and share your upcoming events with friends and family.'
      )
    ).toBeInTheDocument();
  });

  it('should display feature cards', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('イベント作成')).toBeInTheDocument();
    expect(getByText('リアルタイム表示')).toBeInTheDocument();
    expect(getByText('友達と共有')).toBeInTheDocument();
  });

  it('should display the start button', () => {
    const { getByText } = renderWithRouter(<HomeScreen />);
    expect(getByText('今すぐ始める')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    renderWithRouter(<HomeScreen />);
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    const featureHeadings = screen.getAllByRole('heading', { level: 3 });
    
    expect(mainHeading).toHaveTextContent('Welcome to Morrow!');
    expect(featureHeadings).toHaveLength(3);
  });

  it('uses semantic HTML and proper CSS classes', () => {
    const { container } = renderWithRouter(<HomeScreen />);
    
    // Check for proper use of semantic HTML
    const button = container.querySelector('button');
    const cards = container.querySelectorAll('[class*="bg-white"][class*="rounded-lg"]');
    
    expect(button).toBeInTheDocument();
    expect(cards).toHaveLength(3);
  });

  it('has proper responsive design classes', () => {
    const { container } = renderWithRouter(<HomeScreen />);
    
    // Check for responsive grid classes
    const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });
});
