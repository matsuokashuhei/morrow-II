# 開発者ガイド - Morrow プロジェクト

## 概要

このドキュメントは、Morrowプロジェクトの開発に参加する開発者向けのガイドです。コード品質管理、開発フロー、使用ツールについて説明します。

## 🛠 開発ツール構成

### コード品質管理ツール

#### Go（バックエンド）
- **gofmt**: Go標準のコードフォーマッター
- **golangci-lint**: 包括的なGo linter
  - 設定ファイル: `.golangci.yml`
  - 30以上のlinterを組み合わせ
  - パフォーマンス、セキュリティ、スタイルをチェック

#### TypeScript/JavaScript（フロントエンド）
- **Prettier**: コードフォーマッター
  - 設定ファイル: `frontend/.prettierrc`
  - 一貫したコードスタイルを自動適用
- **ESLint**: TypeScript/JavaScript linter
  - 設定ファイル: `frontend/.eslintrc.json`
  - Expo推奨設定 + TypeScript拡張

#### Pre-commit Hooks
- **pre-commit**: コミット前の自動検証
  - 設定ファイル: `.pre-commit-config.yaml`
  - Go、TypeScript、一般ファイルの検証
- **husky + lint-staged**: フロントエンド専用フック
  - 変更されたファイルのみ検証

## 📋 開発フロー

### 1. 開発環境セットアップ

```bash
# 初回セットアップ
make setup

# 依存関係インストール
make install-backend
make install-frontend

# Pre-commit hooks設定
make setup-hooks
```

### 2. 日常的な開発作業

```bash
# 開発環境起動
make dev

# コードを書く...

# コミット前の検証
make pre-commit

# 個別検証
make lint        # 全体のlint
make test        # 全体のテスト
make format      # 全体のフォーマット
```

### 3. Go コマンド実行ルール

**重要**: Goコマンド（go mod、go get、go run等）は必ずDockerコンテナ内で実行してください。

```bash
# ❌ ローカルでの実行（禁止）
go mod tidy
go get github.com/example/package
go run main.go

# ✅ Dockerコンテナ内での実行（推奨）
docker-compose exec backend go mod tidy
docker-compose exec backend go get github.com/example/package
docker-compose exec backend go run cmd/server/main.go

# または、コンテナ内でbashシェルを起動して作業
docker-compose exec backend bash
# コンテナ内で
go mod tidy
go get github.com/example/package
```

**理由**:
- Goバージョンの一貫性を保つ
- 依存関係の環境一致
- go.mod/go.sumファイルの整合性
- チーム開発での環境差分回避

### 4. プルリクエスト作成前

```bash
# 最終検証
make validate

# Docker環境での動作確認
make build
make up
```

## 🔍 品質管理基準

### コミット前の必須チェック項目

1. **コードフォーマット**: すべてのコードが適切にフォーマットされている
2. **Lint検証**: エラー・警告がすべて解決されている
3. **型チェック**: TypeScriptの型エラーがない
4. **テスト**: 関連するテストがすべて通る
5. **ビルド**: Docker環境でビルドが成功する

### エラー解決優先度

#### 高優先度（CI失敗の原因）
- **golangci-lint エラー**: セキュリティ、パフォーマンス関連
- **ESLint エラー**: 型安全性、潜在的バグ
- **テスト失敗**: 機能の破綻
- **ビルドエラー**: デプロイ不可

#### 中優先度（警告レベル）
- **golangci-lint 警告**: コードスタイル、重複
- **ESLint 警告**: コード品質改善
- **未使用import/変数**: コードの整理

## 🚨 CI/CD失敗時の対処法

### よくある失敗パターン

#### 1. golangci-lint 失敗
```bash
# ローカルで確認
make lint-backend

# 修正方法
cd backend
golangci-lint run --fix  # 自動修正可能な項目
```

#### 2. ESLint/Prettier 失敗
```bash
# ローカルで確認
make lint-frontend

# 修正方法
cd frontend
npm run lint:fix    # ESLintエラー自動修正
npm run format      # Prettierフォーマット
```

#### 3. テスト失敗
```bash
# バックエンドテスト
make test-backend

# フロントエンドテスト
make test-frontend

# 新しいテストファイル追加時
# frontend/src/__tests__/ 配下にテストファイル作成
```

#### 4. Docker Compose 構文エラー
```bash
# 構文チェック
docker-compose config

# ローカルビルドテスト
make build
```

### CI失敗を防ぐベストプラクティス

