import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-orange-600'); // primary variant
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies different variants correctly', () => {
    const { getByRole } = render(
      <Button variant="secondary">Secondary</Button>
    );
    
    expect(getByRole('button')).toHaveClass('bg-gray-200');
  });

  it('shows loading state correctly', () => {
    const { getByRole, container } = render(
      <Button loading>Loading</Button>
    );
    
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-75');
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    
    expect(getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { getByRole } = render(
      <Button className="custom-class">Custom</Button>
    );
    
    expect(getByRole('button')).toHaveClass('custom-class');
  });
});