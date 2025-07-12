import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {component}
    </BrowserRouter>
  );
};

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
});
