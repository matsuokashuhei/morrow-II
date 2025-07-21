import { test, expect } from '@playwright/test';
import { filterCriticalErrors, waitForGraphQL, handleTestError } from '../utils/test-helpers';

test.describe('Basic Connectivity Test', () => {
  test('should access the frontend application', async ({ page }) => {
    try {
      // Navigate to the application using baseURL from config
      await page.goto('/');

      // Wait for the page to load with increased timeout
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Basic check that the page loads - check for exact title
      await expect(page).toHaveTitle('Morrow - Event Countdown Sharing App', { timeout: 10000 });

      // Check for root element
      const rootDiv = page.locator('#root');
      await expect(rootDiv).toBeVisible({ timeout: 10000 });

      // Wait for React to mount and initialize
      await waitForGraphQL(page);

      // Take a screenshot for debugging
      await page.screenshot({ path: 'e2e/reports/connectivity-test.png', fullPage: true });
    } catch (error) {
      await handleTestError(page, 'frontend-access');
      throw error;
    }
  });

  test('should verify React app is running', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check for React root element
    const reactRoot = page.locator('#root');
    await expect(reactRoot).toBeVisible();

    // Wait for React to mount content
    await page.waitForTimeout(3000);

    // Check that root has some content (React has mounted)
    const rootContent = await reactRoot.innerHTML();
    expect(rootContent.trim()).not.toBe('');

    // Verify there's no critical JavaScript errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any errors to surface
    await page.waitForTimeout(2000);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon.ico') &&
      !error.includes('Extension') &&
      !error.includes('chrome-extension')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should verify backend API is accessible', async ({ page }) => {
    // Test basic GraphQL introspection query
    const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://backend:8080/api/v1/graphql';
    const response = await page.request.post(graphqlEndpoint, {
      data: {
        query: `
          {
            __schema {
              types {
                name
              }
            }
          }
        `
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);

    // Check for some expected GraphQL types
    interface GraphQLType {
      name: string;
    }

    interface GraphQLSchema {
      __schema: {
        types: GraphQLType[];
      };
    }

    const responseData: { data: GraphQLSchema } = await response.json();
    expect(responseData.data).toBeTruthy();
    expect(responseData.data.__schema).toBeTruthy();
    expect(responseData.data.__schema.types).toBeTruthy();
    expect(Array.isArray(responseData.data.__schema.types)).toBe(true);
    const typeNames = responseData.data.__schema.types.map((type: GraphQLType) => type.name);
    expect(typeNames).toContain('User');
    expect(typeNames).toContain('Event');
    expect(typeNames).toContain('Participant');
  });
});
