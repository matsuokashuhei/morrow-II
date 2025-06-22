# GitHub Issue一括作成用データ

このファイルは、development-items.mdをもとにGitHub Issueを一括作成するためのデータです。

## Phase 1: MVP開発 - 優先Issue

### プロジェクト基盤・環境構築

#### 1. プロジェクト初期化
- **Title**: [PHASE-1] プロジェクト初期化とモノレポ構成設定
- **Labels**: phase-1, infrastructure, priority-high, size-m
- **Body**:
```
## 概要
Morrowアプリのプロジェクト初期化とモノレポ構成を設定します。

## 詳細仕様
- [ ] GitHub リポジトリ作成・設定
- [ ] モノレポ構成（Go API + React Native）
- [ ] 開発環境Docker設定
- [ ] CI/CD パイプライン基本設定

## 技術仕様
- **使用技術**: Docker, Docker Compose, GitHub Actions
- **実装ファイル**: docker-compose.yml, Dockerfile, .github/workflows/
- **依存関係**: なし

## 設計考慮事項
- [ ] 開発環境の統一
- [ ] CI/CDパイプラインの基本設計
- [ ] セキュリティ設定

## 受け入れ条件
- [ ] ローカル開発環境がDockerで動作する
- [ ] 基本的なCI/CDが動作する
- [ ] モノレポ構成が適切に設定されている
- [ ] READMEが整備されている

## 見積り
- **作業時間**: 3人日
- **優先度**: High
```

#### 2. 開発ツール・リンター設定
- **Title**: [PHASE-1] 開発ツール・リンター設定
- **Labels**: phase-1, infrastructure, priority-high, size-s
- **Body**:
```
## 概要
Go・TypeScriptの開発ツールとコード品質管理ツールを設定します。

## 詳細仕様
- [ ] Go: gofmt, golangci-lint設定
- [ ] TypeScript: Prettier, ESLint設定
- [ ] Pre-commit hooks設定
- [ ] GitHub Actions基本ワークフロー

## 技術仕様
- **使用技術**: golangci-lint, Prettier, ESLint, husky
- **実装ファイル**: .golangci.yml, .prettierrc, .eslintrc.js, .pre-commit-config.yaml
- **依存関係**: #1 (プロジェクト初期化)

## 見積り
- **作業時間**: 2人日
- **優先度**: High
```

### バックエンドAPI基盤

#### 3. Go + Gin APIサーバー基盤構築
- **Title**: [PHASE-1] Go + Gin APIサーバー基盤構築
- **Labels**: phase-1, backend, priority-high, size-l
- **Body**:
```
## 概要
Go + GinによるAPIサーバーの基盤を構築します。

## 詳細仕様
- [ ] プロジェクト構造設計
- [ ] Gin ルーター設定
- [ ] ミドルウェア設定（CORS, ログ, 認証）
- [ ] ヘルスチェックエンドポイント

## 技術仕様
- **使用技術**: Go, Gin, logrus
- **実装ファイル**: main.go, routes/, middleware/, handlers/
- **依存関係**: #1 (プロジェクト初期化)

## 見積り
- **作業時間**: 4人日
- **優先度**: High
```

#### 4. Ent スキーマ設計・実装
- **Title**: [PHASE-1] Ent スキーマ設計・実装
- **Labels**: phase-1, backend, priority-high, size-l
- **Body**:
```
## 概要
EntによるORMスキーマの設計と実装を行います。

## 詳細仕様
- [ ] Entプロジェクト初期化
- [ ] ユーザーエンティティ定義
- [ ] イベントエンティティ定義
- [ ] 参加者関連エンティティ定義
- [ ] リレーション設計

## 技術仕様
- **使用技術**: Ent, PostgreSQL
- **実装ファイル**: ent/schema/, ent/migrate/
- **依存関係**: #3 (Go APIサーバー基盤)

## 見積り
- **作業時間**: 5人日
- **優先度**: High
```

