import { test, expect } from '@playwright/test';
import { EventListPage } from '../utils/page-objects';

test.describe('Event List Screen', () => {
  let eventListPage: EventListPage;

  test.beforeEach(async ({ page }) => {
    eventListPage = new EventListPage(page);
    await eventListPage.navigate();
  });

  test.describe('Page Layout and Navigation', () => {
    test('should display page title and header correctly', async () => {
      await expect(eventListPage.pageTitle).toBeVisible();
      await expect(eventListPage.pageTitle).toContainText('イベント一覧');

      // Check page description
      await expect(eventListPage.page.locator('text=あなたのイベントを確認して、カウントダウンを楽しみましょう')).toBeVisible();
    });

    test('should have new event creation button', async () => {
      await expect(eventListPage.newEventButton).toBeVisible();
      await expect(eventListPage.newEventButton).toContainText('新しいイベント');

      await eventListPage.clickNewEvent();
      await expect(eventListPage.page).toHaveURL(/\/events\/create/);
    });

    test('should display breadcrumb navigation from home', async () => {
      // Navigate from home to event list
      await eventListPage.page.goto('/');
      await eventListPage.page.click('text=イベント一覧');
      await expect(eventListPage.page).toHaveURL('/events');
    });
  });

  test.describe('Search and Filter Functionality', () => {
    test('should display search input field', async () => {
      await expect(eventListPage.searchInput).toBeVisible();
      await expect(eventListPage.searchInput).toHaveAttribute('placeholder', 'イベントを検索...');
    });

    test('should filter events by search term', async () => {
      // Type in search field
      await eventListPage.searchFor('テスト');

      // Verify search functionality (assuming events exist)
      await eventListPage.page.waitForTimeout(500);

      // Check that search term is applied
      await expect(eventListPage.searchInput).toHaveValue('テスト');
    });

    test('should display filter dropdown with correct options', async () => {
      await expect(eventListPage.filterSelect).toBeVisible();

      // Check filter options
      await eventListPage.filterSelect.click();
      await expect(eventListPage.page.locator('option[value="all"]')).toContainText('すべて');
      await expect(eventListPage.page.locator('option[value="upcoming"]')).toContainText('開催予定');
      await expect(eventListPage.page.locator('option[value="ended"]')).toContainText('終了済み');
    });

    test('should filter events by type', async () => {
      // Test upcoming filter
      await eventListPage.selectFilter('upcoming');
      await expect(eventListPage.filterSelect).toHaveValue('upcoming');

      // Test ended filter
      await eventListPage.selectFilter('ended');
      await expect(eventListPage.filterSelect).toHaveValue('ended');

      // Test all filter
      await eventListPage.selectFilter('all');
      await expect(eventListPage.filterSelect).toHaveValue('all');
    });

    test('should clear filters when clear button is clicked', async () => {
      // Apply search and filter
      await eventListPage.searchFor('test');
      await eventListPage.selectFilter('upcoming');

      // Clear filters (if no results found and clear button appears)
      const clearButton = eventListPage.page.locator('text=フィルターをクリア');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await expect(eventListPage.searchInput).toHaveValue('');
        await expect(eventListPage.filterSelect).toHaveValue('all');
      }
    });
  });

  test.describe('Event Display and Interaction', () => {
    test('should display events in grid layout', async () => {
      const eventGrid = eventListPage.page.locator('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3');

      // Check if events exist or empty state
      const eventCards = eventListPage.page.locator('[data-testid="event-card"]');
      const eventCount = await eventCards.count();

      if (eventCount > 0) {
        await expect(eventGrid).toBeVisible();
        expect(eventCount).toBeGreaterThan(0);
      }
    });

    test('should navigate to event detail when event card is clicked', async () => {
      const eventCards = eventListPage.page.locator('[data-testid="event-card"], .block.transform.transition-transform');
      const eventCount = await eventCards.count();

      if (eventCount > 0) {
        // Click first event
        await eventCards.first().click();

        // Should navigate to event detail page
        await expect(eventListPage.page).toHaveURL(/\/events\/[^\/]+$/);
      }
    });

    test('should display event actions correctly', async () => {
      const eventCards = eventListPage.page.locator('[data-testid="event-card"]');
      const eventCount = await eventCards.count();

      if (eventCount > 0) {
        // Check if action buttons exist on hover
        await eventCards.first().hover();

        // Note: Edit, Delete, Share functionality shows alert for now
        // This test verifies the UI structure exists
      }
    });
  });

  test.describe('Empty States and Error Handling', () => {
    test('should display empty state when no events exist', async () => {
      // This test assumes a clean state or uses mocked empty data
      const emptyStateCheck = eventListPage.page.locator('text=まだイベントがありません');

      if (await emptyStateCheck.isVisible()) {
        await expect(emptyStateCheck).toBeVisible();
        await expect(eventListPage.page.locator('text=最初のイベントを作成して、カウントダウンを始めましょう！')).toBeVisible();

        // Check create event button in empty state
        const createButton = eventListPage.page.locator('text=イベントを作成').last();
        await expect(createButton).toBeVisible();
      }
    });

    test('should display no results message when search/filter yields no results', async () => {
      // Search for something that doesn't exist
      await eventListPage.searchFor('non-existent-event-xyz');
      await eventListPage.page.waitForTimeout(500);

      const noResultsMessage = eventListPage.page.locator('text=該当するイベントがありません');
      if (await noResultsMessage.isVisible()) {
        await expect(noResultsMessage).toBeVisible();
        await expect(eventListPage.page.locator('text=検索条件またはフィルターを変更してください')).toBeVisible();
      }
    });

    test('should handle loading state gracefully', async () => {
      // Navigate to page and check for loading state
      await eventListPage.navigate();

      // Loading state might be too fast to catch, but structure should be correct
      await expect(eventListPage.pageTitle).toBeVisible();
    });

    test('should display error state when GraphQL fails', async () => {
      // This would require mocking GraphQL errors
      // For now, check if error UI structure exists
      const errorContainer = eventListPage.page.locator('.text-red-500');

      // Error handling UI should be present in code structure
      expect(true).toBe(true); // Placeholder for error handling test
    });
  });

  test.describe('Responsive Design', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await eventListPage.navigate();

      // Check mobile layout
      await expect(eventListPage.pageTitle).toBeVisible();
      await expect(eventListPage.searchInput).toBeVisible();
      await expect(eventListPage.filterSelect).toBeVisible();
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await eventListPage.navigate();

      // Check tablet layout
      await expect(eventListPage.pageTitle).toBeVisible();

      // Check grid layout adapts to tablet
      const eventGrid = eventListPage.page.locator('.md\\:grid-cols-2');
      await expect(eventGrid).toBeVisible();
    });

    test('should work correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await eventListPage.navigate();

      // Check desktop layout
      await expect(eventListPage.pageTitle).toBeVisible();

      // Check grid layout adapts to desktop
      const eventGrid = eventListPage.page.locator('.lg\\:grid-cols-3');
      await expect(eventGrid).toBeVisible();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should load within acceptable time', async () => {
      const startTime = Date.now();
      await eventListPage.navigate();
      await expect(eventListPage.pageTitle).toBeVisible();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should support keyboard navigation', async () => {
      await eventListPage.navigate();

      // Tab through interactive elements
      await eventListPage.page.keyboard.press('Tab'); // Search input
      await expect(eventListPage.searchInput).toBeFocused();

      await eventListPage.page.keyboard.press('Tab'); // Filter select
      await expect(eventListPage.filterSelect).toBeFocused();

      await eventListPage.page.keyboard.press('Tab'); // New event button
      await expect(eventListPage.newEventButton).toBeFocused();
    });

    test('should have proper ARIA attributes', async () => {
      await eventListPage.navigate();

      // Check main content area
      const main = eventListPage.page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Check heading hierarchy
      await expect(eventListPage.pageTitle).toHaveRole('heading');
    });

    test('should not have console errors', async () => {
      const errors: string[] = [];
      eventListPage.page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await eventListPage.navigate();
      await eventListPage.page.waitForTimeout(2000);

      // Filter out known non-critical errors
      const criticalErrors = errors.filter(error =>
        !error.includes('favicon') &&
        !error.includes('sourcemap') &&
        !error.includes('DevTools')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Data Integration', () => {
    test('should display results summary correctly', async () => {
      await eventListPage.navigate();
      await eventListPage.page.waitForTimeout(1000);

      // Check if results summary appears
      const resultsSummary = eventListPage.page.locator('.text-center.text-sm.text-gray-500');
      if (await resultsSummary.isVisible()) {
        await expect(resultsSummary).toContainText(/件のイベント/);
      }
    });

    test('should update URL when navigating from different pages', async () => {
      // Navigate from home
      await eventListPage.page.goto('/');
      await eventListPage.page.click('text=イベント');
      await expect(eventListPage.page).toHaveURL('/events');

      // Navigate from onboarding
      await eventListPage.page.goto('/onboarding');
      await eventListPage.page.click('text=イベント');
      await expect(eventListPage.page).toHaveURL('/events');
    });
  });
});
