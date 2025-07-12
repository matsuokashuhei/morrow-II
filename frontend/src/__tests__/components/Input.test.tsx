import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../components/ui/Input';

describe('Input Component', () => {
  it('renders with basic props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300');
  });

  it('displays helper text', () => {
    render(<Input helperText="Please enter a valid email" />);
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input
        error="This field is required"
        helperText="Please enter a valid email"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-50 cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('generates unique id when not provided', () => {
    const { container } = render(<Input label="Test" />);
    const input = container.querySelector('input');
    const label = container.querySelector('label');

    expect(input).toHaveAttribute('id');
    expect(label).toHaveAttribute('for', input?.getAttribute('id'));
  });

  it('uses provided id', () => {
    render(<Input id="custom-id" label="Test" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
