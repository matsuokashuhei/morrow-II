# CI/CD パイプライン開発ルール

## 概要

このドキュメントは、プルリクエスト #4 での複数のCI失敗から学んだ教訓を基に、同様の問題を防ぐための開発ルールを定めています。

## ❌ 発生した問題の分析

### PR #4 で発生した主な問題
- **9個のコミット中6個が「fix:」** - CI失敗による繰り返し修正
- **Docker Compose構文エラー** - V1とV2の違い
- **依存関係不整合** - package.json ↔ package-lock.json
- **未使用コード残存** - golangci-lint エラー
- **テスト設定不備** - Jest設定、テストファイル不足
- **フォーマットエラー** - Prettier設定不備

## ✅ 必須チェック項目

### 1. コミット前のローカル検証

#### Backend (Go)
```bash
# Lintチェック
docker run --rm -v $(pwd)/backend:/app -w /app golangci/golangci-lint:latest golangci-lint run

# ビルドテスト
docker run --rm -v $(pwd)/backend:/app -w /app golang:1.23-alpine go build ./...

# テスト実行
docker run --rm -v $(pwd)/backend:/app -w /app golang:1.23-alpine go test ./...
```

#### Frontend (React Native/TypeScript)
```bash
# 依存関係インストール
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm ci

# Lintチェック
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm run lint

# 型チェック
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm run type-check

# フォーマットチェック
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm run format:check

# テスト実行
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm test -- --coverage --watchAll=false

# ビルドテスト
docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npm run build
```

### 2. プッシュ前の統合テスト

```bash
# 全体のDocker Composeビルドテスト
docker compose build
docker compose -f docker-compose.prod.yml build

# 開発環境起動テスト
docker compose up --build -d
# ヘルスチェック確認後
docker compose down
```

### 3. 依存関係管理ルール

#### Frontend依存関係
- **package.json変更時**: 必ず`npm install`実行後、`package-lock.json`もコミット
- **新規依存関係追加時**:
  - 本番依存関係: `npm install <package>`
  - 開発依存関係: `npm install --save-dev <package>`
  - ピア依存関係競合時: `--legacy-peer-deps`フラグ使用

#### Backend依存関係
- **go.mod変更時**: `go mod tidy`実行を忘れずに
- **未使用import**: golangci-lintで自動検出されるため事前チェック必須

### 4. テスト設定ルール

#### 新機能追加時
- **Backend**: 対応する単体テストを必ず作成
- **Frontend**: コンポーネントテストを必ず作成
- **テストが0件の場合**: `--passWithNoTests`フラグで基本テストから始める

#### テスト設定ファイル
- **Jest設定**: 新プロジェクトは`jest.config.json`を作成
- **テスト環境**: 必要な依存関係（`@testing-library/*`, `jest-environment-jsdom`等）をインストール

### 5. コード品質ルール

#### フォーマット統一
- **事前チェック**: `npm run format:check`でエラーがないことを確認
- **自動修正**: `npm run format`でフォーマット適用
- **新規ファイル**: 作成時点でフォーマット済みであることを確認

#### 未使用コード
- **Go**: golangci-lintで検出される未使用関数・import削除
- **TypeScript**: ESLintルールで検出される未使用変数削除

### 6. Docker関連ルール

#### Docker Compose
- **現代的構文使用**: `docker compose`（V2）を使用、`docker-compose`（V1）は避ける
- **ビルドテスト**: 本番・開発両環境でのビルドテストを実施

#### Dockerfile
- **マルチステージビルド**: 本番用Dockerfileはマルチステージ構成
- **ヘルスチェック**: 長時間実行サービスはヘルスチェック設定

### 7. コードカバレッジ・Codecov設定

#### ローカルでのカバレッジ確認
```bash
# Backend (Go)
cd backend && go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html

# Frontend (React Native)
cd frontend && npm test -- --coverage --watchAll=false
```

