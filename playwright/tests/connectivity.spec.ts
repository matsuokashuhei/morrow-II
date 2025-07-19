import { test, expect } from '@playwright/test';

test.describe('Basic Connectivity Test', () => {
  test('should access the frontend application', async ({ page }) => {
    // Navigate to the application using baseURL from config
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Basic check that the page loads - check for exact title
    await expect(page).toHaveTitle('Morrow - Event Countdown Sharing App');

    // Check for root element
    const rootDiv = page.locator('#root');
    await expect(rootDiv).toBeVisible();

    // Give React time to mount and check for content
    await page.waitForTimeout(3000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'e2e/reports/connectivity-test.png', fullPage: true });
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

    const responseData = await response.json();
    expect(responseData.data).toBeTruthy();
    expect(responseData.data.__schema).toBeTruthy();
    expect(responseData.data.__schema.types).toBeTruthy();
    expect(Array.isArray(responseData.data.__schema.types)).toBe(true);

    // Check for some expected GraphQL types
    const typeNames = responseData.data.__schema.types.map((type: any) => type.name);
    expect(typeNames).toContain('User');
    expect(typeNames).toContain('Event');
    expect(typeNames).toContain('Participant');
  });
});
