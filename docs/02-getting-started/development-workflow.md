# 🔄 開発ワークフロー

## 🎯 日常的な開発作業の流れ

### 1. 開発開始
```bash
# 最新コードを取得
git pull origin main

# 開発環境を起動
make dev

# 新しい機能ブランチを作成
git checkout -b feature/new-countdown-feature
```

### 2. コード作成
```bash
# バックエンドの作業
docker-compose exec backend bash
# コンテナ内でGoコマンドを実行
go mod tidy
go run cmd/server/main.go

# フロントエンドの作業
docker-compose exec frontend bash
# コンテナ内でnpmコマンドを実行
npm install
npm run dev
```

### 3. コミット前の必須チェック
```bash
# 全体のlint
make lint

# 全体のテスト
make test

# フォーマットの実行
make format

# 個別検証も可能
make lint-backend
make test-frontend
make format-go
```

### 4. コミット・プッシュ
```bash
# 変更をステージング
git add .

# コミット（pre-commitフックが自動実行）
git commit -m "feat: add new countdown feature"

# プッシュ
git push origin feature/new-countdown-feature
```

### 5. プルリクエスト作成
1. GitHubでPRを作成
2. CI/CDパイプラインの通過を確認
3. レビューを依頼
4. レビュー対応
5. マージ

## 🛠️ 開発ツール活用

### VS Code Dev Containers（推奨）
```bash
# Dev Containersで開発環境を起動
code .
# VS Code でコマンドパレット (Cmd+Shift+P) を開く
# "Dev Containers: Reopen in Container" を選択
```

### ホットリロード機能
- **バックエンド**: Air を使用した自動リロード
- **フロントエンド**: Vite による高速なHMR（Hot Module Replacement）

### デバッグ機能
```bash
# Go デバッガー（Delve）の使用
docker-compose exec backend dlv debug cmd/server/main.go

# React デバッガー
# ブラウザの開発者ツールを使用
# React DevTools 拡張機能で状態管理の確認
```

## 📋 タスク管理

### GitHub Issues の活用
- **機能開発**: `feature` ラベル
- **バグ修正**: `bug` ラベル
- **ドキュメント**: `documentation` ラベル
- **インフラ**: `infrastructure` ラベル

### Issue テンプレート
```markdown
## 概要
<!-- 何を実装するか -->

## 背景・目的
<!-- なぜこの機能が必要か -->

## 実装詳細
<!-- 具体的な実装内容 -->

## 受け入れ基準
- [ ] 機能が正常に動作する
- [ ] テストが通る
- [ ] ドキュメントが更新されている
```

## 🧪 テスト戦略

### テストの種類と実行タイミング

#### 1. 単体テスト
```bash
# 開発中に随時実行
make test-unit

# 特定のパッケージのテスト
docker-compose exec backend go test ./internal/handler/
docker-compose exec frontend npm test -- --testPathPattern=components
```

#### 2. 統合テスト
```bash
# 機能完成時に実行
make test-integration

# APIテスト
docker-compose exec backend go test ./test/integration/
```

#### 3. E2Eテスト（Playwright）
```bash
# PR作成前に実行
make test:e2e

# 開発中の特定テスト実行
docker compose --profile tools run --rm playwright npm test tests/home.spec.ts

# デバッグモード
docker compose --profile tools run --rm playwright npm run test:debug

# UIモードでテスト実行
docker compose --profile tools run --rm playwright npm run test:ui
```

**📖 詳細**: [Playwright E2Eテストガイド](./playwright-e2e-testing.md)

### テスト駆動開発（TDD）
```bash
# 1. テストを書く
# 2. テストが失敗することを確認
make test-unit

# 3. 最小限の実装でテストを通す
# 4. テストが通ることを確認
make test-unit

# 5. リファクタリング
# 6. テストが通ることを再確認
make test-unit
```

## 🎨 コード品質管理

### Linter の設定と実行

#### Go（golangci-lint）
```yaml
# .golangci.yml
run:
  timeout: 5m

linters:
  enable:
    - gofmt
    - goimports
    - govet
    - ineffassign
    - misspell
    - revive
    - staticcheck
    - typecheck
    - unused
    - errcheck
```

#### TypeScript（ESLint + Prettier）
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Pre-commit Hooks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml

  - repo: local
    hooks:
      - id: golangci-lint
        name: golangci-lint
        entry: golangci-lint run
        language: system
        types: [go]
```

## 🚀 デプロイメント

### CI/CD パイプライン
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: make test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: make build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: make deploy
```

### 段階的デプロイメント
1. **Development**: 開発ブランチから自動デプロイ
2. **Staging**: PRマージ時にステージング環境へデプロイ
3. **Production**: mainブランチマージ時に本番環境へデプロイ

## 🔍 監視・デバッグ

### ログの確認
```bash
# コンテナのログを確認
docker-compose logs backend
docker-compose logs frontend

# リアルタイムでログを監視
docker-compose logs -f backend
```

### パフォーマンス監視
```bash
# CPU・メモリ使用量の確認
docker stats

# Goアプリケーションのプロファイリング
docker-compose exec backend go tool pprof http://localhost:8080/debug/pprof/profile
```

### エラー追跡
```bash
# エラーログの抽出
docker-compose logs backend | grep ERROR

# デバッグ情報の有効化
export DEBUG=true
make dev
```

## 📊 開発効率向上のヒント

### 1. 効率的なコマンド実行
```bash
# よく使うコマンドをエイリアス化
alias mdev='make dev'
alias mtest='make test'
alias mlint='make lint'

# 複数のコマンドを一度に実行
make lint && make test && echo "All checks passed!"
```

### 2. IDEの活用
- **Go**: VS Code の Go 拡張機能
- **TypeScript**: IntelliSense とオートコンプリート
- **Docker**: Dev Containers での統一開発環境

### 3. 開発サイクルの最適化
```bash
# 高速なフィードバックループ
# 変更 → 自動テスト → 即座に結果確認
make test-watch
```

## 🎯 ベストプラクティス

### 1. コミットメッセージ
```bash
# Conventional Commits形式
feat: add user authentication
fix: resolve countdown timer bug
docs: update API documentation
style: fix code formatting
refactor: improve event handler logic
test: add unit tests for user service
```

### 2. ブランチ戦略
```bash
# 機能開発
feature/countdown-timer
feature/user-auth
feature/event-sharing

# バグ修正
fix/timer-accuracy
fix/auth-validation

# ホットフィックス
hotfix/critical-security-patch
```

### 3. レビュー観点
- **機能性**: 要件を満たしているか
- **品質**: コードの可読性・保守性
- **セキュリティ**: セキュリティリスクはないか
- **パフォーマンス**: 性能問題はないか
- **テスト**: 適切なテストが書かれているか

---

**関連ドキュメント**:
- [開発環境構築](./development-setup.md)
- [開発ガイドライン](./development-guidelines.md)
- [CI/CD設定](../06-deployment/ci-cd.md)
- [トラブルシューティング](./troubleshooting.md)

**最終更新**: 2025年7月6日