#### 5. データベース設定
- **Title**: [PHASE-1] PostgreSQLデータベース設定
- **Labels**: phase-1, infrastructure, priority-high, size-m
- **Body**:
```
## 概要
PostgreSQLデータベースの設定とマイグレーション環境を構築します。

## 詳細仕様
- [ ] PostgreSQL Docker設定
- [ ] Ent Schema Code生成
- [ ] Atlas マイグレーション設定
- [ ] 初期データ投入スクリプト

## 技術仕様
- **使用技術**: PostgreSQL, Atlas, Docker
- **実装ファイル**: docker-compose.yml, migrations/, seeds/
- **依存関係**: #4 (Entスキーマ実装)

## 見積り
- **作業時間**: 3人日
- **優先度**: High
```

#### 6. GraphQL API実装
- **Title**: [PHASE-1] GraphQL API実装
- **Labels**: phase-1, backend, priority-high, size-l
- **Body**:
```
## 概要
gqlgenとentgqlを使ったGraphQL APIを実装します。

## 詳細仕様
- [ ] gqlgen初期設定
- [ ] entgql統合設定
- [ ] GraphQLスキーマ自動生成
- [ ] Resolver基本実装
- [ ] GraphiQL Playground設定

## 技術仕様
- **使用技術**: gqlgen, entgql
- **実装ファイル**: gqlgen.yml, graph/, resolvers/
- **依存関係**: #4 (Entスキーマ実装)

## 見積り
- **作業時間**: 5人日
- **優先度**: High
```

### React Native基本アプリ

#### 7. React Nativeプロジェクト初期化
- **Title**: [PHASE-1] React Nativeプロジェクト初期化
- **Labels**: phase-1, frontend, priority-high, size-m
- **Body**:
```
## 概要
React Nativeアプリの基盤を構築します。

## 詳細仕様
- [ ] Expo/React Native CLI決定・設定
- [ ] TypeScript設定
- [ ] ナビゲーション設定（React Navigation）
- [ ] 状態管理設定（Zustand）

## 技術仕様
- **使用技術**: React Native, TypeScript, React Navigation, Zustand
- **実装ファイル**: app.json, tsconfig.json, src/navigation/, src/stores/
- **依存関係**: #1 (プロジェクト初期化)

## 見積り
- **作業時間**: 4人日
- **優先度**: High
```

#### 8. 基本画面・コンポーネント
- **Title**: [PHASE-1] 基本画面・コンポーネント実装
- **Labels**: phase-1, frontend, priority-medium, size-l
- **Body**:
```
## 概要
基本的な画面とUIコンポーネントを実装します。

## 詳細仕様
- [ ] スプラッシュ画面
- [ ] オンボーディング画面
- [ ] ホーム画面レイアウト
- [ ] 共通UIコンポーネント設計
- [ ] テーマ・スタイル設定

## 技術仕様
- **使用技術**: React Native, Styled Components / React Native Elements
- **実装ファイル**: src/screens/, src/components/, src/theme/
- **依存関係**: #7 (React Native初期化)

## 見積り
- **作業時間**: 6人日
- **優先度**: Medium
```

#### 9. GraphQLクライアント設定
- **Title**: [PHASE-1] GraphQLクライアント設定
- **Labels**: phase-1, frontend, priority-high, size-m
- **Body**:
```
## 概要
React NativeアプリでGraphQL APIを使用するためのクライアント設定を行います。

## 詳細仕様
- [ ] Apollo Client設定
- [ ] GraphQL Code Generation設定
- [ ] TypeScript型定義自動生成
- [ ] 基本クエリ・ミューテーション実装

## 技術仕様
- **使用技術**: Apollo Client, GraphQL Code Generator
- **実装ファイル**: src/apollo/, codegen.yml, src/generated/
- **依存関係**: #6 (GraphQL API実装), #7 (React Native初期化)

## 見積り
- **作業時間**: 3人日
- **優先度**: High
```

