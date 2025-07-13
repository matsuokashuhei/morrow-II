import { render, screen, fireEvent, act } from '@testing-library/react';
import { EventCard } from '../../components/EventCard';
import { Event } from '../../store';

// Mock the current date for consistent testing
const mockDate = new Date('2025-07-13T10:00:00Z');
jest.useFakeTimers();
jest.setSystemTime(mockDate);

const mockEvent: Event = {
  id: 'test-event-1',
  title: 'Test Event',
  description: 'This is a test event',
  date: '2025-07-20T15:00:00Z', // 7 days in the future
  createdAt: '2025-07-13T09:00:00Z',
  updatedAt: '2025-07-13T09:00:00Z',
};

const mockExpiredEvent: Event = {
  id: 'expired-event-1',
  title: 'Expired Event',
  description: 'This event has ended',
  date: '2025-07-10T15:00:00Z', // 3 days in the past
  createdAt: '2025-07-10T09:00:00Z',
  updatedAt: '2025-07-10T09:00:00Z',
};

describe('EventCard Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
    expect(screen.getByText('残り時間')).toBeInTheDocument();
  });

  it('displays countdown for future events', () => {
    render(<EventCard event={mockEvent} />);

    // Should show countdown elements
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('時間')).toBeInTheDocument();
    expect(screen.getByText('分')).toBeInTheDocument();
    expect(screen.getByText('秒')).toBeInTheDocument();
  });

  it('displays expired message for past events', () => {
    render(<EventCard event={mockExpiredEvent} />);

    expect(screen.getByText('🎉 イベント終了')).toBeInTheDocument();
    expect(screen.getByText('このイベントは終了しました')).toBeInTheDocument();
  });

  it('updates countdown every second', () => {
    render(<EventCard event={mockEvent} />);

    // Fast forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // The component should update (this is a basic test that it doesn't crash)
    expect(screen.getByText('残り時間')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<EventCard event={mockEvent} onEdit={mockOnEdit} />);

    const editButton = screen.getByRole('button'); // Only one button when only onEdit is provided
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(<EventCard event={mockEvent} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button'); // Only one button when only onDelete is provided
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockEvent);
  });

  it('calls onShare when share button is clicked', () => {
    const mockOnShare = jest.fn();
    render(<EventCard event={mockEvent} onShare={mockOnShare} />);

    const shareButton = screen.getByRole('button'); // Only one button when only onShare is provided
    fireEvent.click(shareButton);
    expect(mockOnShare).toHaveBeenCalledWith(mockEvent);
  });

  it('does not render action buttons when handlers are not provided', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    const eventWithoutDescription = { ...mockEvent, description: undefined };
    render(<EventCard event={eventWithoutDescription} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.queryByText('This is a test event')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EventCard event={mockEvent} className="custom-event-card" />
    );

    expect(container.firstChild).toHaveClass('custom-event-card');
  });

  it('formats date correctly', () => {
    render(<EventCard event={mockEvent} />);

    // Should display formatted date in Japanese locale
    expect(screen.getByText(/2025年7月/)).toBeInTheDocument();
  });
});
