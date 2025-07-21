import { Page, expect } from '@playwright/test';
import { TestEvent, selectors } from '../fixtures/test-data';

/**
 * Filters out known non-critical console errors from a list of error messages.
 *
 * Non-critical errors are those that are expected or do not impact the test results.
 * These include warnings, network-related errors in the test environment, and other
 * benign issues such as missing resources or development tool warnings.
 *
 * Critical errors are those not matching the predefined patterns of non-critical errors.
 * These are typically unexpected issues that may indicate a problem with the application
 * under test or the test environment.
 *
 * @param errors - An array of error messages captured from the console.
 * @returns A filtered array containing only critical error messages.
 *
 * @example
 * const errors = [
 *   "Failed to load resource: the server responded with a status of 404 (Not Found)",
 *   "Uncaught TypeError: Cannot read property 'foo' of undefined"
 * ];
 * const criticalErrors = filterCriticalErrors(errors);
 * console.log(criticalErrors); // ["Uncaught TypeError: Cannot read property 'foo' of undefined"]
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
 * Interface for window object with Apollo Client properties
 */
interface WindowWithApolloClient extends Window {
  __APOLLO_CLIENT__?: {
    networkStatus?: number;
    queryManager?: {
      inFlightLinkObservables?: Map<string, any>;
    };
  };
}

/**
 * Waits for GraphQL operations to complete by monitoring the Apollo Client network status.
 *
 * This function is useful in E2E tests when you need to ensure that all pending GraphQL
 * queries and mutations have finished before proceeding with assertions or interactions.
 * It checks the Apollo Client's network status and waits until it's not in a loading state.
 *
 * The function gracefully handles cases where the Apollo Client is not available on the
 * global window object, which can happen during initial page loads or in test environments
 * where the client hasn't been initialized yet.
 *
 * @param page - The Playwright page object representing the browser page.
 * @param timeout - Maximum time to wait in milliseconds (default: 5000).
 * @returns A promise that resolves when GraphQL operations are complete.
 *
 * @example
 * // Wait for GraphQL operations after navigation
 * await page.goto('/events');
 * await waitForGraphQL(page);
 * // Now safe to make assertions about the loaded data
 *
 * @example
 * // Wait with custom timeout
 * await waitForGraphQL(page, 10000);
 */
export const waitForGraphQL = async (page: Page, timeout = 5000): Promise<void> => {
  await page.waitForFunction(
    () => {
      const apolloClient = (window as WindowWithApolloClient).__APOLLO_CLIENT__;
      return !apolloClient || apolloClient.networkStatus !== 1;
    },
    { timeout }
  ).catch(() => {
    // GraphQL client might not be available, continue
  });
};

/**
 * Handles test errors by capturing diagnostic information for debugging purposes.
 *
 * When a test fails, this function automatically captures a screenshot and logs
 * relevant page information to help with debugging. The screenshot is saved to
 * the test-results directory with a filename that includes the test name for
 * easy identification.
 *
 * This function is designed to be called in test error handlers or catch blocks
 * to provide maximum debugging information when tests fail unexpectedly.
 *
 * @param {Page} page - The Playwright page object representing the browser page.
 * @param {string} testName - A descriptive name for the test, used in file naming.
 * @returns {Promise<void>} - A promise that resolves when error handling is complete.
 *
 * @example
 * try {
 *   await page.click('[data-testid="submit-button"]');
 * } catch (error) {
 *   await handleTestError(page, 'event-creation-test');
 *   throw error;
 * }
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
 * TestHelpers class provides common utility methods for E2E testing with Playwright.
 *
 * This class encapsulates frequently used operations in end-to-end tests, providing
 * a consistent interface for navigation, waiting, and interaction patterns. It helps
 * reduce code duplication across test files and ensures consistent behavior.
 *
 * The class is designed to be instantiated once per test with a specific page object,
 * and then reused throughout the test for various operations.
 *
 * @example
 * const helpers = new TestHelpers(page);
 * await helpers.navigateToHome();
 * await helpers.navigateToEventsList();
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigates to the home page and waits for the page to fully load.
   *
   * This method handles the navigation to the root path and ensures that all
   * network requests have completed before returning. This is particularly
   * important for pages that load data asynchronously.
   *
   * @returns {Promise<void>} - A promise that resolves when navigation is complete.
   */
  async navigateToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to the events list page and waits for the page to fully load.
   *
   * This method handles the navigation to the events listing page and ensures
   * that all network requests (including GraphQL queries for event data) have
   * completed before returning. This provides a stable starting point for
   * tests that interact with the events list.
   *
   * @returns {Promise<void>} - A promise that resolves when navigation is complete.
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
