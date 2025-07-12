# 🏗️ Morrow プロジェクト構造

## 📁 プロジェクト全体構成

```
morrow-II/
├── 📄 README.md                      # プロジェクト概要・進捗管理
├── 📄 docker-compose.yml             # 開発環境Docker構成
├── 📄 docker-compose.prod.yml        # 本番環境Docker構成
├── 📄 Makefile                       # 開発タスク自動化
├── 📄 codecov.yml                    # テストカバレッジ設定
├── 📄 .github/                       # GitHub設定
│   ├── workflows/                     # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/               # Issueテンプレート
│   └── pull_request_template.md      # PRテンプレート
├── 📁 docs/                          # 📖 ドキュメント
├── 📁 backend/                       # 🔧 Go APIサーバー
├── 📁 frontend/                      # 🌐 React Webアプリ
├── 📁 infrastructure/                # ☁️ インフラ設定
└── 📁 scripts/                       # 🛠️ 自動化スクリプト
```

## 🔧 バックエンド構成（Go + Gin）

```
backend/
├── 📁 cmd/                           # アプリケーションエントリーポイント
│   ├── server/                       # メインサーバー
│   │   └── main.go                   # サーバー起動処理
│   └── test-ent/                     # Entテスト用ツール
│       └── main.go                   # テストデータ生成
├── 📁 internal/                      # 内部パッケージ（外部import不可）
│   ├── config/                       # 設定管理
│   │   ├── config.go                 # 設定構造体・読み込み
│   │   └── config_test.go            # 設定テスト
│   ├── database/                     # データベース層
│   │   └── database.go               # DB接続・管理
│   ├── handler/                      # HTTPハンドラー
│   │   ├── health.go                 # ヘルスチェック
│   │   └── health_test.go            # ヘルスチェックテスト
│   ├── middleware/                   # HTTPミドルウェア
│   │   ├── auth.go                   # 認証ミドルウェア
│   │   ├── auth_test.go              # 認証テスト
│   │   ├── cors.go                   # CORS設定
│   │   ├── database.go               # DB注入ミドルウェア
│   │   ├── error.go                  # エラーハンドリング
│   │   └── logger.go                 # ログ記録
│   └── routes/                       # ルーター設定
│       └── routes.go                 # エンドポイント定義
├── 📁 ent/                           # Ent ORM（自動生成）
│   ├── client.go                     # Entクライアント
│   ├── schema/                       # エンティティスキーマ
│   │   ├── user.go                   # ユーザーエンティティ
│   │   ├── event.go                  # イベントエンティティ
│   │   └── participant.go            # 参加者エンティティ
│   ├── migrate/                      # DBマイグレーション
│   └── [auto-generated files]        # 自動生成ファイル
├── 📁 graph/                         # GraphQL（将来実装）
│   ├── schema.graphqls               # GraphQLスキーマ
│   ├── resolver.go                   # リゾルバー
│   └── model/                        # GraphQLモデル
├── 📁 pkg/                           # 公開パッケージ
├── 📁 tmp/                           # 一時ファイル
├── 📄 go.mod                         # Go モジュール定義
├── 📄 go.sum                         # 依存関係チェックサム
├── 📄 Dockerfile.dev                 # 開発用Dockerfile
├── 📄 Dockerfile                     # 本番用Dockerfile
├── 📄 .air.toml                      # ホットリロード設定
└── 📄 gqlgen.yml                     # GraphQL生成設定
```

## 🌐 フロントエンド構成（React + Vite）

