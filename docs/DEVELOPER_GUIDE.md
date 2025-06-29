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
