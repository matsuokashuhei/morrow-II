import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import EventCreationForm from '../EventCreationForm';
import {
  CreateEventDocument,
  EventVisibility,
} from '../../../graphql/generated';

// Mock the useCreateEvent hook
jest.mock('../../../hooks/useCreateEvent');

const mockCreateEvent = jest.fn();
const mockUseCreateEvent = jest.fn(() => ({
  createEvent: mockCreateEvent,
  loading: false,
  error: null,
}));

// Set up the mock implementation
beforeEach(() => {
  const useCreateEventModule = require('../../../hooks/useCreateEvent');
  useCreateEventModule.useCreateEvent = mockUseCreateEvent;
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock for CreateEvent mutation
const createEventMock = {
  request: {
    query: CreateEventDocument,
    variables: {
      input: {
        title: 'Test Event',
        description: 'Test Description',
        startTime: '2025-07-14T10:00:00.000Z',
        endTime: '2025-07-14T11:00:00.000Z',
        emoji: '🎉',
        visibility: EventVisibility.Private,
        creatorId: '1',
      },
    },
  },
  result: {
    data: {
      createEvent: {
        id: '1',
        title: 'Test Event',
        description: 'Test Description',
        startTime: '2025-07-14T10:00:00.000Z',
        endTime: '2025-07-14T11:00:00.000Z',
        emoji: '🎉',
        visibility: EventVisibility.Private,
        createdAt: '2025-07-13T08:00:00.000Z',
        updatedAt: '2025-07-13T08:00:00.000Z',
        creator: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    },
  },
};

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <MockedProvider mocks={[createEventMock]} addTypename={false}>
        <EventCreationForm {...props} />
      </MockedProvider>
    </BrowserRouter>
  );
};

describe('EventCreationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default mock
    mockUseCreateEvent.mockReturnValue({
      createEvent: mockCreateEvent,
      loading: false,
      error: null,
    });
  });

  it('renders form with all required fields', () => {
    renderComponent();

    expect(screen.getByText('新しいイベントを作成')).toBeInTheDocument();
    expect(screen.getByLabelText('イベント名')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('開始日時')).toBeInTheDocument();
    expect(screen.getByLabelText('終了日時')).toBeInTheDocument();
    expect(screen.getByLabelText('絵文字')).toBeInTheDocument();
    expect(screen.getByText('プライベート（自分のみ）')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'イベントを作成' })
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderComponent();

    // Clear the title field to trigger required validation
    const titleInput = screen.getByLabelText('イベント名');
    fireEvent.change(titleInput, { target: { value: '' } });

    // Clear the startTime and endTime fields to trigger required validation
    const startTimeInput = screen.getByLabelText('開始日時');
    const endTimeInput = screen.getByLabelText('終了日時');
    fireEvent.change(startTimeInput, { target: { value: '' } });
    fireEvent.change(endTimeInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('タイトルは必須です')).toHaveLength(2);
      expect(screen.getAllByText('開始日時は必須です')).toHaveLength(2);
      expect(screen.getAllByText('終了日時は必須です')).toHaveLength(2);
    });
  });

  it('validates title length constraints', async () => {
    renderComponent();

    const titleInput = screen.getByLabelText('イベント名');

    // Test max length validation
    const longTitle = 'a'.repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('100文字以内で入力してください')).toHaveLength(
        2
      ); // Should appear in both error summary and field error
    });
  });

  it('validates description length constraints', async () => {
    renderComponent();

    const descriptionInput = screen.getByLabelText('説明');

    // Test max length validation
    const longDescription = 'a'.repeat(501);
    fireEvent.change(descriptionInput, { target: { value: longDescription } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('500文字以内で入力してください')).toHaveLength(
        2
      ); // Should appear in both error summary and field error
    });
  });

  it('validates start time is in the future', async () => {
    renderComponent();

    const startTimeInput = screen.getByLabelText('開始日時');

    // Set start time to past
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);
    const pastDateString = pastDate.toISOString().slice(0, 16);

    fireEvent.change(startTimeInput, { target: { value: pastDateString } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('過去の日時は選択できません')).toHaveLength(2); // Should appear in both error summary and field error
    });
  });

  it('validates end time is after start time', async () => {
    renderComponent();

    const startTimeInput = screen.getByLabelText('開始日時');
    const endTimeInput = screen.getByLabelText('終了日時');

    // Set start time to future
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);
    const futureDateString = futureDate.toISOString().slice(0, 16);

    // Set end time before start time
    const earlierDate = new Date();
    earlierDate.setHours(earlierDate.getHours() + 1);
    const earlierDateString = earlierDate.toISOString().slice(0, 16);

    fireEvent.change(startTimeInput, { target: { value: futureDateString } });
    fireEvent.change(endTimeInput, { target: { value: earlierDateString } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getAllByText('終了時刻は開始時刻より後に設定してください')
      ).toHaveLength(2); // Should appear in both error summary and field error
    });
  });

  it('validates emoji length', async () => {
    renderComponent();

    const emojiInput = screen.getByLabelText('絵文字');

    // Test max length validation
    fireEvent.change(emojiInput, { target: { value: '🎉🎊🎈' } });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getAllByText('絵文字は2文字以内で入力してください')
      ).toHaveLength(2); // Should appear in both error summary and field error
    });
  });

  it('calls onSuccess when form is submitted successfully', async () => {
    const onSuccess = jest.fn();
    renderComponent({ onSuccess });

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('イベント名'), {
      target: { value: 'Test Event' },
    });
    fireEvent.change(screen.getByLabelText('説明'), {
      target: { value: 'Test Description' },
    });

    // Set future dates
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 2);

    fireEvent.change(screen.getByLabelText('開始日時'), {
      target: { value: startDate.toISOString().slice(0, 16) },
    });
    fireEvent.change(screen.getByLabelText('終了日時'), {
      target: { value: endDate.toISOString().slice(0, 16) },
    });

    const submitButton = screen.getByRole('button', { name: 'イベントを作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    renderComponent({ onCancel });

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('shows loading state during form submission', async () => {
    // Mock loading state
    mockUseCreateEvent.mockReturnValue({
      createEvent: jest.fn(),
      loading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByText('イベント作成中...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'イベント作成中...' })
    ).toBeDisabled();
  });

  it('displays error message when creation fails', () => {
    // Mock error state
    mockUseCreateEvent.mockReturnValue({
      createEvent: jest.fn(),
      loading: false,
      error: new Error('Network error') as any,
    });

    renderComponent();

    expect(
      screen.getByText('エラーが発生しました: Network error')
    ).toBeInTheDocument();
  });
});
