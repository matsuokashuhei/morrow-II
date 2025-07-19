# 🎭 Playwright E2Eテスト ガイド

> **Morrowアプリケーションの包括的なEnd-to-Endテスト環境**

## 📋 概要

Playwrightを使用したE2Eテストスイートにより、Morrowアプリケーションの品質保証と回帰防止を実現しています。独立したDocker環境で実行され、CI/CDパイプラインと統合されています。

## 🏗️ アーキテクチャ

### ディレクトリ構造
```
playwright/                    # E2Eテスト環境（フロントエンドから分離）
├── Dockerfile                 # Playwright実行環境
├── package.json               # E2E専用依存関係
├── playwright.config.ts       # Playwright設定
├── tsconfig.json              # TypeScript設定
├── tests/                     # テストファイル
│   ├── connectivity.spec.ts   # 接続性テスト
│   ├── home.spec.ts           # ホーム画面テスト
│   ├── onboarding.spec.ts     # オンボーディングテスト
│   └── event-creation.spec.ts # イベント作成テスト
├── fixtures/                  # テストデータ
│   ├── events.json           # イベントデータ
│   └── users.json            # ユーザーデータ
├── utils/                     # テストユーティリティ
│   ├── test-helpers.ts       # ヘルパー関数
│   └── page-objects.ts       # Page Objectパターン
├── reports/                   # テストレポート（gitignore）
└── test-results/             # テスト結果（gitignore）
```

### Docker環境
- **ベースイメージ**: `mcr.microsoft.com/playwright:v1.54.1-jammy`
- **ブラウザ**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **ネットワーク**: `morrow-network`経由でbackend/frontend接続

## 🚀 クイックスタート

### 前提条件
- Docker Composeが動作していること
- backend/frontendサービスが起動していること

### 基本的な実行手順

```bash
# 1. 開発環境を起動
make dev

# 2. E2Eテストを実行
docker compose --profile tools run --rm playwright npm test

# 3. UIモードでテストを実行
docker compose --profile tools run --rm playwright npm run test:ui

# 4. 特定のテストファイルのみ実行
docker compose --profile tools run --rm playwright npm test tests/home.spec.ts
```

### Makefileコマンド（実装予定）
```bash
make test:e2e              # 全E2Eテストを実行
make test:e2e:ui           # UIモードで実行
make test:e2e:debug        # デバッグモード
make test:e2e:report       # レポート表示
```

## 🧪 テストスイート

### 1. 接続性テスト（connectivity.spec.ts）
- **目的**: サービス間の基本的な接続性確認
- **対象**: Frontend (3000), Backend (8080), GraphQL endpoint
- **実行頻度**: 毎回の前提チェック

```typescript
test('should connect to frontend', async ({ page }) => {
  await page.goto('http://frontend:3000');
  await expect(page).toHaveTitle(/Morrow/);
});
```

### 2. ホーム画面テスト（home.spec.ts）
- **初回訪問時のレイアウト**
  - Hero section表示
  - 機能紹介カード（3つ）
  - CTA ボタンの動作
- **レスポンシブデザイン**
  - Mobile, Tablet, Desktop表示
- **アクセシビリティ**
  - 見出し階層
  - ARIA属性

### 3. オンボーディングテスト（onboarding.spec.ts）
- **4段階プログレス**
  - Step 1: ウェルカム
  - Step 2: 機能紹介
  - Step 3: 利用方法
  - Step 4: 完了
- **ナビゲーション**
  - Next/Previous ボタン
  - Skip ボタン
  - プログレスバー更新

### 4. イベント作成テスト（event-creation.spec.ts）
- **フォームバリデーション**
  - 必須フィールドチェック
  - 文字数制限
  - 日時バリデーション
- **GraphQL統合**
  - Mutation実行
  - エラーハンドリング
- **UX機能**
  - リアルタイムバリデーション
  - ローディング状態

## ⚙️ 設定とカスタマイズ

