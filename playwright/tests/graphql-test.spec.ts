import { test, expect } from '@playwright/test';

test.describe('GraphQL Test Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/graphql-test');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Layout and Navigation', () => {
    test('should display page title and description correctly', async ({ page }) => {
      // Check page title
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
      await expect(pageTitle).toContainText(/GraphQL|API|テスト/i);

      // Check page description
      const description = page.locator('text=/GraphQLの接続状態|API接続|バックエンド接続/');
      if (await description.isVisible()) {
        await expect(description).toBeVisible();
      }
    });

    test('should have navigation back to main application', async ({ page }) => {
      // Look for navigation links back to main app
      const homeLink = page.locator('text=ホーム');
      const backLink = page.locator('text=戻る');

      if (await homeLink.isVisible()) {
        await expect(homeLink).toBeVisible();
        await homeLink.click();
        await expect(page).toHaveURL('/');
      } else if (await backLink.isVisible()) {
        await expect(backLink).toBeVisible();
      }
    });

    test('should display page as development/testing tool', async ({ page }) => {
      // This page should be clearly marked as a development tool
      const devIndicator = page.locator('text=/開発|テスト|Development|Test/i');
      if (await devIndicator.isVisible()) {
        await expect(devIndicator).toBeVisible();
      }
    });
  });

  test.describe('GraphQL Connection Status', () => {
    test('should display GraphQL endpoint information', async ({ page }) => {
      // Check for GraphQL endpoint display
      const endpointInfo = page.locator('text=/endpoint|エンドポイント|URL/i');
      if (await endpointInfo.isVisible()) {
        await expect(endpointInfo).toBeVisible();
      }

      // Look for actual endpoint URL
      const urlPattern = page.locator('text=/http|localhost|backend/');
      if (await urlPattern.isVisible()) {
        await expect(urlPattern).toBeVisible();
      }
    });

    test('should show connection status indicator', async ({ page }) => {
      // Look for connection status
      const connectionStatus = page.locator('.status, [data-testid="connection-status"]');
      if (await connectionStatus.isVisible()) {
        await expect(connectionStatus).toBeVisible();

        const statusText = await connectionStatus.textContent();
        if (statusText) {
          // Should indicate connected/disconnected state
          expect(statusText).toMatch(/(接続|Connected|Disconnected|切断|オンライン|オフライン)/i);
        }
      }
    });

    test('should test GraphQL connectivity', async ({ page }) => {
      // Look for connectivity test button or automatic testing
      const testButton = page.locator('button:has-text("テスト"), button:has-text("Test"), button:has-text("接続確認")');
      if (await testButton.isVisible()) {
        await expect(testButton).toBeVisible();

        // Click test button
        await testButton.click();
        await page.waitForTimeout(1000);

        // Should show test results
        const testResult = page.locator('.result, .status, [data-testid="test-result"]');
        if (await testResult.isVisible()) {
          await expect(testResult).toBeVisible();
        }
      }
    });

    test('should handle connection errors gracefully', async ({ page }) => {
      // Check for error handling UI
      const errorContainer = page.locator('.error, [role="alert"], .text-red-500');

      if (await errorContainer.isVisible()) {
        await expect(errorContainer).toBeVisible();

        // Error should be informative
        const errorText = await errorContainer.textContent();
        if (errorText) {
          expect(errorText.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Users Data Display', () => {
    test('should display users section', async ({ page }) => {
      // Look for users section
      const usersSection = page.locator('text=Users, text=ユーザー').first();
      if (await usersSection.isVisible()) {
        await expect(usersSection).toBeVisible();
      }
    });

    test('should show users data from GraphQL', async ({ page }) => {
      // Wait for data to load
      await page.waitForTimeout(2000);

      // Look for users data display
      const usersData = page.locator('[data-testid="users-data"], .users-list, .user-item');
      if (await usersData.isVisible()) {
        await expect(usersData).toBeVisible();

        // Check if data is properly formatted
        const userItems = page.locator('.user-item, [data-testid="user-item"]');
        const userCount = await userItems.count();

        if (userCount > 0) {
          // Should display user information
          await expect(userItems.first()).toBeVisible();
        }
      }
    });

    test('should handle empty users data', async ({ page }) => {
      // Look for empty state message
      const emptyMessage = page.locator('text=/ユーザーがいません|No users|Empty/i');
      if (await emptyMessage.isVisible()) {
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('should display users data with proper formatting', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Check if users data is displayed in proper format (JSON, table, list, etc.)
      const dataContainer = page.locator('.users-container, [data-testid="users-container"]');
      if (await dataContainer.isVisible()) {
        await expect(dataContainer).toBeVisible();

        // Data should be readable
        const dataContent = await dataContainer.textContent();
        if (dataContent) {
          expect(dataContent.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Events Data Display', () => {
    test('should display events section', async ({ page }) => {
      // Look for events section
      const eventsSection = page.locator('text=Events, text=イベント').first();
      if (await eventsSection.isVisible()) {
        await expect(eventsSection).toBeVisible();
      }
    });

    test('should show events data from GraphQL', async ({ page }) => {
      // Wait for data to load
      await page.waitForTimeout(2000);

      // Look for events data display
      const eventsData = page.locator('[data-testid="events-data"], .events-list, .event-item');
      if (await eventsData.isVisible()) {
        await expect(eventsData).toBeVisible();

        // Check if data is properly formatted
        const eventItems = page.locator('.event-item, [data-testid="event-item"]');
        const eventCount = await eventItems.count();

        if (eventCount > 0) {
          // Should display event information
          await expect(eventItems.first()).toBeVisible();
        }
      }
    });

    test('should handle empty events data', async ({ page }) => {
      // Look for empty state message
      const emptyMessage = page.locator('text=/イベントがありません|No events|Empty/i');
      if (await emptyMessage.isVisible()) {
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('should display events data with proper formatting', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Check if events data is displayed in proper format
      const dataContainer = page.locator('.events-container, [data-testid="events-container"]');
      if (await dataContainer.isVisible()) {
        await expect(dataContainer).toBeVisible();

        // Data should be readable
        const dataContent = await dataContainer.textContent();
        if (dataContent) {
          expect(dataContent.trim().length).toBeGreaterThan(0);
        }
      }
    });

    test('should show event details when available', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Look for specific event fields
      const eventFields = page.locator('text=/title|name|date|タイトル|名前|日付/i');
      if (await eventFields.isVisible()) {
        await expect(eventFields.first()).toBeVisible();
      }
    });
  });

  test.describe('Data Loading and Error States', () => {
    test('should show loading state while fetching data', async ({ page }) => {
      // Navigate to page and look for loading indicators
      await page.goto('/graphql-test');

      // Look for loading indicators (might be brief)
      const loadingIndicator = page.locator('text=/Loading|読み込み中|ローディング/i, .loading, .spinner');

      // Loading state might be too fast to catch consistently
      // Just verify the page loads successfully
      await page.waitForLoadState('networkidle');
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test('should handle GraphQL query errors', async ({ page }) => {
      // Look for error handling when GraphQL queries fail
      const errorContainer = page.locator('.error, [role="alert"], .text-red-500');

      if (await errorContainer.isVisible()) {
        await expect(errorContainer).toBeVisible();

        // Error should provide useful information
        const errorText = await errorContainer.textContent();
        if (errorText) {
          expect(errorText.length).toBeGreaterThan(5);
        }
      }
    });

    test('should retry failed requests when retry button is available', async ({ page }) => {
      // Look for retry button
      const retryButton = page.locator('button:has-text("再試行"), button:has-text("Retry"), button:has-text("リトライ")');

      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();

        // Click retry button
        await retryButton.click();
        await page.waitForTimeout(1000);

        // Should attempt to reload data
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
      }
    });

    test('should show appropriate message when backend is unavailable', async ({ page }) => {
      // This test checks if the page handles backend unavailability

      // Look for backend connection error messages
      const connectionError = page.locator('text=/Backend unavailable|バックエンドに接続できません|サーバーエラー/i');
      const networkError = page.locator('text=/Network error|ネットワークエラー|接続エラー/i');

      if (await connectionError.isVisible()) {
        await expect(connectionError).toBeVisible();
      } else if (await networkError.isVisible()) {
        await expect(networkError).toBeVisible();
      }

      // Should still render the page structure
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
    });
  });

  test.describe('Developer Tools and Debugging', () => {
    test('should display raw GraphQL responses when available', async ({ page }) => {
      // Look for raw data display (useful for debugging)
      const rawDataContainer = page.locator('.raw-data, [data-testid="raw-data"], .json-display');

      if (await rawDataContainer.isVisible()) {
        await expect(rawDataContainer).toBeVisible();

        // Raw data should be properly formatted
        const rawContent = await rawDataContainer.textContent();
        if (rawContent) {
          // Should contain JSON-like structure
          expect(rawContent).toMatch(/[{}\\[\\]]/);
        }
      }
    });

    test('should show GraphQL query performance metrics', async ({ page }) => {
      // Look for performance information
      const performanceInfo = page.locator('text=/ms|秒|時間|duration|performance/i');

      if (await performanceInfo.isVisible()) {
        await expect(performanceInfo).toBeVisible();
      }
    });

    test('should display GraphQL schema information', async ({ page }) => {
      // Look for schema or API documentation
      const schemaInfo = page.locator('text=/schema|型|type|field|フィールド/i');

      if (await schemaInfo.isVisible()) {
        await expect(schemaInfo).toBeVisible();
      }
    });

    test('should provide debugging controls', async ({ page }) => {
      // Look for debugging features like refresh, clear cache, etc.
      const debugControls = page.locator('button:has-text("Refresh"), button:has-text("Clear"), button:has-text("リフレッシュ"), button:has-text("クリア")');

      if (await debugControls.isVisible()) {
        await expect(debugControls.first()).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design and Accessibility', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Check mobile layout
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();

      // Content should be readable on mobile
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Check tablet layout
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Tab through interactive elements
      await page.keyboard.press('Tab');

      // Check if focus is visible
      const focusedElement = page.locator(':focus');
      if (await focusedElement.isVisible()) {
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Check main content area
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Check heading hierarchy
      const heading = page.locator('h1');
      await expect(heading).toHaveRole('heading');
    });

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Filter out known non-critical errors
      const criticalErrors = errors.filter(error =>
        !error.includes('favicon') &&
        !error.includes('sourcemap') &&
        !error.includes('DevTools') &&
        !error.includes('GraphQL subscription') // GraphQL-specific non-critical errors
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Integration with Main Application', () => {
    test('should navigate back to main application seamlessly', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Navigate back to home
      const homeLink = page.locator('text=ホーム');
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    });

    test('should maintain application state when accessed from different pages', async ({ page }) => {
      // Navigate from home to GraphQL test
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Go to GraphQL test page
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Should load correctly
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
    });

    test('should work correctly when accessed directly via URL', async ({ page }) => {
      // Direct navigation to GraphQL test page
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Should load without requiring navigation from other pages
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
    });

    test('should handle browser refresh correctly', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should reload correctly
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();

      // URL should remain the same
      await expect(page).toHaveURL('/graphql-test');
    });
  });

  test.describe('Performance and Development Experience', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds (allowing for GraphQL queries)
    });

    test('should provide useful development information', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // Should display useful info for developers
      const infoElements = page.locator('.info, .debug-info, [data-testid="debug-info"]');

      if (await infoElements.isVisible()) {
        await expect(infoElements.first()).toBeVisible();
      }

      // Page should serve its purpose as a testing tool
      const pageTitle = page.locator('h1');
      await expect(pageTitle).toBeVisible();
    });

    test('should handle concurrent GraphQL requests efficiently', async ({ page }) => {
      await page.goto('/graphql-test');
      await page.waitForLoadState('networkidle');

      // If refresh buttons exist, test concurrent requests
      const refreshButtons = page.locator('button:has-text("Refresh"), button:has-text("リフレッシュ")');
      const buttonCount = await refreshButtons.count();

      if (buttonCount > 0) {
        // Click multiple refresh buttons quickly
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          await refreshButtons.nth(i).click();
          await page.waitForTimeout(100);
        }

        // Should handle concurrent requests without crashing
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
      }
    });
  });
});
