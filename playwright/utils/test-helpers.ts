import { Page, expect } from '@playwright/test';
import { TestEvent, selectors } from '../fixtures/test-data';

/**
 * Filter out known non-critical console errors
 */
export const filterCriticalErrors = (errors: string[]): string[] => {
  const nonCriticalPatterns = [
    'favicon.ico',
    'Extension',
    'chrome-extension',
    'devtools',
    'ResizeObserver loop limit exceeded',
    'React Router Future Flag Warning',
    'Warning: An update to',
    'apollo.dev/c/err',
    'No more mocked responses',
    // Network-related errors (expected in test environment)
    'Failed to load resource',
    'ERR_CONNECTION_REFUSED',
    'Network error',
    'Failed to fetch',
    'Backend server appears to be down',
    'Connection refused',
    'Could not connect to localhost'
  ];

  return errors.filter(error =>
    !nonCriticalPatterns.some(pattern => error.includes(pattern))
  );
};

/**
 * Wait for GraphQL operations to complete
 */
export const waitForGraphQL = async (page: Page, timeout = 5000): Promise<void> => {
  await page.waitForFunction(
    () => {
      const apolloClient = (window as any).__APOLLO_CLIENT__;
      return !apolloClient || apolloClient.networkStatus !== 1;
    },
    { timeout }
  ).catch(() => {
    // GraphQL client might not be available, continue
  });
};

/**
 * Common error handling for Playwright tests
 */
export const handleTestError = async (page: Page, testName: string): Promise<void> => {
  try {
    await page.screenshot({ path: `test-results/${testName}-error.png` });
    const html = await page.content();
    console.log(`Error in test ${testName}. Page content length: ${html.length}`);
  } catch (screenshotError) {
    console.log(`Failed to capture error details for ${testName}:`, screenshotError);
  }
};

/**
 * Helper functions for E2E tests
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to home page and wait for it to load
   */
  async navigateToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to events list page
   */
  async navigateToEventsList() {
    await this.page.goto('/events');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to event creation page
   */
  async navigateToEventCreation() {
    await this.page.goto('/events/create');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to event detail page
   */
  async navigateToEventDetail(eventId: string) {
    await this.page.goto(`/events/${eventId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill event creation form
   */
  async fillEventCreationForm(event: TestEvent) {
    // Fill title
    await this.page.fill(selectors.eventCreation.titleInput, event.title);

    // Fill description
    await this.page.fill(selectors.eventCreation.descriptionInput, event.description);

    // Fill emoji
    await this.page.fill(selectors.eventCreation.emojiInput, event.emoji);

    // Fill start time
    const startDate = new Date(event.startTime);
    const startDateString = startDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
    await this.page.fill(selectors.eventCreation.startTimeInput, startDateString);

    // Fill end time
    const endDate = new Date(event.endTime);
    const endDateString = endDate.toISOString().slice(0, 16);
    await this.page.fill(selectors.eventCreation.endTimeInput, endDateString);

    // Select visibility
    await this.page.selectOption(selectors.eventCreation.visibilitySelect, event.visibility);
  }

  /**
   * Submit event creation form
   */
  async submitEventCreationForm() {
    await this.page.click(selectors.eventCreation.submitButton);
  }

  /**
   * Wait for GraphQL operation to complete
   */
  async waitForGraphQLOperation(operationName: string) {
    await this.page.waitForResponse(response =>
      response.url().includes('/query') &&
      (response.request().postData()?.includes(operationName) ?? false)
    );
  }

  /**
   * Search for events in the list
   */
  async searchEvents(searchTerm: string) {
    await this.page.fill(selectors.eventList.searchInput, searchTerm);
    // Wait for search results to update
    await this.page.waitForSelector(selectors.eventList.eventCard);
  }

  /**
   * Filter events by type
   */
  async filterEvents(filterType: 'all' | 'upcoming' | 'ended') {
    const filterSelector = {
      all: selectors.eventList.filterAll,
      upcoming: selectors.eventList.filterUpcoming,
      ended: selectors.eventList.filterEnded,
    }[filterType];

    await this.page.click(filterSelector);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get event cards count
   */
  async getEventCardsCount(): Promise<number> {
    return await this.page.locator(selectors.eventList.eventCard).count();
  }

  /**
   * Click on event card by index
   */
  async clickEventCard(index: number = 0) {
    await this.page.locator(selectors.eventList.eventCard).nth(index).click();
  }

  /**
   * Verify countdown is running (changes over time)
   */
  async verifyCountdownIsRunning() {
    const initialCountdown = await this.page.textContent(selectors.eventDetail.countdown);

    // Wait 2 seconds and check if countdown changed
    await this.page.waitForTimeout(2000);
    const updatedCountdown = await this.page.textContent(selectors.eventDetail.countdown);

    expect(initialCountdown).not.toBe(updatedCountdown);
  }

  /**
   * Complete onboarding flow
   */
  async completeOnboardingFlow() {
    // Navigate through all 4 steps
    for (let step = 0; step < 3; step++) {
      await this.page.click(selectors.onboarding.nextButton);
      await this.page.waitForTimeout(500);
    }

    // Click start on final step
    await this.page.click(selectors.onboarding.startButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify URL
   */
  async verifyURL(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete() {
    await this.page.waitForSelector(selectors.common.loadingSpinner, { state: 'hidden' });
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage?: string) {
    await expect(this.page.locator(selectors.common.errorAlert)).toBeVisible();

    if (expectedMessage) {
      await expect(this.page.locator(selectors.common.errorAlert)).toContainText(expectedMessage);
    }
  }

  /**
   * Dismiss confirmation dialog
   */
  async dismissConfirmDialog(action: 'confirm' | 'cancel' = 'confirm') {
    const dialog = this.page.locator(selectors.common.confirmDialog);
    await expect(dialog).toBeVisible();

    if (action === 'confirm') {
      await this.page.click('button:has-text("確認")');
    } else {
      await this.page.click('button:has-text("キャンセル")');
    }
  }

  /**
   * Verify responsive layout at different screen sizes
   */
  async testResponsiveLayout(sizes: Array<{ width: number; height: number; name: string }>) {
    for (const size of sizes) {
      await this.page.setViewportSize({ width: size.width, height: size.height });
      await this.page.waitForTimeout(500);

      // Take screenshot for visual verification
      await this.takeScreenshot(`responsive-${size.name}`);

      // Verify basic layout elements are still visible
      await expect(this.page.locator('main')).toBeVisible();
    }
  }

  /**
   * Check accessibility basics
   */
  async checkBasicAccessibility() {
    // Check for main landmark
    await expect(this.page.locator('main')).toBeVisible();

    // Check for proper heading hierarchy
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for alt text on images
    const images = this.page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation() {
    // Focus on first interactive element
    await this.page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test Enter key on focused button
    await this.page.keyboard.press('Enter');
  }
}
