import { Page, Locator } from '@playwright/test';

/**
 * Custom error interface for retry operation failures
 */
export interface RetryError {
  message: string;
  stack?: string;
}

/**
 * Custom error class for retry operation failures
 */
export class RetryOperationError extends Error {
  constructor(
    public readonly operationName: string,
    public readonly attempts: number,
    public readonly lastError: RetryError
  ) {
    super(`Failed to ${operationName} after ${attempts} attempts. Last error: ${lastError.message}`);
    this.name = 'RetryOperationError';
  }
}

/**
 * Configuration options for retry operations
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseWaitTime?: number;
  waitIncrement?: number;
  timeout?: number;
  triggerRerender?: boolean;
}

/**
 * Default retry options
 */
const defaultRetryOptions: Required<RetryOptions> = {
  maxAttempts: 5,
  baseWaitTime: 1000,
  waitIncrement: 500,
  timeout: 2000,
  triggerRerender: true,
};

/**
 * Generic retry utility for Playwright operations
 * @param operation - The async operation to retry
 * @param operationName - Name of the operation for error reporting
 * @param options - Retry configuration options
 * @returns Promise that resolves when operation succeeds
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {}
): Promise<T> => {
  const config = { ...defaultRetryOptions, ...options };
  let attempts = 0;

  while (attempts < config.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      if (attempts >= config.maxAttempts) {
        throw new RetryOperationError(operationName, attempts, error);
      }

      // Wait before retrying with incremental backoff
      const waitTime = config.baseWaitTime + (attempts * config.waitIncrement);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error(`Retry operation failed unexpectedly for ${operationName}`);
};

/**
 * Retry utility specifically for form interactions
 * @param page - Playwright page object
 * @param formLocator - The form locator to wait for
 * @param inputLocator - The input locator to interact with
 * @param inputAction - The action to perform on the input
 * @param options - Retry configuration options
 */
export const retryFormInteraction = async (
  page: Page,
  formLocator: Locator,
  inputLocator: Locator,
  inputAction: (locator: Locator) => Promise<void>,
  options: RetryOptions = {}
): Promise<void> => {
  const config = { ...defaultRetryOptions, ...options };

  await retryOperation(async () => {
    // Check if the form is visible first
    await formLocator.waitFor({ state: 'visible', timeout: config.timeout });
    // Then check if the input is visible and interactable
    await inputLocator.waitFor({ state: 'visible', timeout: config.timeout });
    // Perform the input action
    await inputAction(inputLocator);
  }, 'form interaction', config);

  // Trigger re-render if enabled (useful for GraphQL mocking scenarios)
  if (config.triggerRerender) {
    try {
      await page.click('body');
      await page.waitForTimeout(500);
    } catch (e) {
      // Ignore click errors
    }
  }
};

/**
 * Retry utility for filling input fields
 * @param page - Playwright page object
 * @param formLocator - The form locator to wait for
 * @param inputLocator - The input locator to fill
 * @param value - The value to fill
 * @param options - Retry configuration options
 */
export const retryInputFill = async (
  page: Page,
  formLocator: Locator,
  inputLocator: Locator,
  value: string,
  options: RetryOptions = {}
): Promise<void> => {
  await retryFormInteraction(
    page,
    formLocator,
    inputLocator,
    async (locator) => await locator.fill(value),
    options
  );
};

/**
 * Retry utility for clicking elements
 * @param page - Playwright page object
 * @param elementLocator - The element locator to click
 * @param options - Retry configuration options
 */
export const retryClick = async (
  page: Page,
  elementLocator: Locator,
  options: RetryOptions = {}
): Promise<void> => {
  await retryOperation(async () => {
    await elementLocator.waitFor({ state: 'visible', timeout: options.timeout || 2000 });
    await elementLocator.click();
  }, 'click element', options);
};

/**
 * Retry utility for waiting for elements
 * @param elementLocator - The element locator to wait for
 * @param state - The state to wait for
 * @param options - Retry configuration options
 */
export const retryWaitFor = async (
  elementLocator: Locator,
  state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible',
  options: RetryOptions = {}
): Promise<void> => {
  await retryOperation(async () => {
    await elementLocator.waitFor({
      state,
      timeout: options.timeout || 2000
    });
  }, `wait for element to be ${state}`, options);
};
