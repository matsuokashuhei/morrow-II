import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Welcome to Morrow!')).toBeTruthy();
  });

  it('should display the welcome message', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Event Countdown Sharing App')).toBeTruthy();
  });

  it('should display the description', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Create, manage, and share your upcoming events with friends and family.')).toBeTruthy();
  });
});