#### Codecov設定
- **レート制限対策**: `fail_ci_if_error: false`を設定してCI失敗を防ぐ
- **トークン設定**: プライベートリポジトリの場合は`CODECOV_TOKEN`シークレットを設定
- **セグメント分離**: `flags: backend`/`flags: frontend`で分離してトラッキング
- **⚠️ 現在の状態**: レート制限回避のため一時的にCodecovアップロードを無効化

#### Codecov 429エラー対策と再有効化手順
```yaml
# CI設定例
- name: Upload coverage reports to Codecov
  uses: codecov/codecov-action@v4
  with:
    fail_ci_if_error: false  # レート制限時もCI失敗させない
    token: ${{ secrets.CODECOV_TOKEN }}  # トークン使用でレート制限回避
```

## 🔄 推奨ワークフロー

### 新機能開発時
1. **ブランチ作成**
2. **実装 + テスト作成**
3. **ローカル検証** (上記チェック項目実行)
4. **コミット** (適切なコミットメッセージ)
5. **プッシュ前統合テスト**
6. **プッシュ**
7. **CI結果確認** (失敗時は修正後再プッシュ)

### 依存関係追加時
1. **依存関係追加**
2. **lock ファイル更新確認**
3. **ビルドテスト実行**
4. **設定ファイル更新** (必要に応じて)
5. **ドキュメント更新** (README.md等)

## 🚨 CI失敗時の対応

### 段階的デバッグアプローチ
1. **ローカル再現**: 同じコマンドをローカルDocker環境で実行
2. **ログ確認**: 詳細なエラーメッセージを確認
3. **依存関係チェック**: package-lock.json、go.sum等の整合性確認
4. **設定ファイル確認**: jest.config.json、.prettierrc等の設定確認
5. **段階的修正**: 1つずつ問題を解決してコミット

### よくあるCI失敗と対策
| エラー種別 | 主な原因 | 対策 |
|-----------|---------|------|
| `golangci-lint unused` | 未使用関数・import | ローカルでlint実行、該当箇所削除 |
| `npm ci` 失敗 | package.json ↔ package-lock.json不整合 | `npm install`でlock更新 |
| `No tests found` | テストファイル不存在 | 基本テスト作成、`--passWithNoTests`追加 |
| `Prettier check` 失敗 | フォーマット不適合 | `npm run format`実行 |
| `Docker build` 失敗 | 依存関係・設定問題 | ローカルでビルドテスト実行 |
| `Codecov 429` レート制限 | アップロード回数超過 | `fail_ci_if_error: false`設定、トークン使用 |
| `Type check` 失敗 | TypeScript型エラー | `npm run type-check`でローカル確認 |
| `Coverage threshold` | カバレッジ不足 | テスト追加、カバレッジ閾値調整 |

## 📝 コミットメッセージガイドライン

### 良い例
```
feat: add user authentication with JWT
test: add comprehensive tests for auth middleware
fix: resolve Docker Compose V2 compatibility issue
docs: update API documentation for auth endpoints
```

### 避けるべき例
```
fix: CI error          // 何のCI？どんなエラー？
update package.json    // 何を追加/変更したのか不明
fix stuff              // 抽象的すぎる
```

## 🔧 開発環境セットアップ

新しい開発者は以下を必ず実行：

```bash
# 1. リポジトリクローン
git clone <repo-url>
cd morrow-II

# 2. 開発環境ビルドテスト
docker compose build

# 3. 各種チェックコマンド動作確認
cd frontend && docker run --rm -v $(pwd):/app -w /app node:18-alpine npm ci
cd ../backend && docker run --rm -v $(pwd):/app -w /app golangci/golangci-lint:latest golangci-lint run

# 4. 統合テスト
docker compose up --build
```

## 📋 チェックリスト

プルリクエスト作成前に必ず確認：

- [ ] ローカルで全てのlint/testが通過
- [ ] 依存関係追加時はlockファイルも更新済み
- [ ] 新機能にはテストを追加済み
- [ ] フォーマットチェックが通過
- [ ] Dockerビルドが成功
- [ ] 適切なコミットメッセージを使用
- [ ] CI失敗時は段階的デバッグを実施

---

**このルールに従うことで、PR #4 のような繰り返しCI失敗を防ぎ、効率的な開発を実現します。**
