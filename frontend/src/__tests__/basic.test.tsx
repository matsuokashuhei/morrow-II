import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Simple test component
const TestComponent = () => (
  <View>
    <Text testID="test-text">Hello World</Text>
  </View>
);

describe('Basic Tests', () => {
  it('should render test component', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-text')).toBeTruthy();
  });

  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });
});
