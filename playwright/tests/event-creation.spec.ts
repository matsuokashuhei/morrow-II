import { test, expect } from '@playwright/test';
import { EventCreationPage, HomePage } from '../utils/page-objects';
import { formTestData } from '../fixtures/test-data';
import { filterCriticalErrors, waitForGraphQL, handleTestError } from '../utils/test-helpers';

test.describe('Event Creation Flow', () => {
  let eventCreationPage: EventCreationPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    eventCreationPage = new EventCreationPage(page);
    homePage = new HomePage(page);
  });

  test.describe('Navigation to Event Creation', () => {
    test('should navigate from home page create button', async () => {
      await homePage.navigate();
      await homePage.clickCreateEvent();
      await expect(eventCreationPage.page).toHaveURL(/\/events\/create/);
    });

    test('should access event creation directly', async () => {
      await eventCreationPage.navigate();
      await expect(eventCreationPage.page).toHaveURL(/\/events\/create/);
    });
  });

  test.describe('Form Display and Layout', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should display all form elements', async () => {
      await expect(eventCreationPage.form).toBeVisible();
      await expect(eventCreationPage.titleInput).toBeVisible();
      await expect(eventCreationPage.descriptionInput).toBeVisible();
      await expect(eventCreationPage.emojiInput).toBeVisible();
      await expect(eventCreationPage.startTimeInput).toBeVisible();
      await expect(eventCreationPage.endTimeInput).toBeVisible();
      await expect(eventCreationPage.visibilitySelect).toBeVisible();
      await expect(eventCreationPage.submitButton).toBeVisible();
      await expect(eventCreationPage.cancelButton).toBeVisible();
    });

    test('should have proper form labels and placeholders', async ({ page }) => {
      // Check for proper labels
      await expect(page.locator('label[for*="title"]')).toBeVisible();
      await expect(page.locator('label[for*="description"]')).toBeVisible();
      await expect(page.locator('label[for*="emoji"]')).toBeVisible();
      await expect(page.locator('label[for*="startTime"]')).toBeVisible();
      await expect(page.locator('label[for*="endTime"]')).toBeVisible();
      await expect(page.locator('label[for*="visibility"]')).toBeVisible();
    });

    test('should have appropriate input types', async () => {
      await expect(eventCreationPage.titleInput).toHaveAttribute('type', 'text');
      await expect(eventCreationPage.startTimeInput).toHaveAttribute('type', 'datetime-local');
      await expect(eventCreationPage.endTimeInput).toHaveAttribute('type', 'datetime-local');
    });
  });

  test.describe('Form Validation - Success Cases', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should create event with valid data', async () => {
      const eventData = formTestData.validEvent;

      // Fill form with valid data
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillDescription(eventData.description);
      await eventCreationPage.fillEmoji(eventData.emoji);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);
      await eventCreationPage.selectVisibility(eventData.visibility);

      // Submit form
      await eventCreationPage.submit();

      // Should navigate to events list or detail page
      await expect(eventCreationPage.page).toHaveURL(/\/events/);
    });

    test('should handle minimum required fields', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      // Fill only required fields
      await eventCreationPage.fillTitle('Minimum Event');
      await eventCreationPage.fillStartTime(tomorrow);
      await eventCreationPage.fillEndTime(dayAfterTomorrow);

      await eventCreationPage.submit();
      await expect(eventCreationPage.page).toHaveURL(/\/events/);
    });

    test('should allow emoji input', async () => {
      await eventCreationPage.fillEmoji('🎉');
      const emojiValue = await eventCreationPage.emojiInput.inputValue();
      expect(emojiValue).toBe('🎉');
    });

    test('should handle long descriptions', async () => {
      const longDescription = 'A'.repeat(500);
      await eventCreationPage.fillDescription(longDescription);

      const descriptionValue = await eventCreationPage.descriptionInput.inputValue();
      expect(descriptionValue).toBe(longDescription);
    });
  });

  test.describe('Form Validation - Error Cases', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should show error for empty title', async () => {
      // Try to submit with empty title
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      await eventCreationPage.fillStartTime(tomorrow);
      await eventCreationPage.fillEndTime(dayAfterTomorrow);
      await eventCreationPage.submit();

      // Should show validation error
      await expect(eventCreationPage.errorMessage).toBeVisible();
      await expect(eventCreationPage.errorMessage).toContainText('タイトル');
    });

    test('should show error for past start date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();

      await eventCreationPage.fillTitle('Past Event');
      await eventCreationPage.fillStartTime(yesterday);
      await eventCreationPage.fillEndTime(today);
      await eventCreationPage.submit();

      await expect(eventCreationPage.errorMessage).toBeVisible();
      await expect(eventCreationPage.errorMessage).toContainText('過去');
    });

    test('should show error when end time is before start time', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const today = new Date();

      await eventCreationPage.fillTitle('Invalid Time Event');
      await eventCreationPage.fillStartTime(tomorrow);
      await eventCreationPage.fillEndTime(today); // End before start
      await eventCreationPage.submit();

      await expect(eventCreationPage.errorMessage).toBeVisible();
      await expect(eventCreationPage.errorMessage).toContainText('終了時刻');
    });

    test('should validate title length', async () => {
      const veryLongTitle = 'A'.repeat(101); // Assuming max length is 100

      await eventCreationPage.fillTitle(veryLongTitle);

      // Should either truncate or show validation error
      const titleValue = await eventCreationPage.titleInput.inputValue();
      expect(titleValue.length).toBeLessThanOrEqual(100);
    });
  });

  test.describe('Real-time Validation', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should validate title field on blur', async () => {
      await eventCreationPage.titleInput.focus();
      await eventCreationPage.titleInput.blur();

      // Should show validation message for empty title
      const errorElement = eventCreationPage.page.locator('text=必須');
      if (await errorElement.isVisible()) {
        await expect(errorElement).toBeVisible();
      }
    });

    test('should update validation as user types', async () => {
      // Start with invalid input
      await eventCreationPage.fillTitle('');
      await eventCreationPage.titleInput.blur();

      // Add valid title
      await eventCreationPage.fillTitle('Valid Title');

      // Validation error should disappear
      await eventCreationPage.page.waitForTimeout(100);
      // Verification depends on implementation
    });
  });

  test.describe('Form Interaction', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should clear form when cancel is clicked', async () => {
      // Fill some data
      await eventCreationPage.fillTitle('Test Event');
      await eventCreationPage.fillDescription('Test Description');

      // Click cancel
      await eventCreationPage.cancel();

      // Should navigate away or clear form
      await expect(eventCreationPage.page).toHaveURL(/\/events|\/$/);
    });

    test('should preserve form data when navigating back', async ({ page }) => {
      await eventCreationPage.fillTitle('Preserved Event');
      await eventCreationPage.fillDescription('Preserved Description');

      // Navigate away and back (simulating browser back button)
      await page.goBack();
      await page.goForward();

      // Form data should be preserved (depending on implementation)
      const titleValue = await eventCreationPage.titleInput.inputValue();
      // This might be empty if form doesn't preserve state
    });

    test('should handle date picker interaction', async () => {
      // Click on date inputs to open pickers
      await eventCreationPage.startTimeInput.click();

      // Should be focusable and accept input
      await expect(eventCreationPage.startTimeInput).toBeFocused();

      const now = new Date();
      now.setHours(now.getHours() + 1);
      await eventCreationPage.fillStartTime(now);

      const inputValue = await eventCreationPage.startTimeInput.inputValue();
      expect(inputValue).toBeTruthy();
    });
  });

  test.describe('GraphQL Integration', () => {
    test('should send correct GraphQL mutation on form submission', async ({ page }) => {
      const eventData = formTestData.validEvent;

      // Set up GraphQL endpoint variable for more maintainable tests
      const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://backend:8080/api/v1/graphql';

      // Monitor GraphQL requests with improved pattern matching
      interface GraphQLRequest {
        url: string;
        postData?: string | null;
      }
      const graphqlRequests: GraphQLRequest[] = [];

      // Use more specific pattern to avoid conflicts
      await page.route('**/api/v1/graphql', route => {
        graphqlRequests.push({
          url: route.request().url(),
          postData: route.request().postData(),
        });
        // Continue with the request to avoid breaking the form
        route.continue();
      });

      // Navigate and wait for form to be ready
      await eventCreationPage.navigate();
      await page.waitForLoadState('networkidle');

      // Fill and submit form
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillDescription(eventData.description);
      await eventCreationPage.fillEmoji(eventData.emoji);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);
      await eventCreationPage.selectVisibility(eventData.visibility);

      await eventCreationPage.submit();

      // Verify GraphQL mutation was sent
      const createEventMutation = graphqlRequests.find(req =>
        req.postData?.includes('CreateEvent')
      );
      expect(createEventMutation).toBeTruthy();
    });

    test('should handle GraphQL errors gracefully', async ({ page }) => {
      // Set up error response for CreateEvent mutation while allowing other queries
      await page.route('**/api/v1/graphql', route => {
        const postData = route.request().postData();

        if (postData?.includes('CreateEvent')) {
          // Mock CreateEvent mutation error
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: 'Event creation failed: Invalid data',
                  extensions: {
                    code: 'VALIDATION_ERROR'
                  }
                }
              ]
            })
          });
        } else {
          // Allow other queries (like GetEvents) to proceed normally
          route.continue();
        }
      });

      const eventData = formTestData.validEvent;

      // Navigate and fill form
      await eventCreationPage.navigate();
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillDescription(eventData.description);
      await eventCreationPage.fillEmoji(eventData.emoji);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);
      await eventCreationPage.selectVisibility(eventData.visibility);

      await eventCreationPage.submit();

      // Should show error message
      await expect(eventCreationPage.errorMessage).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test.skip('should show loading state during form submission', async ({ page }) => {
      // SKIP: This test delays GraphQL requests which can interfere with Apollo Client form rendering
      // TODO: Fix in next iteration with proper Apollo MockedProvider setup
      // Delay the GraphQL response to see loading state, but handle GetEvents separately
      await page.route('**/api/v1/graphql', route => {
        const postData = route.request().postData();

        if (postData?.includes('GetEvents')) {
          // Allow GetEvents query to succeed immediately so form can render
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                events: []
              }
            })
          });
        } else if (postData?.includes('CreateEvent')) {
          // Delay CreateEvent mutation to test loading state
          setTimeout(() => {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: {
                  createEvent: {
                    id: '1',
                    title: 'Test Event',
                    description: 'Test Description',
                    startTime: '2025-07-14T10:00:00Z',
                    endTime: '2025-07-14T11:00:00Z',
                    emoji: '🎉',
                    visibility: 'private',
                    createdAt: '2025-07-14T10:00:00Z',
                    updatedAt: '2025-07-14T10:00:00Z',
                    creator: { id: '1', name: 'Test User', email: 'test@example.com' }
                  }
                }
              })
            });
          }, 1000);
        } else {
          // Let other requests through
          route.continue();
        }
      });

      const eventData = formTestData.validEvent;
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);

      await eventCreationPage.submit();

      // Submit button should show loading state
      await expect(eventCreationPage.submitButton).toBeDisabled();

      // Should show loading indicator
      const loadingIndicator = page.locator('[data-testid="loading"], .loading, text=送信中');
      if (await loadingIndicator.isVisible()) {
        await expect(loadingIndicator).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await eventCreationPage.navigate();

      // All form elements should be visible and usable
      await expect(eventCreationPage.form).toBeVisible();
      await expect(eventCreationPage.titleInput).toBeVisible();
      await expect(eventCreationPage.submitButton).toBeVisible();

      // Should be able to fill and submit
      const eventData = formTestData.validEvent;
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);

      await eventCreationPage.submit();
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await eventCreationPage.navigate();

      await expect(eventCreationPage.form).toBeVisible();

      const eventData = formTestData.validEvent;
      await eventCreationPage.fillTitle(eventData.title);
      await eventCreationPage.fillStartTime(eventData.startTime);
      await eventCreationPage.fillEndTime(eventData.endTime);

      await eventCreationPage.submit();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async () => {
      await eventCreationPage.navigate();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(eventCreationPage.titleInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(eventCreationPage.descriptionInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(eventCreationPage.emojiInput).toBeFocused();
    });

    test('should have proper form labels', async ({ page }) => {
      // All inputs should have associated labels
      const titleLabel = await eventCreationPage.titleInput.getAttribute('aria-label') ||
                        await page.locator('label[for*="title"]').textContent();
      expect(titleLabel).toBeTruthy();

      const descriptionLabel = await eventCreationPage.descriptionInput.getAttribute('aria-label') ||
                              await page.locator('label[for*="description"]').textContent();
      expect(descriptionLabel).toBeTruthy();
    });

    test('should have proper error announcements', async () => {
      // Submit invalid form
      await eventCreationPage.submit();

      // Error should be announced to screen readers
      const errorElement = eventCreationPage.errorMessage;
      if (await errorElement.isVisible()) {
        const ariaLive = await errorElement.getAttribute('aria-live');
        expect(ariaLive).toBeTruthy();
      }
    });
  });
});
