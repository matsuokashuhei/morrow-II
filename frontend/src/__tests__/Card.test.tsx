import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../components';
import { Text } from '../components';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Card>
        <Text>Card content</Text>
      </Card>
    );
    expect(getByText('Card content')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { getByText } = render(
      <Card variant="outlined">
        <Text>Outlined card</Text>
      </Card>
    );
    expect(getByText('Outlined card')).toBeTruthy();
  });

  it('renders with custom padding', () => {
    const { getByText } = render(
      <Card padding={8}>
        <Text>Padded card</Text>
      </Card>
    );
    expect(getByText('Padded card')).toBeTruthy();
  });
});
