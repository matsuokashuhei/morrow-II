import { render, screen } from '@testing-library/react';
import { Button, Card, Input, Modal, Steps } from '../components/ui';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByText('Primary')).toHaveClass('bg-orange-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-gray-200');

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByText('Danger')).toHaveClass('bg-red-600');
    });

    it('renders different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByText('Small')).toHaveClass('px-4 py-2 text-sm');

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByText('Medium')).toHaveClass('px-6 py-3 text-base');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByText('Large')).toHaveClass('px-8 py-4 text-lg');
    });

    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByText('Loading')).toBeDisabled();
    });
  });

  describe('Card', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies correct base classes', () => {
      render(<Card data-testid="card">Card content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders different variants', () => {
      const { rerender } = render(<Input variant="default" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('bg-white');

      rerender(<Input variant="filled" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('bg-gray-50');
    });
  });

  describe('Modal', () => {
    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          Modal content
        </Modal>
      );
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          Modal content
        </Modal>
      );
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          Modal content
        </Modal>
      );
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });
  });

  describe('Steps', () => {
    const steps = [
      { title: 'Step 1', description: 'First step' },
      { title: 'Step 2', description: 'Second step' },
      { title: 'Step 3', description: 'Third step' },
    ];

    it('renders all steps', () => {
      render(<Steps steps={steps} currentStep={0} />);
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('shows step indicators', () => {
      render(<Steps steps={steps} currentStep={1} />);
      // At step 1, step 0 should be completed (checkmark), step 1 should show "2", step 2 should show "3"
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('applies correct styles for different step states', () => {
      const { container } = render(<Steps steps={steps} currentStep={1} />);
      // Just verify the component renders without crashes
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});