import React from 'react';
import { render } from '@testing-library/react-native';
import { Container } from '../components';
import { Text } from '../components';

describe('Container Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Container>
        <Text>Container content</Text>
      </Container>
    );
    expect(getByText('Container content')).toBeTruthy();
  });

  it('renders with flex prop', () => {
    const { getByText } = render(
      <Container flex>
        <Text>Flex container</Text>
      </Container>
    );
    expect(getByText('Flex container')).toBeTruthy();
  });

  it('renders with centered prop', () => {
    const { getByText } = render(
      <Container centered>
        <Text>Centered container</Text>
      </Container>
    );
    expect(getByText('Centered container')).toBeTruthy();
  });

  it('renders with custom padding', () => {
    const { getByText } = render(
      <Container padding={8}>
        <Text>Padded container</Text>
      </Container>
    );
    expect(getByText('Padded container')).toBeTruthy();
  });
});