### 基本的なイベント管理機能

#### 10. イベント作成機能
- **Title**: [PHASE-1] イベント作成機能実装
- **Labels**: phase-1, frontend, backend, priority-high, size-l
- **Body**:
```
## 概要
イベント作成機能をフロントエンド・バックエンド両方で実装します。

## 詳細仕様
- [ ] イベント作成フォーム
- [ ] 日時選択UI
- [ ] バリデーション実装
- [ ] GraphQL mutation実装

## 技術仕様
- **使用技術**: React Native, Go, GraphQL
- **実装ファイル**: src/screens/CreateEvent/, graph/resolvers/event.go
- **依存関係**: #6 (GraphQL API), #9 (GraphQLクライアント)

## 見積り
- **作業時間**: 5人日
- **優先度**: High
```

#### 11. イベント一覧・詳細表示
- **Title**: [PHASE-1] イベント一覧・詳細表示機能
- **Labels**: phase-1, frontend, backend, priority-high, size-l
- **Body**:
```
## 概要
イベントの一覧表示と詳細表示機能を実装します。

## 詳細仕様
- [ ] イベント一覧画面
- [ ] イベント詳細画面
- [ ] カウントダウン表示機能
- [ ] 検索・フィルタリング基本機能

## 技術仕様
- **使用技術**: React Native, Go, GraphQL
- **実装ファイル**: src/screens/EventList/, src/screens/EventDetail/
- **依存関係**: #6 (GraphQL API), #9 (GraphQLクライアント)

## 見積り
- **作業時間**: 6人日
- **優先度**: High
```

#### 12. イベント編集・削除
- **Title**: [PHASE-1] イベント編集・削除機能
- **Labels**: phase-1, frontend, backend, priority-medium, size-m
- **Body**:
```
## 概要
イベントの編集・削除機能を実装します。

## 詳細仕様
- [ ] イベント編集フォーム
- [ ] 削除確認ダイアログ
- [ ] 楽観的UI更新
- [ ] エラーハンドリング

## 技術仕様
- **使用技術**: React Native, Go, GraphQL
- **実装ファイル**: src/screens/EditEvent/, graph/resolvers/event.go
- **依存関係**: #10 (イベント作成), #11 (イベント一覧・詳細)

## 見積り
- **作業時間**: 4人日
- **優先度**: Medium
```

## 作成方法

上記のIssueデータを使用して、以下の手順でGitHub Issueを作成してください：

1. GitHubリポジトリにアクセス
2. 「Issues」タブを選択
3. 「New Issue」をクリック
4. 適切なテンプレートを選択
5. 上記のTitle、Labels、Bodyを設定
6. Assignee、Milestone、Projectsを必要に応じて設定

## ラベル作成

事前に以下のラベルをGitHubリポジトリに作成してください：

### フェーズラベル
- `phase-1` (色: #0366d6)
- `phase-2` (色: #28a745)
- `phase-3` (色: #ffd33d)
- `phase-4` (色: #f66a0a)

### カテゴリラベル
- `backend` (色: #d73a4a)
- `frontend` (色: #0075ca)
- `infrastructure` (色: #cfd3d7)
- `documentation` (色: #7057ff)

### 優先度ラベル
- `priority-high` (色: #d93f0b)
- `priority-medium` (色: #fbca04)
- `priority-low` (色: #0e8a16)

### サイズラベル
- `size-xs` (色: #c2e0c6)
- `size-s` (色: #bfd4f2)
- `size-m` (色: #f9d0c4)
- `size-l` (色: #fef2c0)
- `size-xl` (色: #f1c6c7)

### ステータスラベル
- `status-todo` (色: #ffffff)
- `status-in-progress` (色: #fbca04)
- `status-review` (色: #0075ca)
- `status-done` (色: #0e8a16)
