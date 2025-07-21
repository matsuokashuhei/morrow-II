import { render, screen } from '@testing-library/react';
import { EventCard } from '../../components/EventCard';
import { Event } from '../../store';

// Mock the current date for consistent testing
const mockDate = new Date('2025-07-13T10:00:00Z');
jest.useFakeTimers();
jest.setSystemTime(mockDate);

// Console.log to debug what's happening
console.log('Mock current time:', mockDate.toISOString());
console.log('new Date():', new Date().toISOString());
console.log('Date.now():', new Date(Date.now()).toISOString());

const mockEvent: Event = {
  id: 'test-event-1',
  title: 'Test Event',
  description: 'This is a test event',
  date: '2025-07-20T15:00:00Z', // 7 days in the future
  createdAt: '2025-07-13T09:00:00Z',
  updatedAt: '2025-07-13T09:00:00Z',
};

console.log('Mock event date:', mockEvent.date);
console.log('Event Date object:', new Date(mockEvent.date).toISOString());

const now = new Date().getTime();
const target = new Date(mockEvent.date).getTime();
const difference = target - now;

console.log('now (getTime):', now);
console.log('target (getTime):', target);
console.log('difference:', difference);
console.log('is expired?', difference <= 0);

describe('EventCard Debug', () => {
  it('debug date calculation', () => {
    render(<EventCard event={mockEvent} />);

    // Just check what's rendered
    const cardElement = screen.getByTestId('event-card');
    console.log('Card HTML:', cardElement.innerHTML);

    // This test will always pass, it's just for debugging
    expect(cardElement).toBeInTheDocument();
  });
});
