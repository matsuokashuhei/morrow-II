import { defineConfig, devices } from '@playwright/test';

/**
 * 開発用高速設定 - ブラウザとテストを最小限に
 * 使用方法: npm run test:dev
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // 開発時はリトライなし
  workers: process.env.CI ? 1 : 4, // 開発時は4並列

  reporter: [
    ['line'], // シンプルなline reporter
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],

  use: {
    baseURL: 'http://frontend:3000',
    trace: 'off', // トレース無効で高速化
    screenshot: 'off', // スクリーンショット無効
    video: 'off', // ビデオ無効
    headless: true,

    // ページロード高速化
    navigationTimeout: 15000, // デフォルト30秒→15秒
    actionTimeout: 10000, // デフォルト0→10秒
  },

  expect: {
    timeout: 3000, // デフォルト5秒→3秒
  },

  // 開発時は Chrome のみ
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // webServerは無効（外部サービス使用）
  webServer: undefined,

  timeout: 20000, // デフォルト30秒→20秒
});