```
frontend/
├── 📁 src/                           # ソースコード
│   ├── __tests__/                    # テストファイル
│   │   ├── App.test.tsx              # Appコンポーネントテスト
│   │   ├── basic.test.tsx            # 基本機能テスト
│   │   └── HomeScreen.test.tsx       # ホーム画面テスト
│   ├── components/                   # 再利用可能コンポーネント
│   │   ├── common/                   # 共通コンポーネント
│   │   ├── forms/                    # フォーム関連
│   │   └── ui/                       # UI コンポーネント
│   ├── screens/                      # 画面コンポーネント
│   │   ├── HomeScreen.tsx            # ホーム画面
│   │   ├── EventScreen.tsx           # イベント詳細画面
│   │   └── ProfileScreen.tsx         # プロフィール画面
│   ├── hooks/                        # カスタムフック
│   │   ├── useAuth.ts                # 認証フック
│   │   ├── useEvents.ts              # イベント管理フック
│   │   └── useCountdown.ts           # カウントダウンフック
│   ├── store/                        # 状態管理（Zustand）
│   │   ├── index.ts                  # ストア設定
│   │   ├── authSlice.ts              # 認証状態
│   │   └── eventSlice.ts             # イベント状態
│   ├── types/                        # TypeScript型定義
│   │   ├── auth.ts                   # 認証関連型
│   │   ├── event.ts                  # イベント関連型
│   │   └── api.ts                    # API関連型
│   ├── utils/                        # ユーティリティ
│   │   ├── api.ts                    # API クライアント
│   │   ├── auth.ts                   # 認証ユーティリティ
│   │   └── formatting.ts             # データフォーマット
│   ├── styles/                       # スタイル設定
│   │   └── globals.css               # グローバルスタイル
│   ├── main.tsx                      # アプリケーションエントリーポイント
│   └── App.tsx                       # ルートコンポーネント
├── 📁 public/                        # 静的ファイル
│   ├── index.html                    # HTMLテンプレート
│   └── favicon.ico                   # ファビコン
├── 📄 package.json                   # Node.js依存関係
├── 📄 package-lock.json              # 依存関係ロック
├── 📄 vite.config.ts                 # Vite設定
├── 📄 tailwind.config.js             # Tailwind CSS設定
├── 📄 postcss.config.js              # PostCSS設定
├── 📄 tsconfig.json                  # TypeScript設定
├── 📄 tsconfig.node.json             # Node.js用TypeScript設定
├── 📄 jest.config.json               # Jest設定
├── 📄 jest.setup.ts                  # Jestセットアップ
├── 📄 Dockerfile.dev                 # 開発用Dockerfile
├── 📄 Dockerfile                     # 本番用Dockerfile
└── 📄 .eslintrc.json                 # ESLint設定
```

### 技術選定詳細

#### ビルドツール: Vite
- **高速な開発サーバー**: ES modules による即座の起動
- **効率的なHMR**: 変更の即座反映
- **最適化されたビルド**: Rollup による本番最適化

#### スタイリング: Tailwind CSS
- **ユーティリティファースト**: 迅速なUI開発
- **レスポンシブデザイン**: モバイル対応の簡素化
- **設定可能**: カスタムデザインシステム

#### ルーティング: React Router
- **SPA ルーティング**: クライアントサイドナビゲーション
- **ネストされたルート**: 複雑なUI構造に対応
- **コード分割**: 遅延読み込み対応

#### 状態管理: Zustand
- **軽量**: 最小限のボイラープレート
- **TypeScript対応**: 完全な型安全性
- **シンプルAPI**: 学習コストの低減
│   ├── utils/                        # ユーティリティ
│   │   ├── api.ts                    # API通信
│   │   ├── date.ts                   # 日付処理
│   │   └── validation.ts             # バリデーション
│   └── constants/                    # 定数定義
│       ├── colors.ts                 # カラーパレット
│       └── config.ts                 # 設定定数
├── 📁 assets/                        # 静的リソース
│   ├── images/                       # 画像ファイル
│   ├── fonts/                        # フォントファイル
│   └── icons/                        # アイコンファイル
├── 📁 coverage/                      # テストカバレッジ
├── 📄 App.tsx                        # アプリケーションルート
├── 📄 package.json                   # Node.js依存関係
├── 📄 tsconfig.json                  # TypeScript設定
├── 📄 jest.config.json               # Jest設定
├── 📄 babel.config.js                # Babel設定
├── 📄 app.json                       # Expo設定
├── 📄 Dockerfile.dev                 # 開発用Dockerfile
└── 📄 Dockerfile                     # 本番用Dockerfile
```

## 📖 ドキュメント構成

```
docs/
├── 📄 README.md                      # ドキュメントハブ
├── 📁 01-overview/                   # プロジェクト概要
│   ├── project-overview.md           # プロジェクト概要
│   └── project-structure.md          # 構造説明（本ファイル）
├── 📁 02-getting-started/            # 開発開始ガイド
│   ├── development-setup.md          # 開発環境構築
│   ├── development-workflow.md       # 開発ワークフロー
│   ├── development-guidelines.md     # 開発ガイドライン
│   └── troubleshooting.md            # トラブルシューティング
├── 📁 03-api/                        # API仕様書
│   ├── README.md                     # API概要
│   ├── graphql-schema.md             # GraphQLスキーマ
│   └── rest-endpoints.md             # RESTエンドポイント
├── 📁 04-architecture/               # アーキテクチャ設計
│   ├── README.md                     # アーキテクチャ概要
│   ├── tech-stack.md                 # 技術選定
│   ├── system-design.md              # システム設計
│   └── database-design.md            # データベース設計
├── 📁 05-planning/                   # プロジェクト計画
│   ├── README.md                     # 計画概要
│   ├── requirements.md               # 要件定義
│   ├── development-plan.md           # 開発計画
│   └── roadmap.md                    # ロードマップ
├── 📁 06-deployment/                 # デプロイメント
│   ├── README.md                     # デプロイメント概要
│   ├── ci-cd.md                      # CI/CDパイプライン
│   ├── infrastructure.md             # インフラ構成
│   └── monitoring.md                 # 監視・運用
└── 📁 07-appendix/                   # 付録
    ├── glossary.md                   # 用語集
    ├── references.md                 # 参考資料
    └── changelog.md                  # 変更履歴
