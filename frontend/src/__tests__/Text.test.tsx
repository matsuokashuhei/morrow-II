import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../components';

describe('Text Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { getByText } = render(<Text variant="h1">Heading</Text>);
    expect(getByText('Heading')).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { getByText } = render(<Text color="#FF0000">Colored Text</Text>);
    expect(getByText('Colored Text')).toBeTruthy();
  });
});