### playwright.config.ts の主要設定

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],
  use: {
    baseURL: 'http://frontend:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
});
```

### 環境変数
```bash
# CI環境での実行制御
CI=true                    # リトライ回数・並列度調整
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1  # CI最適化

# デバッグ設定
DEBUG=pw:api              # Playwright API デバッグ
PWDEBUG=1                 # デバッグモード
```

## 📊 レポートと結果

### HTML レポート
- **場所**: `playwright/reports/html/`
- **内容**: 詳細なテスト結果、スクリーンショット、ビデオ
- **表示**: `npm run test:report`

### JUnit XML
- **場所**: `playwright/reports/junit.xml`
- **用途**: CI/CDパイプライン統合
- **形式**: Jenkins/GitHub Actions対応

### JSON レポート
- **場所**: `playwright/reports/test-results.json`
- **用途**: カスタムレポート生成
- **内容**: 構造化されたテスト結果データ

## 🔧 開発ワークフロー

### 新しいテストの追加

1. **テストファイル作成**
```bash
# テストファイルをtests/ディレクトリに作成
touch playwright/tests/new-feature.spec.ts
```

2. **Page Objectパターン使用**
```typescript
// utils/page-objects.ts に再利用可能なページクラス定義
export class EventCreationPage {
  constructor(private page: Page) {}

  async fillEventForm(data: EventData) {
    await this.page.fill('[data-testid="event-title"]', data.title);
    // ...
  }
}
```

3. **テストデータ管理**
```typescript
// fixtures/events.json でテストデータ管理
{
  "validEvent": {
    "title": "テストイベント",
    "description": "テスト用の説明",
    "startDate": "2025-12-31T10:00:00Z"
  }
}
```

### デバッグ手順

1. **ローカルデバッグ**
```bash
# デバッグモードで実行
docker compose --profile tools run --rm playwright npm run test:debug
```

2. **スクリーンショット確認**
```bash
# 失敗時のスクリーンショットを確認
ls playwright/test-results/*/
```

3. **ビデオ再生**
```bash
# 失敗したテストのビデオを再生
open playwright/test-results/*/video.webm
```

## 🚨 トラブルシューティング

### よくある問題と解決法

#### 1. ブラウザダウンロードエラー
```bash
# 解決法: ブラウザを手動インストール
docker compose run --rm playwright npx playwright install
```

#### 2. ネットワーク接続エラー
```bash
# 解決法: サービスの起動状態確認
docker compose ps
docker compose logs frontend
docker compose logs backend
```

#### 3. テストタイムアウト
```typescript
// playwright.config.ts でタイムアウト調整
use: {
  actionTimeout: 30000,    // 個別アクション
  navigationTimeout: 60000 // ページ遷移
}
```

#### 4. Docker Compose プロファイル
```bash
# --profile tools が必要
docker compose --profile tools run --rm playwright npm test
```

## 🔄 CI/CD統合

### GitHub Actions設定例
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Start services
        run: docker compose up -d
      - name: Run E2E tests
        run: |
          docker compose --profile tools run --rm playwright npm test
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright/reports/
```

## 📚 ベストプラクティス

### 1. テスト設計
- **Page Objectパターン**: UI変更に強いテスト
- **データドリブン**: fixturesでテストデータ管理
- **並列実行**: 独立性を保った高速テスト

### 2. メンテナンス
- **定期実行**: CI/CDでの自動実行
- **レポート監視**: 失敗パターンの分析
- **更新**: 機能追加時のテスト追加

### 3. パフォーマンス
- **選択的実行**: 変更範囲に応じたテスト実行
- **リソース管理**: Docker環境の効率的利用
- **並列度調整**: CI環境に応じた最適化

## 🔗 関連ドキュメント

- **[開発環境構築](../02-getting-started/development-setup.md)** - Docker環境の基本設定
- **[CI/CD](../06-deployment/ci-cd.md)** - 継続的インテグレーション
- **[トラブルシューティング](../02-getting-started/troubleshooting.md)** - 一般的な問題解決

---

**最終更新**: 2025年7月19日
**担当者**: Development Team
**次回レビュー**: 2025年8月19日
