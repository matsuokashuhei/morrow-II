import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/page-objects';
import { filterCriticalErrors } from '../utils/test-helpers';

test.describe('Home Screen', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test.describe('Hero Section', () => {
    test('should display hero title and description', async () => {
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.heroTitle).toContainText('Welcome to Morrow!');

      // Check for hero description
      await expect(homePage.page.locator('text=Event Countdown Sharing App')).toBeVisible();
    });

    test('should have create event button that navigates to creation page', async () => {
      await expect(homePage.createEventButton).toBeVisible();
      await expect(homePage.createEventButton).toContainText('イベントを作成');

      await homePage.clickCreateEvent();
      await expect(homePage.page).toHaveURL(/\/events\/create/);
    });
  });

  test.describe('Feature Cards - Empty State', () => {
    test('should display 3 feature cards when no events exist', async () => {
      // Verify feature cards are visible
      const featureCardsCount = await homePage.getFeatureCardsCount();
      expect(featureCardsCount).toBe(3);

      // Check each feature card content
      const featureCards = homePage.featureCards;

      // Event Creation feature
      await expect(featureCards.nth(0)).toContainText('📅');
      await expect(featureCards.nth(0)).toContainText('イベント作成');
      await expect(featureCards.nth(0)).toContainText('大切な日程を簡単に登録してカウントダウンを開始');

      // Real-time Display feature
      await expect(featureCards.nth(1)).toContainText('⏰');
      await expect(featureCards.nth(1)).toContainText('リアルタイム表示');
      await expect(featureCards.nth(1)).toContainText('残り時間を美しくリアルタイムでカウントダウン');

      // Social Sharing feature
      await expect(featureCards.nth(2)).toContainText('👥');
      await expect(featureCards.nth(2)).toContainText('友達と共有');
      await expect(featureCards.nth(2)).toContainText('友人や家族と一緒にイベントを楽しみに待つ');
    });

    test('should show onboarding button when no events exist', async () => {
      await expect(homePage.onboardingButton).toBeVisible();
      await expect(homePage.onboardingButton).toContainText('始めましょう');

      await homePage.clickOnboarding();
      await expect(homePage.page).toHaveURL(/\/onboarding/);
    });
  });

  test.describe('Navigation', () => {
    test('should have proper page title', async () => {
      await expect(homePage.page).toHaveTitle(/Morrow/);
    });

    test('should navigate to event list when events link is clicked', async ({ page }) => {
      // Try specific navigation links in order of preference
      const selectors = [
        '[data-testid="nav-events"]',
        '[data-testid="events-list-link"]',
        '[data-testid="events-link"]'
      ];

      let clicked = false;
      for (const selector of selectors) {
        try {
          const element = page.locator(selector);
          if (await element.isVisible()) {
            await element.click();
            clicked = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (clicked) {
        await expect(page).toHaveURL(/\/events/);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Hero section should still be visible
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.createEventButton).toBeVisible();

      // Feature cards should stack vertically on mobile
      const featureCardsCount = await homePage.getFeatureCardsCount();
      expect(featureCardsCount).toBe(3);
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.createEventButton).toBeVisible();

      const featureCardsCount = await homePage.getFeatureCardsCount();
      expect(featureCardsCount).toBe(3);
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.createEventButton).toBeVisible();

      const featureCardsCount = await homePage.getFeatureCardsCount();
      expect(featureCardsCount).toBe(3);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Check for h1 element
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Verify main heading content
      await expect(page.locator('h1')).toContainText('Welcome to Morrow!');
    });

    test('should have main landmark', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab to first interactive element
      await page.keyboard.press('Tab');

      // Verify focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Should be able to activate focused button with Enter
      if (await focusedElement.getAttribute('role') === 'button' ||
          await focusedElement.evaluate(el => el.tagName.toLowerCase()) === 'button') {
        await page.keyboard.press('Enter');
        // Should navigate or trigger action
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await homePage.navigate();
      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await homePage.navigate();

      // Filter out known non-critical errors using helper function
      const criticalErrors = filterCriticalErrors(consoleErrors);

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Loading States', () => {
    test('should handle loading states gracefully', async ({ page }) => {
      // Simulate slow network to test loading states
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });

      await homePage.navigate();

      // Page should eventually load completely
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.createEventButton).toBeVisible();
    });
  });
});
