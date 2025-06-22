# Morrow - 生活イベントカウントダウン共有アプリ

![Morrow Logo](docs/images/logo.png)

**Morrow**は、重要な生活イベントのカウントダウンを友人や家族と共有できるモバイルアプリケーションです。誕生日、記念日、イベント開催日など、大切な日までの時間を美しく表示し、リアルタイムでチャットしながら一緒に待つことができます。

## 📱 主な機能

### Phase 1: MVP機能
- ✅ イベント作成・編集・削除
- ✅ リアルタイムカウントダウン表示
- ✅ 基本的なイベント管理

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
- **言語**: Go 1.21+
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
- **コンテナ**: Docker
- **IaC**: Terraform/CDK
- **監視**: CloudWatch, Sentry

## 🚀 開発状況

### Phase 1: MVP開発 (2025/01-2025/04)
進捗: 0/12 完了

- [ ] [#1] プロジェクト初期化とモノレポ構成設定
- [ ] [#2] 開発ツール・リンター設定
- [ ] [#3] Go + Gin APIサーバー基盤構築
- [ ] [#4] Ent スキーマ設計・実装
- [ ] [#5] PostgreSQLデータベース設定
- [ ] [#6] GraphQL API実装
- [ ] [#7] React Nativeプロジェクト初期化
- [ ] [#8] 基本画面・コンポーネント実装
- [ ] [#9] GraphQLクライアント設定
- [ ] [#10] イベント作成機能実装
- [ ] [#11] イベント一覧・詳細表示機能
- [ ] [#12] イベント編集・削除機能

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

```bash
# バックエンド (Port: 8080)
cd backend && go run main.go

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
