import React from 'react';
import { render } from '@testing-library/react-native';
import OnboardingScreen from '../screens/OnboardingScreen';

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions = {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  };
  return RN;
});

describe('OnboardingScreen', () => {
  it('renders correctly', () => {
    const mockOnComplete = jest.fn();
    const { getByText } = render(<OnboardingScreen onComplete={mockOnComplete} />);

    expect(getByText('Skip')).toBeTruthy();
    expect(getByText('Welcome to Morrow')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('shows navigation buttons', () => {
    const mockOnComplete = jest.fn();
    const { getByText } = render(<OnboardingScreen onComplete={mockOnComplete} />);

    expect(getByText('Previous')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });
});
