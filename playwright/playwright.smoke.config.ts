import { defineConfig, devices } from '@playwright/test';

/**
 * スモークテスト設定 - 最重要テストのみ高速実行
 * 使用方法: npm run test:smoke-full
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 6, // 高並列

  reporter: [['line']],

  use: {
    baseURL: 'http://frontend:3000',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    headless: true,
    navigationTimeout: 10000,
    actionTimeout: 8000,
  },

  expect: {
    timeout: 2000,
  },

  // スモークテスト: クリティカルパスのみ
  projects: [
    {
      name: 'smoke-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'tests/connectivity.spec.ts',
        'tests/home.spec.ts',
        'tests/event-creation.spec.ts' // 主要機能のみ
      ]
    },
  ],

  timeout: 15000,
});
