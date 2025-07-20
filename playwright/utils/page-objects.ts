import { Page, Locator } from '@playwright/test';
import { selectors } from '../fixtures/test-data';

/**
 * Page Object for Home Screen
 */
export class HomePage {
  readonly page: Page;
  readonly heroTitle: Locator;
  readonly createEventButton: Locator;
  readonly onboardingButton: Locator;
  readonly featureCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.locator(selectors.home.heroTitle);
    this.createEventButton = page.locator(selectors.home.createEventButton);
    this.onboardingButton = page.locator(selectors.home.onboardingButton);
    this.featureCards = page.locator(selectors.home.featureCards);
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async clickCreateEvent() {
    await this.createEventButton.click();
  }

  async clickOnboarding() {
    await this.onboardingButton.click();
  }

  async getFeatureCardsCount() {
    return await this.featureCards.count();
  }
}

/**
 * Page Object for Onboarding Screen
 */
export class OnboardingPage {
  readonly page: Page;
  readonly progressBar: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly skipButton: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.progressBar = page.locator(selectors.onboarding.progressBar);
    this.nextButton = page.locator(selectors.onboarding.nextButton);
    this.prevButton = page.locator(selectors.onboarding.prevButton);
    this.skipButton = page.locator(selectors.onboarding.skipButton);
    this.startButton = page.locator(selectors.onboarding.startButton);
  }

  async navigate() {
    await this.page.goto('/onboarding');
    await this.page.waitForLoadState('networkidle');
  }

  async clickNext() {
    await this.nextButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickPrev() {
    await this.prevButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickSkip() {
    await this.skipButton.click();
  }

  async clickStart() {
    await this.startButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async completeFlow() {
    // Navigate through all steps
    for (let step = 0; step < 3; step++) {
      await this.clickNext();
    }
    await this.clickStart();
  }
}

/**
 * Page Object for Event Creation Screen
 */
export class EventCreationPage {
  readonly page: Page;
  readonly form: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly emojiInput: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly visibilitySelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator(selectors.eventCreation.form);
    this.titleInput = page.locator(selectors.eventCreation.titleInput);
    this.descriptionInput = page.locator(selectors.eventCreation.descriptionInput);
    this.emojiInput = page.locator(selectors.eventCreation.emojiInput);
    this.startTimeInput = page.locator(selectors.eventCreation.startTimeInput);
    this.endTimeInput = page.locator(selectors.eventCreation.endTimeInput);
    this.visibilitySelect = page.locator(selectors.eventCreation.visibilitySelect);
    this.submitButton = page.locator(selectors.eventCreation.submitButton);
    this.cancelButton = page.locator(selectors.eventCreation.cancelButton);
    this.errorMessage = page.locator(selectors.eventCreation.errorMessage);
  }

  async navigate() {
    await this.page.goto('/events/create');
    await this.page.waitForLoadState('networkidle');
    // Wait for page title to be visible to ensure page structure is ready
    await this.page.locator('[data-testid="page-title"]').waitFor({ state: 'visible', timeout: 10000 });
    // Give additional time for React components to render completely, especially with GraphQL mocking
    await this.page.waitForTimeout(3000);
  }

  async fillTitle(title: string) {
    // When GraphQL is mocked, the form might not render immediately
    // Try a more patient approach for tests that mock GraphQL behavior
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Check if the form is visible first
        await this.form.waitFor({ state: 'visible', timeout: 2000 });
        // Then check if the title input is visible and interactable
        await this.titleInput.waitFor({ state: 'visible', timeout: 2000 });
        await this.titleInput.fill(title);
        return; // Success, exit function
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to fill title after ${maxAttempts} attempts. Last error: ${errorMessage}`);
        }
        // Wait a bit before retrying, especially for GraphQL mocking scenarios
        await this.page.waitForTimeout(1000 + (attempts * 500));
        // Try to trigger a re-render by clicking somewhere else and back
        try {
          await this.page.click('body');
          await this.page.waitForTimeout(500);
        } catch (e) {
          // Ignore click errors
        }
      }
    }
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillEmoji(emoji: string) {
    await this.emojiInput.fill(emoji);
  }

  async fillStartTime(dateTime: Date) {
    const dateString = dateTime.toISOString().slice(0, 16);
    await this.startTimeInput.fill(dateString);
  }

  async fillEndTime(dateTime: Date) {
    const dateString = dateTime.toISOString().slice(0, 16);
    await this.endTimeInput.fill(dateString);
  }

  async selectVisibility(visibility: 'public' | 'private') {
    // Handle radio button selection instead of select dropdown
    const visibilityValue = visibility === 'public' ? 'shared' : 'private';
    const radioButton = this.page.locator(`[data-testid="visibility-${visibilityValue}"]`);
    await radioButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  // Field-level error message accessors
  async getTitleErrorMessage() {
    const errorElement = this.page.locator('[data-testid="title-error-message"]');
    return await errorElement.isVisible() ? await errorElement.textContent() : null;
  }

  async hasFieldError(fieldName: string): Promise<boolean> {
    const errorElement = this.page.locator(`[data-testid="${fieldName}-error-message"]`);
    return await errorElement.isVisible();
  }
}

/**
 * Page Object for Event List Screen
 */
export class EventListPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filterSelect: Locator;
  readonly filterAllButton: Locator;
  readonly filterUpcomingButton: Locator;
  readonly filterEndedButton: Locator;
  readonly eventCards: Locator;
  readonly createButton: Locator;
  readonly newEventButton: Locator;
  readonly emptyState: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.searchInput = page.locator(selectors.eventList.searchInput);
    this.filterSelect = page.locator('select').filter({ hasText: /すべて|開催予定|終了済み/ });
    this.filterAllButton = page.locator(selectors.eventList.filterAll);
    this.filterUpcomingButton = page.locator(selectors.eventList.filterUpcoming);
    this.filterEndedButton = page.locator(selectors.eventList.filterEnded);
    this.eventCards = page.locator(selectors.eventList.eventCard);
    this.createButton = page.locator(selectors.eventList.createButton);
    this.newEventButton = page.locator('[data-testid="new-event-btn"]');
    this.emptyState = page.locator(selectors.eventList.emptyState);
    this.clearFiltersButton = page.locator('text=フィルターをクリア');
  }

  async navigate() {
    await this.page.goto('/events');
    await this.page.waitForLoadState('networkidle');
    // Give time for React components to render
    await this.page.waitForTimeout(2000);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(500);
  }

  async searchFor(searchTerm: string) {
    await this.search(searchTerm);
  }

  async selectFilter(filterValue: string) {
    if (this.filterSelect) {
      await this.filterSelect.selectOption(filterValue);
    } else {
      // Fallback to button-based filters
      switch (filterValue) {
        case 'all':
          await this.filterAll();
          break;
        case 'upcoming':
          await this.filterUpcoming();
          break;
        case 'ended':
          await this.filterEnded();
          break;
      }
    }
    await this.page.waitForTimeout(500);
  }

  async filterAll() {
    await this.filterAllButton.click();
    await this.page.waitForTimeout(500);
  }

  async filterUpcoming() {
    await this.filterUpcomingButton.click();
    await this.page.waitForTimeout(500);
  }

  async filterEnded() {
    await this.filterEndedButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickNewEvent() {
    if (await this.newEventButton.isVisible()) {
      await this.newEventButton.click();
    } else {
      await this.createButton.click();
    }
  }

  async getEventCardsCount() {
    return await this.eventCards.count();
  }

  async clickEventCard(index: number = 0) {
    await this.eventCards.nth(index).click();
  }

  async clickCreateEvent() {
    await this.createButton.click();
  }
}

/**
 * Page Object for Event Detail Screen
 */
export class EventDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly description: Locator;
  readonly countdown: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly shareButton: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(selectors.eventDetail.title);
    this.description = page.locator(selectors.eventDetail.description);
    this.countdown = page.locator(selectors.eventDetail.countdown);
    this.editButton = page.locator(selectors.eventDetail.editButton);
    this.deleteButton = page.locator(selectors.eventDetail.deleteButton);
    this.shareButton = page.locator(selectors.eventDetail.shareButton);
    this.breadcrumb = page.locator(selectors.eventDetail.breadcrumb);
  }

  async navigate(eventId: string) {
    await this.page.goto(`/events/${eventId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickShare() {
    await this.shareButton.click();
  }

  async getCountdownText() {
    return await this.countdown.textContent();
  }
}