1. **コミット前の pre-commit 実行**: `make pre-commit`
2. **小さな単位でのコミット**: 大きな変更は分割
3. **依存関係変更時の注意**: package.json ↔ package-lock.json整合性
4. **未使用コードの削除**: IDEの警告に注意

## 🧪 テスト実行ガイド

### テスト実行環境

**すべてのテストは必ずDockerコンテナ内で実行してください**

#### バックエンドテスト
```bash
# 全テスト実行
docker-compose exec backend go test ./... -v

# 特定パッケージのテスト
docker-compose exec backend go test ./internal/handler -v
docker-compose exec backend go test ./internal/config -v
docker-compose exec backend go test ./internal/middleware -v

# カバレッジ付きテスト実行
docker-compose exec backend go test -coverprofile=coverage.out ./...
docker-compose exec backend go tool cover -html=coverage.out
```

#### フロントエンドテスト
```bash
# Jest テスト実行
docker-compose exec frontend npm test

# ウォッチモード
docker-compose exec frontend npm test -- --watch

# カバレッジレポート
docker-compose exec frontend npm test -- --coverage
```

### データベーステスト

#### データベース接続確認
```bash
# PostgreSQL接続テスト
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "SELECT version();"

# テーブル構造確認
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\dt"

# 特定テーブルのスキーマ確認
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\d events"
```

#### マイグレーション確認
```bash
# マイグレーション状態確認
docker-compose logs backend | grep -i migration

# 手動マイグレーション実行（緊急時のみ）
docker-compose exec backend go run cmd/server/main.go
```

### 統合テスト

#### API エンドポイントテスト
```bash
# ヘルスチェック
curl http://localhost:8080/health | jq .

# 疎通確認
curl http://localhost:8080/ping | jq .

# API v1 ステータス
curl http://localhost:8080/api/v1/status | jq .
```

#### パフォーマンステスト
```bash
# レスポンス時間測定
for i in {1..5}; do 
  echo "Request $i:"; 
  time curl -s http://localhost:8080/health > /dev/null; 
done

# 同時接続テスト
for i in {1..10}; do 
  curl -s http://localhost:8080/ping > /dev/null & 
done; 
wait && echo "All requests completed"
```

### テスト結果の期待値

#### 成功基準
- **バックエンドテスト**: 全テスト通過（設定、ハンドラー、ミドルウェア）
- **フロントエンドテスト**: 全Jestテスト通過
- **API レスポンス時間**: 15ms以下
- **データベース接続**: PostgreSQL 15.13 稼働確認
- **ヘルスチェック**: `status: "ok"` レスポンス

#### エラー対応
- **テスト失敗**: ログ確認後、個別テスト実行で原因特定
- **データベース接続エラー**: PostgreSQLコンテナ再起動
- **API応答なし**: バックエンドコンテナログ確認
- **ポート競合**: `docker-compose down` 後に再起動

## 📊 品質監視

### 継続的品質確認
```bash
# 日次品質チェック
make test-all                      # 全テスト実行
make lint-all                      # 全Lint検証
make build                         # Docker ビルド確認

# 週次パフォーマンスチェック
make performance-test              # API応答速度測定
make load-test                     # 負荷テスト実行
```

### 品質メトリクス
- **テストカバレッジ**: バックエンド 85%以上維持
- **Lint違反**: ゼロ維持
- **API応答時間**: 平均15ms以下
- **ビルド時間**: 5分以内完了

## 📚 リファレンス

### 設定ファイル一覧
- `.golangci.yml`: Go linter設定
- `frontend/.prettierrc`: Prettierフォーマット設定
- `frontend/.eslintrc.json`: ESLint設定
- `.pre-commit-config.yaml`: Pre-commit hooks設定
- `Makefile`: 開発コマンド定義

### 有用なコマンド
```bash
# 設定確認
golangci-lint --help                # Go linter オプション
npx eslint --help                   # ESLint オプション
npx prettier --help                 # Prettier オプション
pre-commit --help                   # Pre-commit オプション

# トラブルシューティング
make clean                          # Docker環境クリーンアップ
docker system prune -f              # Dockerリソース削除
npm ci                              # 依存関係再インストール
go mod tidy                         # Go依存関係整理
```

### 公式ドキュメント
- [golangci-lint](https://golangci-lint.run/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [pre-commit](https://pre-commit.com/)

## 🤝 サポート

質問や問題が発生した場合：
1. このドキュメントの確認
2. [CI/CDパイプライン開発ルール](./ci-cd-rules.md)の確認
3. Issue作成時に具体的なエラーメッセージを添付
