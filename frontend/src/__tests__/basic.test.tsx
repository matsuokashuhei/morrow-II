import React from 'react';
import { render } from '@testing-library/react';

// Simple test component
const TestComponent = () => (
  <div>
    <p data-testid="test-text">Hello World</p>
  </div>
);

describe('Basic Tests', () => {
  it('should render test component', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-text')).toBeInTheDocument();
  });

  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });
});