```

## 🛠️ 開発ツール構成

### コード品質管理
```
├── 📄 .golangci.yml                  # Go linter設定
├── 📄 .prettierrc                    # Prettier設定
├── 📄 .eslintrc.json                 # ESLint設定
├── 📄 .pre-commit-config.yaml        # Pre-commit hooks
└── 📄 .gitignore                     # Git除外設定
```

### CI/CD パイプライン
```
.github/
├── workflows/
│   ├── ci-cd.yml                     # メインCI/CDワークフロー
│   ├── backend-test.yml              # バックエンドテスト
│   ├── frontend-test.yml             # フロントエンドテスト
│   └── deployment.yml                # デプロイメント
├── ISSUE_TEMPLATE/                   # GitHub Issueテンプレート
│   ├── feature.md                    # 機能追加
│   ├── bug_report.md                 # バグ報告
│   ├── infrastructure.md             # インフラ関連
│   └── documentation.md              # ドキュメント
└── pull_request_template.md          # PR テンプレート
```

## 🎯 アーキテクチャ原則

### 1. 関心の分離
- **フロントエンド**: UI/UX とユーザー体験
- **バックエンド**: ビジネスロジックとデータ管理
- **インフラ**: 実行環境とリソース管理

### 2. 単一責任原則
- **各モジュール**: 明確で単一の責任
- **各ファイル**: 特定の機能に集中
- **各関数**: 一つの明確な目的

### 3. 依存関係の管理
- **内部パッケージ**: 外部からの直接アクセス禁止
- **インターフェース**: 実装の詳細を隠蔽
- **依存性注入**: テスタビリティとメンテナンス性向上

### 4. テスタビリティ
- **単体テスト**: 各機能の独立したテスト
- **統合テスト**: コンポーネント間の連携テスト
- **E2Eテスト**: ユーザー体験の全体テスト

## 🔄 開発フロー

### 1. 機能開発
```
feature/new-feature → develop → main
```

### 2. バグ修正
```
hotfix/bug-fix → main
```

### 3. リリース
```
release/v1.0.0 → main → tag v1.0.0
```

## 📊 品質指標

### コード品質
- **テストカバレッジ**: 80%以上
- **Linter警告**: 0件
- **型安全性**: TypeScript strict モード

### パフォーマンス
- **API応答時間**: 200ms以下
- **アプリ起動時間**: 3秒以下
- **メモリ使用量**: 適切なレベル

### 保守性
- **コードの可読性**: 明確な命名と構造
- **ドキュメント**: 包括的で最新の情報
- **依存関係**: 最小限で管理された依存

---

**関連ドキュメント**:
- [プロジェクト概要](./project-overview.md)
- [開発環境構築](../02-getting-started/development-setup.md)
- [アーキテクチャ設計](../04-architecture/README.md)

**最終更新**: 2025年7月6日
