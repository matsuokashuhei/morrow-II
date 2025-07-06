import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '../screens/SplashScreen';

// Mock Animated to avoid warnings in tests
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = () => ({
    start: jest.fn(),
  });
  return RN;
});

describe('SplashScreen', () => {
  it('renders correctly', () => {
    const mockOnFinish = jest.fn();
    const { getByText } = render(<SplashScreen onFinish={mockOnFinish} />);

    expect(getByText('Morrow')).toBeTruthy();
    expect(getByText('Event Countdown Sharing')).toBeTruthy();
  });

  it('calls onFinish after timeout', (done) => {
    const mockOnFinish = jest.fn(() => {
      expect(mockOnFinish).toHaveBeenCalled();
      done();
    });

    render(<SplashScreen onFinish={mockOnFinish} />);

    // Fast-forward time to trigger the timeout
    setTimeout(() => {
      if (!mockOnFinish.mock.calls.length) {
        done.fail('onFinish was not called');
      }
    }, 3100);
  });
});
