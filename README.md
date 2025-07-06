# Morrow - 生活イベントカウントダウン共有アプリ

![Morrow Logo](docs/images/logo.png)

**Morrow**は、重要な生活イベントのカウントダウンを友人や家族と共有できるモバイルアプリケーションです。誕生日、記念日、イベント開催日など、大切な日までの時間を美しく表示し、リアルタイムでチャットしながら一緒に待つことができます。

## 📱 主な機能

### Phase 1: MVP機能
- ✅ イベント作成・編集・削除
- ✅ リアルタイムカウントダウン表示
- ✅ 基本的なイベント管理
- ✅ 開発ツール・リンター設定

### Phase 2: ソーシャル機能
- 🔄 ユーザー認証（Google/Apple）
- 🔄 イベント共有（QRコード・招待リンク）
- 🔄 リアルタイムチャット
- 🔄 プッシュ通知

### Phase 3: プレミアム機能
- 📅 高度なチャット機能（画像・ファイル共有）
- 📅 課金システム（プレミアムプラン）
- 📅 パフォーマンス最適化

### Phase 4: Web展開
- 📅 React Webアプリ
- 📅 ビジネス向け機能
- 📅 管理者ダッシュボード

## 🛠 技術スタック

### バックエンド
- **言語**: Go 1.23+
- **フレームワーク**: Gin
- **ORM**: Ent
- **API**: GraphQL (gqlgen)
- **データベース**: PostgreSQL (メイン), DynamoDB (チャット)
- **キャッシュ**: Redis
- **認証**: Amazon Cognito

### フロントエンド
- **モバイル**: React Native + TypeScript
- **Web**: React + TypeScript + Vite
- **状態管理**: Zustand
- **UI**: Tailwind CSS / React Native Elements
- **GraphQLクライアント**: Apollo Client

### インフラ・DevOps
- **クラウド**: AWS (ECS, RDS, ElastiCache, S3, CloudFront)
- **CI/CD**: GitHub Actions
- **開発ツール**: Docker, Docker Compose, golangci-lint, ESLint, Prettier

## 🚀 開発環境セットアップ

### 前提条件
- Docker & Docker Compose
- Node.js 18+ (ローカル開発時)
- Go 1.23+ (ローカル開発時)

### クイックスタート

```bash
# リポジトリクローン
git clone https://github.com/matsuokashuhei/morrow-II.git
cd morrow-II

# 開発環境セットアップ
make setup

# 開発サーバー起動
make dev
```

### 開発コマンド

```bash
# 開発環境
make dev                # 全サービス起動
make dev-backend        # バックエンドのみ
make dev-frontend       # フロントエンドのみ

# コード品質管理
make lint              # 全体のlint
make lint-backend      # Go linter
make lint-frontend     # TypeScript/JavaScript linter
make format            # 全体のフォーマット
make format-backend    # Go フォーマット
make format-frontend   # TypeScript/JavaScript フォーマット

# テスト
make test              # 全体のテスト
make test-backend      # Go テスト
make test-frontend     # React Native テスト
make test-coverage     # カバレッジ付きテスト

# Pre-commit 検証
make pre-commit        # コミット前の検証（format + lint + test）
make validate          # プッシュ前の最終検証

# その他
make clean             # Docker環境クリーンアップ
make help              # 利用可能なコマンド一覧
```

## 📋 開発ガイドライン

### コード品質管理
- **Go**: golangci-lint による包括的な静的解析
- **TypeScript**: ESLint + Prettier による品質管理
- **Pre-commit hooks**: コミット前の自動検証
- **CI/CD**: GitHub Actions による継続的インテグレーション

### 開発フロー
1. Issue作成・担当者アサイン
2. ブランチ作成（feature/issue-番号）
3. 開発・テスト（`make pre-commit`で検証）
4. プルリクエスト作成
5. **CI/CD全ジョブ成功まで修正継続** 🚨 **必須**
6. 全CI成功確認後、コードレビュー
7. マージ

### 詳細なドキュメント
- [📖 開発者ガイド](docs/DEVELOPER_GUIDE.md)
- [⚙️ CI/CD開発ルール](docs/development/ci-cd-rules.md)
- [🏗 プロジェクト構成](docs/PROJECT_STRUCTURE.md)
- [💻 技術スタック詳細](docs/architecture/tech-stack.md)
- **開発ツール**: golangci-lint, Prettier, ESLint, pre-commit hooks

## 🚀 開発環境セットアップ

### 必要な環境
- Docker & Docker Compose
- Node.js 18+
- Go 1.23+
- Python 3.8+ (pre-commit用)

### 初期セットアップ
```bash
# リポジトリクローン
git clone https://github.com/matsuokashuhei/morrow-II.git
cd morrow-II

# 開発環境セットアップ
make setup

# 開発環境起動
make dev
```

### 開発ツール使用方法

#### コード品質管理
```bash
# 全体のlint実行
make lint

# バックエンド（Go）のlint
make lint-backend

# フロントエンド（TypeScript）のlint
make lint-frontend

# コードフォーマット
make format

# テスト実行
make test

# プリコミット検証（フォーマット + lint + テスト）
make pre-commit
```

#### Pre-commit Hooks
プロジェクトでは以下のpre-commit hooksが設定されています：

**Go（バックエンド）**
- `go fmt`: コードフォーマット
- `go vet`: 静的解析
- `go mod tidy`: 依存関係整理
- `golangci-lint`: 包括的linting

**TypeScript（フロントエンド）**
- `prettier`: コードフォーマット
- `eslint`: linting + 自動修正
- `typescript`: 型チェック

