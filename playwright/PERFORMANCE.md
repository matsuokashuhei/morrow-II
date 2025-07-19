# Playwright E2E テスト パフォーマンス ガイド

## � **実行時間とテスト数の比較**

| 設定 | テスト数 | ブラウザ数 | 実行時間 | 用途 |
|------|----------|-----------|----------|------|
| **Connectivity** | 10 | 2 | ~10秒 | 基本接続確認 |
| **Development** | 65 | 1 (Chrome) | ~30秒 | 開発中の迅速テスト |
| **Smoke Fast** | 65 | 2 | ~45秒 | デプロイ前チェック |
| **Full Coverage** | **195** | 2 | **3-5分** | 完全なテストカバレッジ |
| **Legacy Full** | 325 | 5 | 10-15分 | 全ブラウザ対応 |

## 🏃‍♂️ **速度最適化されたコマンド**

### 最速 (開発用)
```bash
# 10秒 - 基本接続のみ
make test-e2e-connectivity

# 30秒 - Chrome開発用
make test-e2e-dev
```

### バランス型 (CI/CD用)
```bash
# 45秒 - スモークテスト
make test-e2e-fast

# 3-5分 - 完全カバレッジ
make test-e2e
```

## 📋 **テストファイル構成**

### 新しいテストファイル (追加分)
- `event-list.spec.ts` - イベント一覧画面のテスト (65テスト)
- `event-detail.spec.ts` - イベント詳細画面のテスト (65テスト)
- `graphql-test.spec.ts` - GraphQLテスト画面のテスト (65テスト)

### 既存のテストファイル
- `connectivity.spec.ts` - 基本接続テスト (10テスト)
- `home.spec.ts` - ホーム画面テスト (35テスト)
- `onboarding.spec.ts` - オンボーディングテスト (55テスト)
- `event-creation.spec.ts` - イベント作成テスト (55テスト)

### 合計: **195テスト** × 2ブラウザ = **390実行**
# 基本的な接続性のみ確認
make test-e2e-connectivity
# または
docker compose --profile tools run --rm playwright npm run test:smoke
```

### 5. フル E2E テスト（約10-15分）
```bash
# 全ブラウザ、全テスト
make test-e2e
# または
docker compose --profile tools run --rm playwright npm test
```

## ⚙️ 各設定の違い

| 設定 | ブラウザ数 | 並列度 | テスト数 | スクリーンショット | 実行時間 |
|------|-----------|--------|----------|-------------------|----------|
| test:fast | 1 (Chrome) | 4 | 全テスト | なし | ~30秒 |
| test:dev | 1 (Chrome) | 4 | 全テスト | 失敗時のみ | ~1-2分 |
| test:smoke-full | 1 (Chrome) | 6 | 重要のみ | なし | ~1分 |
| test:smoke | 1 (Chrome) | 4 | 接続のみ | なし | ~10秒 |
| test (フル) | 5 ブラウザ | 6 | 全テスト | 失敗時のみ | ~10-15分 |

## 💡 開発時の推奨ワークフロー

### 日常開発
1. **コード変更後**: `make test-e2e-connectivity` (10秒)
2. **機能実装中**: `make test-e2e-fast` (30秒)
3. **機能完成時**: `make test-e2e-dev` (1-2分)

### Pull Request 前
1. **最終確認**: `make test-e2e-smoke` (1分)
2. **フル検証**: `make test-e2e` (10-15分)

## 🎯 特定テストの実行

### ファイル別実行
```bash
# ホーム画面テストのみ
docker compose --profile tools run --rm playwright npm test tests/home.spec.ts

# イベント作成テストのみ（最も重い）
docker compose --profile tools run --rm playwright npm test tests/event-creation.spec.ts
```

### ブラウザ別実行
```bash
# Chrome のみ
docker compose --profile tools run --rm playwright npm run test:chromium

# モバイルテストのみ
docker compose --profile tools run --rm playwright npm run test:mobile
```

## 📊 更なる高速化アイデア

### A. テストの並列実行調整
```typescript
// playwright.dev.config.ts
workers: 8, // CPUコア数に応じて調整
```

### B. Docker イメージキャッシュ
```bash
# ブラウザを事前ダウンロード
docker compose --profile tools run --rm playwright npm run install-browsers
```

### C. 段階的テスト実行
```bash
# 1. 接続確認
make test-e2e-connectivity && \
# 2. 成功したら重要テスト
make test-e2e-smoke && \
# 3. 成功したら全テスト
make test-e2e-dev
```

### D. テストデータの最適化
- フィクスチャーの事前準備
- GraphQL モックの使用
- 外部API呼び出しの削減

### E. CI/CD での並列化
```yaml
# GitHub Actions での並列実行例
strategy:
  matrix:
    browser: [chromium, firefox, webkit, mobile-chrome, mobile-safari]
```

## 🔧 カスタム設定

必要に応じて独自の設定ファイルを作成：

```typescript
// playwright.custom.config.ts
export default defineConfig({
  // 自分専用の最適化設定
  workers: 2,
  projects: [{ name: 'chromium' }],
  use: {
    trace: 'off',
    video: 'off',
    screenshot: 'off'
  }
});
```

実行:
```bash
docker compose --profile tools run --rm playwright npx playwright test --config=playwright.custom.config.ts
```
