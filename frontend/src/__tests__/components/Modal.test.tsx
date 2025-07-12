import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../../components/ui/Modal';

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    // Click on the overlay (the modal backdrop)
    const overlay = document.querySelector('.fixed.inset-0.bg-black');
    fireEvent.click(overlay!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        <div>Modal content</div>
      </Modal>
    );

    const overlay = document.querySelector('.fixed.inset-0.bg-black');
    fireEvent.click(overlay!);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal" showCloseButton={false}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={jest.fn()} size="sm">
        <div>Modal content</div>
      </Modal>
    );

    let modalContent = document.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={jest.fn()} size="lg">
        <div>Modal content</div>
      </Modal>
    );

    modalContent = document.querySelector('.max-w-2xl');
    expect(modalContent).toBeInTheDocument();
  });

  it('calls onClose when escape key is pressed', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not propagate click events from modal content', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div data-testid="modal-content">Modal content</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('modal-content'));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
