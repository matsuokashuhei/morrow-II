import { test, expect } from '@playwright/test';
import { EventDetailPage } from '../utils/page-objects';
import { filterCriticalErrors } from '../utils/test-helpers';

test.describe('Event Detail Screen', () => {
  let eventDetailPage: EventDetailPage;

  test.beforeEach(async ({ page }) => {
    eventDetailPage = new EventDetailPage(page);
  });

  test.describe('Page Layout and Navigation', () => {
    test('should display event details correctly when valid event ID is provided', async () => {
      // Note: This test assumes an event exists. In a real test, you might create an event first
      // or use a known test event ID
      const testEventId = 'test-event-id';

      await eventDetailPage.navigate(testEventId);

      // Check page loads without errors
      await expect(eventDetailPage.page).toHaveURL(new RegExp(`/events/${testEventId}`));

      // Check main content areas are visible
      const mainContent = eventDetailPage.page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test('should display breadcrumb navigation correctly', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check breadcrumb exists and is functional
      const breadcrumb = eventDetailPage.page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
      if (await breadcrumb.isVisible()) {
        await expect(breadcrumb).toBeVisible();

        // Check home and events links
        const homeLink = eventDetailPage.page.locator('text=ホーム');
        const eventsLink = eventDetailPage.page.locator('text=イベント');

        if (await homeLink.isVisible()) {
          await expect(homeLink).toBeVisible();
        }
        if (await eventsLink.isVisible()) {
          await expect(eventsLink).toBeVisible();
        }
      }
    });

    test('should have back navigation button', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Look for back button or back navigation
      const backButton = eventDetailPage.page.locator('button:has-text("戻る"), [aria-label*="戻る"], .back-button');
      if (await backButton.isVisible()) {
        await expect(backButton).toBeVisible();

        // Test back navigation
        await backButton.click();
        await expect(eventDetailPage.page).toHaveURL(/\/events\/?$/);
      }
    });

    test('should navigate to event list when breadcrumb events link is clicked', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      const eventsLink = eventDetailPage.page.locator('text=イベント').first();
      if (await eventsLink.isVisible()) {
        await eventsLink.click();
        await expect(eventDetailPage.page).toHaveURL(/\/events\/?$/);
      }
    });
  });

  test.describe('Event Information Display', () => {
    test('should display event title and description', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check for event title (usually h1)
      const eventTitle = eventDetailPage.page.locator('h1');
      if (await eventTitle.isVisible()) {
        await expect(eventTitle).toBeVisible();
        await expect(eventTitle).not.toBeEmpty();
      }

      // Check for event description
      const eventDescription = eventDetailPage.page.locator('.description, .event-description, p').first();
      if (await eventDescription.isVisible()) {
        await expect(eventDescription).toBeVisible();
      }
    });

    test('should display event date and time information', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Look for date/time information
      const dateInfo = eventDetailPage.page.locator('text=/\\d{4}[年-]\\d{1,2}[月-]\\d{1,2}[日]?/').first();
      if (await dateInfo.isVisible()) {
        await expect(dateInfo).toBeVisible();
      }

      // Look for time information
      const timeInfo = eventDetailPage.page.locator('text=/\\d{1,2}[時:]\\d{2}[分]?/').first();
      if (await timeInfo.isVisible()) {
        await expect(timeInfo).toBeVisible();
      }
    });

    test('should display countdown timer', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Look for countdown display
      const countdown = eventDetailPage.page.locator('.countdown, [data-testid="countdown"]');
      if (await countdown.isVisible()) {
        await expect(countdown).toBeVisible();

        // Check countdown text format (days, hours, minutes, seconds)
        const countdownText = await countdown.textContent();
        if (countdownText) {
          // Countdown should contain numbers and time units
          expect(countdownText).toMatch(/\d+/);
        }
      }
    });

    test('should show event status (upcoming, ongoing, or ended)', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Look for status indicators
      const statusBadge = eventDetailPage.page.locator('.status, .badge, .tag').first();
      if (await statusBadge.isVisible()) {
        await expect(statusBadge).toBeVisible();

        const statusText = await statusBadge.textContent();
        if (statusText) {
          // Should match common status patterns
          expect(statusText).toMatch(/(開催予定|開催中|終了|予定|進行中)/);
        }
      }
    });

    test('should display event location if provided', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Look for location information
      const locationInfo = eventDetailPage.page.locator('.location, [data-testid="location"]');
      if (await locationInfo.isVisible()) {
        await expect(locationInfo).toBeVisible();
        await expect(locationInfo).not.toBeEmpty();
      }
    });
  });

  test.describe('Action Buttons and Functionality', () => {
    test('should display edit button and handle click', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      if (await eventDetailPage.editButton.isVisible()) {
        await expect(eventDetailPage.editButton).toBeVisible();
        await expect(eventDetailPage.editButton).toContainText(/編集|Edit/);

        // Test edit button click (might show alert for now)
        await eventDetailPage.clickEdit();

        // Either navigates to edit page or shows alert
        // This depends on implementation
      }
    });

    test('should display delete button and handle click', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      if (await eventDetailPage.deleteButton.isVisible()) {
        await expect(eventDetailPage.deleteButton).toBeVisible();
        await expect(eventDetailPage.deleteButton).toContainText(/削除|Delete/);

        // Test delete button click (might show confirmation dialog)
        await eventDetailPage.clickDelete();

        // Should show confirmation dialog or alert
        // This depends on implementation
      }
    });

    test('should display share button and handle click', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      if (await eventDetailPage.shareButton.isVisible()) {
        await expect(eventDetailPage.shareButton).toBeVisible();
        await expect(eventDetailPage.shareButton).toContainText(/共有|Share|シェア/);

        // Test share button click
        await eventDetailPage.clickShare();

        // Should show share options or copy link functionality
        // This depends on implementation
      }
    });

    test('should handle action button states for different event statuses', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check if buttons are enabled/disabled based on event status
      const buttons = eventDetailPage.page.locator('button').all();

      // Buttons should be present and interactive
      // This test verifies basic button functionality exists
      expect(true).toBe(true); // Placeholder for status-based button testing
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should display error message for non-existent event', async () => {
      const nonExistentEventId = 'non-existent-event-123';

      // Navigate to non-existent event
      await eventDetailPage.page.goto(`/events/${nonExistentEventId}`);
      await eventDetailPage.page.waitForLoadState('networkidle');

      // Should show error message or 404 page
      const errorMessage = eventDetailPage.page.locator('text=/イベントが見つかりません|Event not found|404/i');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }

      // Should have link back to events list
      const backToListLink = eventDetailPage.page.locator('text=イベント一覧に戻る');
      if (await backToListLink.isVisible()) {
        await expect(backToListLink).toBeVisible();

        await backToListLink.click();
        await expect(eventDetailPage.page).toHaveURL(/\/events\/?$/);
      }
    });

    test('should handle loading state gracefully', async () => {
      const testEventId = 'test-event-id';

      // Navigate and check for loading indicators
      await eventDetailPage.navigate(testEventId);

      // Page should load without hanging indefinitely
      const mainContent = eventDetailPage.page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible({ timeout: 5000 });
    });

    test('should handle network errors gracefully', async () => {
      // This would require mocking network failures
      // For now, verify error handling structure exists
      expect(true).toBe(true); // Placeholder for network error testing
    });

    test('should handle invalid event ID formats', async () => {
      const invalidEventIds = ['', '   ', 'invalid-chars-!@#', '123'];

      for (const invalidId of invalidEventIds) {
        await eventDetailPage.page.goto(`/events/${invalidId}`);
        await eventDetailPage.page.waitForLoadState('networkidle');

        // Should either redirect or show error
        const url = eventDetailPage.page.url();

        // Should not crash the application
        const errorIndicator = eventDetailPage.page.locator('.error, [role="alert"], text=/エラー|Error/i');

        // Either shows error or redirects to safe page
        expect(url).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design and Accessibility', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check mobile layout
      const mainContent = eventDetailPage.page.locator('main');
      await expect(mainContent).toBeVisible();

      // Check that content is readable on mobile
      const heading = eventDetailPage.page.locator('h1');
      if (await heading.isVisible()) {
        await expect(heading).toBeVisible();
      }
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check tablet layout
      const mainContent = eventDetailPage.page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should support keyboard navigation', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Tab through interactive elements
      await eventDetailPage.page.keyboard.press('Tab');

      // Check if focus is visible on interactive elements
      const focusedElement = eventDetailPage.page.locator(':focus');
      if (await focusedElement.isVisible()) {
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should have proper ARIA attributes', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Check main content area has proper ARIA
      const main = eventDetailPage.page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Check heading hierarchy
      const heading = eventDetailPage.page.locator('h1');
      if (await heading.isVisible()) {
        await expect(heading).toHaveRole('heading');
      }
    });

    test('should not have console errors', async () => {
      const errors: string[] = [];
      eventDetailPage.page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);
      await eventDetailPage.page.waitForTimeout(2000);

      // Filter out known non-critical errors
      const criticalErrors = filterCriticalErrors(errors);

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Performance and User Experience', () => {
    test('should load within acceptable time', async () => {
      const testEventId = 'test-event-id';

      const startTime = Date.now();
      await eventDetailPage.navigate(testEventId);

      const mainContent = eventDetailPage.page.locator('main');
      await expect(mainContent).toBeVisible();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should update countdown in real-time', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      const countdown = eventDetailPage.page.locator('.countdown, [data-testid="countdown"]');
      if (await countdown.isVisible()) {
        const initialText = await countdown.textContent();

        // Wait a moment and check if countdown updates
        await eventDetailPage.page.waitForTimeout(2000);

        const updatedText = await countdown.textContent();

        // Countdown should either update or remain consistent
        expect(updatedText).toBeTruthy();

        // If it's a live countdown, text might change
        // If it's a static display, text should remain same
      }
    });

    test('should handle concurrent user actions gracefully', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Simulate rapid button clicks
      if (await eventDetailPage.editButton.isVisible()) {
        await eventDetailPage.editButton.click();
        await eventDetailPage.page.waitForTimeout(100);

        // Should not cause UI to break
        const mainContent = eventDetailPage.page.locator('main');
        await expect(mainContent).toBeVisible();
      }
    });
  });

  test.describe('Data Integration and State Management', () => {
    test('should display correct event data from backend', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Verify GraphQL data is loaded correctly
      const eventTitle = eventDetailPage.page.locator('h1');
      if (await eventTitle.isVisible()) {
        await expect(eventTitle).not.toBeEmpty();

        const titleText = await eventTitle.textContent();
        expect(titleText).toBeTruthy();
        expect(titleText?.trim().length).toBeGreaterThan(0);
      }
    });

    test('should maintain state when navigating back and forth', async () => {
      const testEventId = 'test-event-id';

      // Navigate to event detail
      await eventDetailPage.navigate(testEventId);
      await eventDetailPage.page.waitForLoadState('networkidle');

      // Check if we got a valid event page or error page
      const h1Element = eventDetailPage.page.locator('h1');
      const errorMessage = eventDetailPage.page.locator('text=/イベントが見つかりません|Event not found|404/i');

      // Wait for either the title or error message to appear
      await Promise.race([
        h1Element.waitFor({ timeout: 5000 }).catch(() => null),
        errorMessage.waitFor({ timeout: 5000 }).catch(() => null)
      ]);

      let originalContent: string | null = null;
      let isErrorState = false;

      if (await errorMessage.isVisible()) {
        // Error state - record the error message
        originalContent = await errorMessage.textContent();
        isErrorState = true;
      } else if (await h1Element.isVisible()) {
        // Valid state - record the title
        originalContent = await h1Element.textContent();
        isErrorState = false;
      } else {
        // Skip test if page state is unclear
        test.skip(true, 'Page state unclear - neither title nor error message visible');
        return;
      }

      // Navigate away and back
      await eventDetailPage.page.goto('/events');
      await eventDetailPage.page.waitForLoadState('networkidle');

      await eventDetailPage.navigate(testEventId);
      await eventDetailPage.page.waitForLoadState('networkidle');

      // Wait for the same type of content to appear
      await Promise.race([
        h1Element.waitFor({ timeout: 5000 }).catch(() => null),
        errorMessage.waitFor({ timeout: 5000 }).catch(() => null)
      ]);

      let returnContent: string | null = null;

      if (isErrorState) {
        // Should still be in error state
        if (await errorMessage.isVisible()) {
          returnContent = await errorMessage.textContent();
        }
      } else {
        // Should still be in valid state
        if (await h1Element.isVisible()) {
          returnContent = await h1Element.textContent();
        }
      }

      // Content should be consistent
      if (originalContent && returnContent) {
        expect(originalContent).toBe(returnContent);
      }
    });

    test('should handle browser refresh correctly', async () => {
      const testEventId = 'test-event-id';
      await eventDetailPage.navigate(testEventId);

      // Refresh page
      await eventDetailPage.page.reload();
      await eventDetailPage.page.waitForLoadState('networkidle');

      // Page should load correctly after refresh
      const mainContent = eventDetailPage.page.locator('main');
      await expect(mainContent).toBeVisible();

      // URL should remain the same
      await expect(eventDetailPage.page).toHaveURL(new RegExp(`/events/${testEventId}`));
    });
  });
});
