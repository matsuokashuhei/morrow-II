import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Welcome to Morrow!')).toBeTruthy();
    expect(getByText('Create and share countdowns for your special moments')).toBeTruthy();
  });

  it('renders action cards', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('🎉 Create Event')).toBeTruthy();
    expect(getByText('🤝 Join Event')).toBeTruthy();
  });

  it('renders features section', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('What you can do')).toBeTruthy();
    expect(getByText('📅 Create countdowns for any event')).toBeTruthy();
  });
});
