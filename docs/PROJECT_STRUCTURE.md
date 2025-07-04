# Morrow プロジェクト構成

```
morrow-II/
├── README.md                          # プロジェクト概要・進捗管理
├──
├── .github/                           # GitHub設定
│   ├── ISSUE_TEMPLATE/               # Issueテンプレート
│   │   ├── feature.md
│   │   ├── bug_report.md
│   │   ├── infrastructure.md
│   │   └── documentation.md
│   ├── workflows/                    # GitHub Actions
│   │   ├── ci-cd.yml
│   │   └── label-sync.yml
│   ├── labels.yml                    # ラベル定義
│   └── pull_request_template.md      # PRテンプレート
│
├── docs/                             # ドキュメント
│   ├── README.md                     # ドキュメント一覧
│   ├── planning/                     # 企画・要件定義
│   │   └── requirements.md
│   ├── architecture/                 # 技術選定・設計
│   │   └── tech-stack.md
│   └── development/                  # 開発プロセス
│       ├── development-items.md
│       └── github-issues-data.md
│
├── scripts/                          # 自動化スクリプト
│   └── setup-github.sh
│
├── backend/                          # Go APIサーバー ✅
│   ├── cmd/
│   │   ├── server/                   # メインアプリケーション
│   │   │   └── main.go
│   │   └── test-ent/                 # Entテスト用
│   │       └── main.go
│   ├── internal/                     # 内部パッケージ
│   │   ├── config/                   # 設定管理 ✅
│   │   │   ├── config.go
│   │   │   └── config_test.go
│   │   ├── database/                 # データベース層 ✅
│   │   │   └── database.go
│   │   ├── handler/                  # HTTPハンドラー ✅
│   │   │   ├── health.go
│   │   │   └── health_test.go
│   │   ├── middleware/               # ミドルウェア ✅
│   │   │   ├── auth.go
│   │   │   ├── auth_test.go
│   │   │   ├── cors.go
│   │   │   ├── error.go
│   │   │   └── logger.go
│   │   └── routes/                   # ルーター設定 ✅
│   │       └── routes.go
│   ├── ent/                          # Ent ORM ✅
│   │   ├── client.go
│   │   ├── schema/                   # エンティティスキーマ
│   │   │   ├── user.go
│   │   │   ├── event.go
│   │   │   └── participant.go
│   │   └── [auto-generated files]
│   ├── graph/                        # GraphQL (将来対応)
│   ├── Dockerfile.dev                # 開発用Dockerfile ✅
│   ├── Dockerfile                    # 本番用Dockerfile ✅
│   ├── .air.toml                     # ホットリロード設定 ✅
│   ├── go.mod                        # Go モジュール ✅
│   └── go.sum                        # 依存関係チェックサム ✅
│
├── frontend/                         # React Nativeアプリ ✅
│   ├── src/
│   │   ├── __tests__/                # テストファイル ✅
│   │   │   ├── App.test.tsx
│   │   │   ├── basic.test.tsx
│   │   │   └── HomeScreen.test.tsx
│   │   ├── components/               # 共通コンポーネント
│   │   ├── hooks/                    # カスタムフック
│   │   ├── screens/                  # 画面コンポーネント ✅
│   │   │   └── HomeScreen.tsx
│   │   ├── store/                    # 状態管理
│   │   ├── types/                    # 型定義
│   │   └── utils/                    # ユーティリティ
│   ├── assets/                       # 静的リソース ✅
│   ├── coverage/                     # テストカバレッジ ✅
│   ├── Dockerfile.dev                # 開発用Dockerfile ✅
│   ├── Dockerfile                    # 本番用Dockerfile ✅
│   ├── package.json                  # 依存関係定義 ✅
│   ├── tsconfig.json                 # TypeScript設定 ✅
│   ├── jest.config.json              # Jest設定 ✅
│   ├── babel.config.js               # Babel設定 ✅
│   └── app.json                      # Expo設定 ✅
│
├── web/                              # React Webアプリ (Phase 4で作成予定)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── infrastructure/                   # インフラ設定 (作成予定)
│   ├── terraform/
│   ├── docker/
│   └── kubernetes/
│
└── docker-compose.yml               # 開発環境 (作成予定)
```

## 📁 ディレクトリの役割

### ルートディレクトリ
- **README.md**: プロジェクト全体の概要と進捗管理
- **docker-compose.yml**: ローカル開発環境の構成

### .github/
GitHub関連の設定ファイル
- **ISSUE_TEMPLATE/**: Issue作成時のテンプレート
- **workflows/**: GitHub Actionsの自動化ワークフロー
- **labels.yml**: リポジトリラベルの定義
- **pull_request_template.md**: PR作成時のテンプレート

### docs/
プロジェクトのすべてのドキュメント
- **planning/**: 要件定義・企画関連
- **architecture/**: 技術選定・アーキテクチャ設計
- **development/**: 開発プロセス・管理関連

### scripts/
自動化スクリプト
- **setup-github.sh**: GitHub リポジトリの初期設定自動化

### backend/
Go言語によるAPIサーバー (Phase 1で作成)
- **cmd/**: アプリケーションエントリーポイント
- **internal/**: 内部パッケージ
- **pkg/**: 外部から使用可能なパッケージ
- **ent/**: Entスキーマ・モデル
- **graph/**: GraphQLスキーマ・リゾルバ

### frontend/
React Nativeモバイルアプリ (Phase 1で作成)
- **src/**: ソースコード
- **__tests__/**: テストファイル
- **android/**: Android固有の設定
- **ios/**: iOS固有の設定

### web/
React Webアプリケーション (Phase 4で作成)
- **src/**: ソースコード
- **public/**: 静的ファイル

### infrastructure/
インフラストラクチャ設定 (Phase 1-2で作成)
- **terraform/**: Terraformによるインフラ定義
- **docker/**: Dockerファイル・設定
- **kubernetes/**: Kubernetes設定 (将来的に)

## 🔄 開発フローでの使用方法

### Phase 1: MVP開発
1. `backend/` - Go APIサーバー基盤構築
2. `frontend/` - React Native基本アプリ
3. `infrastructure/docker/` - 開発環境構築

### Phase 2: ソーシャル機能
1. `backend/` - 認証・チャット機能追加
2. `frontend/` - ソーシャル機能UI実装
3. `infrastructure/terraform/` - AWS本番環境構築

### Phase 3: 拡張・最適化
1. `backend/` - 高度な機能・最適化
2. `frontend/` - プレミアム機能・最適化

### Phase 4: Web展開
1. `web/` - React Webアプリ開発
2. `docs/` - API・ユーザードキュメント充実

---

**作成日**: 2025年1月22日
**最終更新**: 2025年1月22日
