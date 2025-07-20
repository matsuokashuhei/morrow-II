import { test, expect } from '@playwright/test';
import { OnboardingPage, HomePage } from '../utils/page-objects';

test.describe('Onboarding Flow', () => {
  let onboardingPage: OnboardingPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    onboardingPage = new OnboardingPage(page);
    homePage = new HomePage(page);
  });

  test.describe('Onboarding Navigation', () => {
    test('should navigate to onboarding from home page', async () => {
      await homePage.navigate();
      await homePage.clickOnboarding();
      await expect(onboardingPage.page).toHaveURL(/\/onboarding/);
    });

    test('should start onboarding directly', async () => {
      await onboardingPage.navigate();
      await expect(onboardingPage.page).toHaveURL(/\/onboarding/);
    });
  });

  test.describe('4-Step Progress Flow', () => {
    test.beforeEach(async () => {
      await onboardingPage.navigate();
    });

    test('should display progress bar on all steps', async () => {
      await expect(onboardingPage.progressBar).toBeVisible();
    });

    test('should navigate through all 4 steps with Next button', async () => {
      // Step 1: Welcome
      await expect(onboardingPage.page.locator('text=ようこそ')).toBeVisible();
      await expect(onboardingPage.nextButton).toBeVisible();
      await expect(onboardingPage.prevButton).not.toBeVisible(); // No prev on first step

      // Progress to Step 2
      await onboardingPage.clickNext();
      await expect(onboardingPage.page.locator('text=機能紹介')).toBeVisible();
      await expect(onboardingPage.prevButton).toBeVisible();
      await expect(onboardingPage.nextButton).toBeVisible();

      // Progress to Step 3
      await onboardingPage.clickNext();
      await expect(onboardingPage.page.locator('text=利用方法')).toBeVisible();
      await expect(onboardingPage.prevButton).toBeVisible();
      await expect(onboardingPage.nextButton).toBeVisible();

      // Progress to Step 4 (Final)
      await onboardingPage.clickNext();
      await expect(onboardingPage.page.locator('text=準備完了')).toBeVisible();
      await expect(onboardingPage.prevButton).toBeVisible();
      await expect(onboardingPage.nextButton).not.toBeVisible(); // No next on last step
      await expect(onboardingPage.startButton).toBeVisible();
    });

    test('should navigate backward with Previous button', async () => {
      // Navigate to step 3 first
      await onboardingPage.clickNext();
      await onboardingPage.clickNext();
      await onboardingPage.clickNext();

      // Now go back
      await onboardingPage.clickPrev();
      await expect(onboardingPage.page.locator('text=利用方法')).toBeVisible();

      await onboardingPage.clickPrev();
      await expect(onboardingPage.page.locator('text=機能紹介')).toBeVisible();

      await onboardingPage.clickPrev();
      await expect(onboardingPage.page.locator('text=ようこそ')).toBeVisible();
    });

    test('should update progress bar correctly', async ({ page }) => {
      // Check initial progress (Step 1 of 4)
      const progressValue = await onboardingPage.progressBar.getAttribute('aria-valuenow');
      expect(progressValue).toBe('1');

      // Progress through steps and verify progress bar
      await onboardingPage.clickNext();
      const progressValue2 = await onboardingPage.progressBar.getAttribute('aria-valuenow');
      expect(progressValue2).toBe('2');

      await onboardingPage.clickNext();
      const progressValue3 = await onboardingPage.progressBar.getAttribute('aria-valuenow');
      expect(progressValue3).toBe('3');

      await onboardingPage.clickNext();
      const progressValue4 = await onboardingPage.progressBar.getAttribute('aria-valuenow');
      expect(progressValue4).toBe('4');
    });
  });

  test.describe('Onboarding Content', () => {
    test.beforeEach(async () => {
      await onboardingPage.navigate();
    });

    test('should display welcome content on step 1', async ({ page }) => {
      await expect(page.locator('text=ようこそ')).toBeVisible();
      await expect(page.locator('text=Morrowへ')).toBeVisible();
      await expect(page.locator('text=イベントのカウントダウン')).toBeVisible();
    });

    test('should display feature introduction on step 2', async ({ page }) => {
      await onboardingPage.clickNext();

      await expect(page.locator('text=機能紹介')).toBeVisible();
      await expect(page.locator('text=イベント作成')).toBeVisible();
      await expect(page.locator('text=カウントダウン表示')).toBeVisible();
      await expect(page.locator('text=共有機能')).toBeVisible();
    });

    test('should display usage instructions on step 3', async ({ page }) => {
      await onboardingPage.clickNext();
      await onboardingPage.clickNext();

      await expect(page.locator('text=利用方法')).toBeVisible();
      await expect(page.locator('text=簡単')).toBeVisible();
      await expect(page.locator('text=ステップ')).toBeVisible();
    });

    test('should display completion message on step 4', async ({ page }) => {
      await onboardingPage.clickNext();
      await onboardingPage.clickNext();
      await onboardingPage.clickNext();

      await expect(page.locator('text=準備完了')).toBeVisible();
      await expect(page.locator('text=始めましょう')).toBeVisible();
    });
  });

  test.describe('Onboarding Completion', () => {
    test('should navigate to home after clicking Start', async () => {
      await onboardingPage.navigate();
      await onboardingPage.completeFlow();

      // Should be redirected to home page
      await expect(onboardingPage.page).toHaveURL(/\/$/);
      await expect(onboardingPage.page.locator('text=Welcome to Morrow!')).toBeVisible();
    });

    test('should complete onboarding in one action', async () => {
      await onboardingPage.navigate();

      const startTime = Date.now();
      await onboardingPage.completeFlow();
      const completionTime = Date.now() - startTime;

      // Should complete quickly
      expect(completionTime).toBeLessThan(5000);

      // Should be on home page
      await expect(onboardingPage.page).toHaveURL(/\/$/);
    });
  });

  test.describe('Skip Functionality', () => {
    test('should have skip button available', async () => {
      await onboardingPage.navigate();
      await expect(onboardingPage.skipButton).toBeVisible();
    });

    test('should skip to home page when skip is clicked', async () => {
      await onboardingPage.navigate();
      await onboardingPage.clickSkip();

      // Should navigate directly to home
      await expect(onboardingPage.page).toHaveURL(/\/$/);
      await expect(onboardingPage.page.locator('text=Welcome to Morrow!')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await onboardingPage.navigate();

      // Progress bar should be visible
      await expect(onboardingPage.progressBar).toBeVisible();

      // Navigation buttons should be accessible
      await expect(onboardingPage.nextButton).toBeVisible();

      // Complete flow should work
      await onboardingPage.completeFlow();
      await expect(page).toHaveURL(/\/$/);
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await onboardingPage.navigate();

      await expect(onboardingPage.progressBar).toBeVisible();
      await expect(onboardingPage.nextButton).toBeVisible();

      await onboardingPage.completeFlow();
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async () => {
      await onboardingPage.navigate();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Focus on the page first
      await page.focus('body');

      // Find the next button and focus it directly (more reliable than tab sequence)
      const nextButton = page.locator('[data-testid="next-btn"]');
      await nextButton.focus();
      await expect(nextButton).toBeFocused();

      // Enter should activate button
      await page.keyboard.press('Enter');

      // Wait for step transition
      await page.waitForTimeout(500);

      // Should progress to next step
      await expect(page.locator('text=機能紹介')).toBeVisible();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      // Progress bar should have proper ARIA
      await expect(onboardingPage.progressBar).toHaveAttribute('role', 'progressbar');
      await expect(onboardingPage.progressBar).toHaveAttribute('aria-valuenow');
      await expect(onboardingPage.progressBar).toHaveAttribute('aria-valuemax', '4');
    });

    test('should have proper heading structure', async ({ page }) => {
      // Should have main heading
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Animation and Transitions', () => {
    test('should transition smoothly between steps', async ({ page }) => {
      await onboardingPage.navigate();

      // Initial step should be visible
      await expect(page.locator('text=ようこそ')).toBeVisible();

      // Click next and verify transition
      await onboardingPage.clickNext();

      // Wait for transition and verify new content
      await page.waitForTimeout(500);
      await expect(page.locator('text=機能紹介')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle navigation errors gracefully', async ({ page }) => {
      // Test with slow network
      await page.route('/api/**', route => {
        setTimeout(() => route.continue(), 100);
      });

      await onboardingPage.navigate();

      // Should still complete successfully
      await onboardingPage.completeFlow();
      await expect(page).toHaveURL(/\/$/);
    });
  });
});
