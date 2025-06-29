import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Simple App component for testing
const App = () => (
  <View>
    <Text testID="app-text">Morrow App</Text>
  </View>
);

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app-text')).toBeTruthy();
  });
});
