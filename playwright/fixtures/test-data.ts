/**
 * Test data fixtures for E2E tests
 */

export interface TestEvent {
  id?: string;
  title: string;
  description: string;
  emoji: string;
  startTime: string;
  endTime: string;
  visibility: 'public' | 'private';
}

/**
 * Get a fixed base date for consistent test results
 * This avoids time-dependent test failures
 */
const getBaseDate = (): Date => {
  // Use a fixed date in the future for consistent tests
  return new Date('2025-08-01T10:00:00.000Z');
};

/**
 * Sample events for testing
 */
export const mockEvents: TestEvent[] = [
  {
    title: '誕生日パーティー',
    description: '今年も楽しい誕生日パーティーを開催します！',
    emoji: '🎂',
    startTime: new Date(getBaseDate().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from base date
    endTime: new Date(getBaseDate().getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
    visibility: 'public',
  },
  {
    title: '結婚式',
    description: '人生の特別な日',
    emoji: '💒',
    startTime: new Date(getBaseDate().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from base date
    endTime: new Date(getBaseDate().getTime() + 30 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
    visibility: 'private',
  },
  {
    title: '卒業式',
    description: '学生生活の集大成',
    emoji: '🎓',
    startTime: new Date(getBaseDate().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from base date
    endTime: new Date(getBaseDate().getTime() + 60 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    visibility: 'public',
  },
  {
    title: '過去のイベント',
    description: '既に終了したイベント',
    emoji: '📅',
    startTime: new Date(getBaseDate().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days before base date
    endTime: new Date(getBaseDate().getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    visibility: 'public',
  },
];

/**
 * Test user data
 */
export const testUser = {
  name: 'テストユーザー',
  email: 'test@example.com',
};

/**
 * Common test data for forms
 */
export const formTestData = {
  validEvent: {
    title: 'E2Eテストイベント',
    description: 'Playwrightで作成されたテストイベントです',
    emoji: '🧪',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    visibility: 'public' as const,
  },
  invalidEvent: {
    title: '', // empty title should cause validation error
    description: 'バリデーションエラーテスト用',
    emoji: '❌',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday (past date)
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    visibility: 'private' as const,
  },
};

/**
 * Test selectors for consistent element targeting
 */
export const selectors = {
  home: {
    heroTitle: '[data-testid="hero-title"]',
    createEventButton: '[data-testid="create-event-btn"]',
    onboardingButton: '[data-testid="onboarding-btn"]',
    featureCards: '[data-testid="feature-card"]',
  },
  onboarding: {
    progressBar: '[data-testid="progress-bar"]',
    nextButton: '[data-testid="next-btn"]',
    prevButton: '[data-testid="prev-btn"]',
    skipButton: '[data-testid="skip-btn"]',
    startButton: '[data-testid="start-btn"]',
  },
  eventCreation: {
    form: '[data-testid="event-creation-form"]',
    titleInput: '[data-testid="title-input"]',
    descriptionInput: '[data-testid="description-input"]',
    emojiInput: '[data-testid="emoji-input"]',
    startTimeInput: '[data-testid="start-time-input"]',
    endTimeInput: '[data-testid="end-time-input"]',
    visibilitySelect: '[data-testid="visibility-select"]',
    submitButton: '[data-testid="submit-btn"]',
    cancelButton: '[data-testid="cancel-btn"]',
    errorMessage: '[data-testid="error-message"]',
  },
  eventList: {
    searchInput: '[data-testid="search-input"]',
    filterAll: '[data-testid="filter-all"]',
    filterUpcoming: '[data-testid="filter-upcoming"]',
    filterEnded: '[data-testid="filter-ended"]',
    eventCard: '[data-testid="event-card"]',
    eventTitle: '[data-testid="event-title"]',
    eventCountdown: '[data-testid="event-countdown"]',
    createButton: '[data-testid="create-event-btn"]',
    emptyState: '[data-testid="empty-state"]',
  },
  eventDetail: {
    title: '[data-testid="event-title"]',
    description: '[data-testid="event-description"]',
    countdown: '[data-testid="countdown-display"]',
    editButton: '[data-testid="edit-btn"]',
    deleteButton: '[data-testid="delete-btn"]',
    shareButton: '[data-testid="share-btn"]',
    breadcrumb: '[data-testid="breadcrumb"]',
  },
  navigation: {
    homeLink: '[data-testid="nav-home"]',
    eventsLink: '[data-testid="nav-events"]',
    createLink: '[data-testid="nav-create"]',
  },
  common: {
    loadingSpinner: '[data-testid="loading"]',
    errorAlert: '[data-testid="error-alert"]',
    confirmDialog: '[data-testid="confirm-dialog"]',
    backButton: '[data-testid="back-btn"]',
  },
};