**一般**
- ファイルサイズチェック（1MB以上禁止）
- YAML/JSON構文チェック
- Dockerfile lint
- シークレット検出

#### 手動でのlint実行
```bash
# Go
cd backend
go fmt ./...
go vet ./...
golangci-lint run

# TypeScript
cd frontend
npm run lint
npm run type-check
npm run format

# pre-commit（全体）
pre-commit run --all-files
```
- **コンテナ**: Docker
- **IaC**: Terraform/CDK
- **監視**: CloudWatch, Sentry

## 🚀 開発状況

### Phase 1: MVP開発 (2025/01-2025/04)
進捗: 6/13 完了 🚀

- [x] [#1] プロジェクト初期化とモノレポ構成設定 ✅ (2025/06/29完了)
- [x] [#2] 開発ツール・リンター設定 ✅ (2025/06/29完了)
- [x] [#3] Go + Gin APIサーバー基盤構築 ✅ (2025/06/29完了)
- [x] [#4] Ent スキーマ設計・実装 ✅ (2025/06/29完了)
- [x] [#5] PostgreSQL統合・データベース設定 ✅ (2025/06/30完了)
- [x] [#6] GraphQL API実装 ✅ (2025/07/06完了)
- [ ] [#7] React Nativeプロジェクト初期化
- [ ] [#8] 基本画面・コンポーネント実装
- [ ] [#9] GraphQLクライアント設定
- [ ] [#11] イベント作成機能実装
- [ ] [#12] イベント一覧・詳細表示機能
- [ ] [#13] イベント編集・削除機能
- [ ] [#14] イベント繰り返し機能実装

### マイルストーン
- 🎯 **MVP Release (Phase 1)**: 2025年4月30日
- 🎯 **Social Features (Phase 2)**: 2025年7月31日
- 🎯 **Premium Features (Phase 3)**: 2025年10月31日
- 🎯 **Web Launch (Phase 4)**: 2025年12月31日

## 📋 セットアップ

### 前提条件
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- PostgreSQL 15+
- GitHub CLI (オプション)

### 初期セットアップ

1. **リポジトリのクローン**
```bash
git clone https://github.com/matsuokashuhei/morrow-II.git
cd morrow-II
```

2. **GitHub Issueとラベルの設定** (オプション)
```bash
# GitHub CLIで認証
gh auth login

# 自動セットアップスクリプト実行
./scripts/setup-github.sh
```

3. **開発環境の構築**
```bash
# Docker環境の起動
docker-compose up -d

# バックエンド依存関係のインストール
cd backend && go mod download

# フロントエンド依存関係のインストール
cd frontend && npm install
```

### 開発サーバーの起動

#### Docker環境での起動（推奨）
```bash
# 全サービスを一括起動
docker-compose up --build

# 個別サービス起動
docker-compose up postgres -d        # データベースのみ
docker-compose up backend --build    # バックエンドのみ
docker-compose up frontend --build   # フロントエンドのみ

# Makefileを使用
make dev                             # 全サービス起動
make dev-backend                     # バックエンドのみ
make dev-frontend                    # フロントエンドのみ
```

#### アクセス先
- **Backend API**: http://localhost:8080
  - Health Check: http://localhost:8080/health
  - API Endpoints: http://localhost:8080/api/v1/*
- **Frontend (Metro Bundler)**: http://localhost:8081
- **Expo DevTools**: http://localhost:19000
- **PostgreSQL**: localhost:5432

#### ローカル環境での起動
```bash
# バックエンド (Port: 8080)
cd backend && go run cmd/server/main.go

# フロントエンド (React Native)
cd frontend && npm run ios # or npm run android

# フロントエンド (Web - Phase 4)
cd web && npm run dev
```

## 📖 ドキュメント

- [ドキュメント一覧](docs/README.md)
- [要件定義書](docs/planning/requirements.md)
- [技術選定書](docs/architecture/tech-stack.md)
- [開発アイテムリスト](docs/development/development-items.md)
- **[CI/CD 開発ルール](docs/development/ci-cd-rules.md)** - CI失敗を防ぐための必須ルール
- [Docker セットアップガイド](docs/development/docker-setup.md)
- [API ドキュメント](docs/api/README.md) (作成予定)
- [デプロイメントガイド](docs/deployment/README.md) (作成予定)

## 🤝 コントリビューション

1. **Issue の確認**: 作業前に関連するIssueを確認してください
2. **ブランチ作成**: `feature/issue-number-description` 形式でブランチを作成
3. **開発**: コーディング規約に従って実装
4. **テスト**: 適切なテストを追加・実行
5. **Pull Request**: テンプレートに従ってPRを作成

### コーディング規約
- **Go**: `gofmt`, `golangci-lint` を使用
- **TypeScript**: `Prettier`, `ESLint` を使用
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) 形式

## 📊 プロジェクト管理

- **Issues**: [GitHub Issues](https://github.com/matsuokashuhei/morrow-II/issues)
- **プロジェクトボード**: [GitHub Projects](https://github.com/matsuokashuhei/morrow-II/projects)
- **マイルストーン**: [GitHub Milestones](https://github.com/matsuokashuhei/morrow-II/milestones)

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 👥 チーム

- **Project Lead**: [@matsuokashuhei](https://github.com/matsuokashuhei)

## 📞 サポート

質問や問題がある場合は、以下の方法でお問い合わせください：

- [GitHub Issues](https://github.com/matsuokashuhei/morrow-II/issues) で新しいIssueを作成
- [GitHub Discussions](https://github.com/matsuokashuhei/morrow-II/discussions) で議論に参加

---

**作成日**: 2025年1月22日
**最終更新**: 2025年1月22日
**バージョン**: 1.0.0
