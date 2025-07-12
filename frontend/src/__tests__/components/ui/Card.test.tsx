import { render } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  it('renders with default props', () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.firstChild as HTMLElement;
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card content');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6'); // default padding
  });

  it('applies different padding sizes', () => {
    const { container } = render(
      <Card padding="sm">Small padding</Card>
    );
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('p-4');
  });

  it('applies large padding correctly', () => {
    const { container } = render(
      <Card padding="lg">Large padding</Card>
    );
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-card">Custom card</Card>
    );
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('custom-card');
  });

  it('forwards HTML attributes correctly', () => {
    const { container } = render(
      <Card data-testid="test-card" id="my-card">
        Test content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveAttribute('data-testid', 'test-card');
    expect(card).toHaveAttribute('id', 'my-card');
  });
});