import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('handles press events', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button onPress={mockPress}>Press me</Button>);

    fireEvent.press(getByText('Press me'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(<Button loading testID="loading-button">Loading</Button>);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { getByText } = render(<Button variant="secondary">Secondary</Button>);
    expect(getByText('Secondary')).toBeTruthy();
  });
});
