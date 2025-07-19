# Morrow - 開発アイテムリスト

## 📊 開発進捗サマリー（2025年7月13日時点）

### Phase 1: MVP開発 進捗状況 
**完了: 8/12 アイテム (67%)**

#### ✅ 完了済み (2025年6月-7月)
- **1.1 プロジェクト基盤・環境構築**: 100% 完了
- **1.2 バックエンドAPI基盤**: 100% 完了（Go+Gin, Ent ORM, PostgreSQL, GraphQL）
- **1.3 React Web基本アプリ**: 100% 完了（Vite+React+TypeScript, UI Components, GraphQL Client）
- **1.4 イベント作成機能**: 100% 完了（React Hook Form, Yup validation, GraphQL mutation）

#### 🔄 次のステップ
- **イベント一覧・詳細表示**: 計画中
- **イベント編集・削除**: 計画中

### 🏗️ 技術基盤の現在状況
- **バックエンド**: Go 1.22 + Gin + Ent ORM + PostgreSQL + GraphQL (gqlgen)
- **フロントエンド**: React + Vite + TypeScript + Tailwind CSS + Apollo Client
- **インフラ**: Docker Compose開発環境 + GitHub Actions CI/CD
- **テスト**: 169テスト通過（GraphQL: 65+テスト, UI Components: 24テスト）

## 概要
このドキュメントは、Morrowアプリの開発に必要な全てのアイテムを整理し、GitHub Issue管理の準備として作成されています。

## 📋 重要な開発ガイドライン
- **[CI/CD パイプライン開発ルール](./ci-cd-rules.md)** - CI失敗を防ぐための必須ルール集
- **[Docker セットアップガイド](./docker-setup.md)** - 開発環境構築手順

## 開発フェーズ構成

### Phase 1: MVP開発 (3-4ヶ月)
基本的なイベント管理機能とアプリの基盤構築

### Phase 2: ソーシャル機能 (2-3ヶ月)
ユーザー認証とイベント共有、チャット機能

### Phase 3: 拡張・最適化 (2-3ヶ月)
高度な機能とパフォーマンス最適化

### Phase 4: Web版展開 (2-3ヶ月)
Webアプリ開発とビジネス向け機能

---

## 📋 詳細な完了実績

### 最近の主要マイルストーン

#### PR #27 (2025/07/13): React Hook Form + Yup統合
- EventCreationFormにReact Hook Form導入
- Yup schema validationによる堅牢な入力検証
- アクセシビリティ改善（fieldset, legend使用）

#### PR #26 (2025/07/13): イベント作成機能完全実装
- 包括的なイベント作成フロー実装
- リアルタイムフォーム validation
- GraphQL mutation統合
- 完全なTypeScript型安全性

#### PR #25 (2025/07/13): GraphQLクライアント完全実装
- Apollo Client + GraphQL Code Generation
- 169テスト実装（65+ GraphQL専用テスト）
- 完全なCRUD操作（Users, Events, Participants）
- 包括的な技術文書作成

#### PR #24 (2025/07/13): React Web UI完全実装  
- 4段階オンボーディングフロー
- レスポンシブホーム画面（Hero, Features, Statistics）
- 完全なUIコンポーネントライブラリ
- SEO最適化 + PWA対応

#### PR #23 (2025/07/12): React Native → React移行完了
- .expo/ ディレクトリ削除
- 全ドキュメント React 対応更新
- フロントエンド構造文書新規作成
- 移行完了監査レポート作成

#### PR #20-#22 (2025/07/12): React移行と品質向上
- React Native から React + Vite への完全移行
- ESLint, Jest, TypeScript設定最適化
- bundle splitting とパフォーマンス最適化
- アクセシビリティ強化

#### PR #13 (2025/07/06): GraphQL API基盤完成
- gqlgen + Ent 統合
- 全CRUD操作リゾルバー実装
- GraphQL Playground 提供
- PostgreSQL完全対応

#### PR #11 (2025/06/29): PostgreSQL統合完了
- PostgreSQL 15.13 Docker設定
- Ent ORM自動マイグレーション  
- 包括的データベーステスト（21テスト通過）
- 詳細な技術文書整備

#### PR #4-#6, #9 (2025/06/29): 基盤構築完了
- Dockerモノレポ環境構築
- Go + Gin APIサーバー基盤
- Ent スキーマ設計・実装
- 開発ツール・リンター完全設定

---

## Phase 1: MVP開発アイテム

### 1.1 プロジェクト基盤・環境構築
- [x] **プロジェクト初期化** (#4 - 2025/06/29完了)
  - GitHub リポジトリ作成
  - モノレポ構成（Go API + React Web）
  - 開発環境Docker設定
  - CI/CD パイプライン基本設定

- [x] **開発ツール・リンター設定** (#5 - 2025/06/29完了)
  - Go: gofmt, golangci-lint
  - TypeScript: Prettier, ESLint
  - Pre-commit hooks設定
  - GitHub Actions基本ワークフロー

### 1.2 バックエンドAPI基盤
- [x] **Go + Gin APIサーバー基盤構築** (#6 - 2025/06/29完了)
  - プロジェクト構造設計
  - Gin ルーター設定
  - ミドルウェア設定（CORS, ログ, 認証）
  - ヘルスチェックエンドポイント

- [x] **Ent スキーマ設計・実装** (#9 - 2025/06/29完了)
  - Entプロジェクト初期化
  - ユーザーエンティティ定義
  - イベントエンティティ定義
  - 参加者関連エンティティ定義
  - リレーション設計

- [x] **データベース設定** (#11 - 2025/06/29完了)
  - PostgreSQL Docker設定
  - Ent Schema Code生成
  - Atlas マイグレーション設定
  - 初期データ投入スクリプト

- [x] **GraphQL API実装** (#13 - 2025/07/06完了)
  - gqlgen初期設定
  - entgql統合設定
  - GraphQLスキーマ自動生成
  - Resolver基本実装
  - GraphiQL Playground設定

### 1.3 React Web基本アプリ
- [x] **React Webプロジェクト初期化** (#20-#23 - 2025/07/12完了)
  - Vite + React プロジェクト設定
  - TypeScript設定
  - React Native → React Web完全移行
  - ESLint・Jest・TypeScript設定最適化

- [x] **基本画面・コンポーネント** (#24 - 2025/07/13完了)
  - オンボーディング画面（4段階フロー with progress indicator）
  - ホーム画面（Hero section, Feature showcase, Statistics）
  - 共通UIコンポーネント設計（Button, Card, Input, Modal, Steps）
  - テーマ・スタイル設定（Tailwind CSS + 完全レスポンシブ）
  - SEO最適化とPWA manifest設定

- [x] **コンポーネントライブラリ** (#24 - 2025/07/13完了)
  - UI Components: Button（variants, sizes, loading states）, Card（padding options）
  - Input components: 完全なアクセシビリティ対応
  - Modal: React portal + keyboard navigation
  - Steps: Progress indicator component
  - 完全なTypeScript型定義

- [x] **GraphQLクライアント設定** (#25 - 2025/07/13完了)
  - Apollo Client設定
  - GraphQL Code Generation設定
  - TypeScript型定義自動生成
  - 169テスト通過の包括的テストスイート実装
  - 完全なCRUD操作（Users, Events, Participants）

### 1.4 基本的なイベント管理機能
- [x] **イベント作成機能** (#26-#27 - 2025/07/13完了)
  - イベント作成フォーム（React Hook Form + Yup validation）
  - 日時選択UI（開始・終了時刻、過去日時バリデーション）
  - 包括的バリデーション実装（タイトル、説明、絵文字、公開設定）
  - GraphQL mutation実装（CreateEvent mutation）
  - エラーハンドリングとローディング状態管理

- [ ] **イベント一覧・詳細表示**
  - イベント一覧画面
  - イベント詳細画面
  - カウントダウン表示機能
  - 検索・フィルタリング基本機能

- [ ] **イベント編集・削除**
  - イベント編集フォーム
  - 削除確認ダイアログ
  - 楽観的UI更新
  - エラーハンドリング

---

## Phase 2: ソーシャル機能アイテム

### 2.1 ユーザー認証システム
- [ ] **Amazon Cognito設定**
  - Cognitoユーザープール作成
  - ソーシャルログイン設定（Google, Apple）
  - JWT トークン検証実装
  - 認証ミドルウェア実装

- [ ] **認証フロー実装**
  - ログイン画面
  - 新規登録画面
  - ソーシャルログインボタン
  - ログアウト機能
  - 認証状態管理

- [ ] **ユーザープロフィール**
  - プロフィール表示・編集画面
  - アバター画像アップロード
  - ユーザー設定管理
  - プライバシー設定

### 2.2 イベント共有機能
- [ ] **イベント共有機能**
  - 共有リンク生成
  - QRコード生成・スキャン
  - 招待コード機能
  - 共有先制限設定

- [ ] **参加者管理**
  - 参加申請・承認システム
  - 参加者一覧表示
  - 参加者権限管理
  - 通知設定

- [ ] **グループ機能**
  - グループ作成・管理
  - グループメンバー管理
  - グループ内イベント共有
  - グループ権限設定

### 2.3 リアルタイム通信・チャット
- [ ] **SSE基盤実装**
  - Go SSE サーバー実装
  - SSE クライアント実装
  - 接続状態管理
  - 再接続機能

- [ ] **チャット機能**
  - チャット画面UI
  - メッセージ送信・受信
  - リアルタイムメッセージ表示
  - メッセージ履歴取得

- [ ] **DynamoDB チャット設計**
  - DynamoDBテーブル設計
  - メッセージ保存・取得
  - 既読状態管理
  - メッセージ削除機能

### 2.4 プッシュ通知
- [ ] **FCM設定・実装**
  - Firebase プロジェクト設定
  - デバイストークン管理
  - 通知送信API実装
  - 通知受信処理

- [ ] **通知機能**
  - イベント開始通知
  - チャットメッセージ通知
  - 参加申請通知
  - 通知設定管理

---

## Phase 3: 拡張・最適化アイテム

### 3.1 高度なチャット機能
- [ ] **チャット機能拡張**
  - 画像・ファイル共有
  - リアクション機能
  - 返信機能
  - メッセージ検索

- [ ] **S3ファイルアップロード**
  - 画像アップロード機能
  - ファイルサイズ制限
  - 画像圧縮・リサイズ
  - プレビュー機能

### 3.2 課金システム
- [ ] **課金プラン設計**
  - プレミアムプラン機能定義
  - 制限機能実装
  - プラン比較画面

- [ ] **決済システム統合**
  - App Store Connect統合
  - Google Play Billing統合
  - Stripe Web決済統合
  - 課金状態管理

### 3.3 パフォーマンス最適化
- [ ] **データベース最適化**
  - インデックス最適化
  - クエリパフォーマンス改善
  - Read Replica設定
  - 接続プーリング

- [ ] **API最適化**
  - レスポンス圧縮
  - キャッシュ戦略実装
  - バッチ処理最適化
  - レート制限実装

- [ ] **フロントエンド最適化**
  - Code Splitting実装
  - Lazy Loading実装
  - 画像最適化
  - バンドルサイズ最適化

### 3.4 テスト強化
- [ ] **バックエンドテスト**
  - Unit テスト拡充
  - Integration テスト
  - GraphQL API テスト
  - パフォーマンステスト

- [ ] **フロントエンドテスト**
  - Unit テスト（Jest）
  - Component テスト（React Testing Library）
  - E2E テスト（Detox）
  - 自動スクリーンショットテスト

---

## Phase 4: Web版展開アイテム

### 4.1 React Webアプリ開発
- [ ] **Webアプリ基盤構築**
  - React + Vite プロジェクト作成
  - TypeScript設定
  - Tailwind CSS設定
  - 共通コンポーネント移植

- [ ] **Webアプリ機能実装**
  - レスポンシブデザイン対応
  - Web専用機能実装
  - PWA対応
  - SEO最適化

### 4.2 ビジネス向け機能
- [ ] **管理者ダッシュボード**
  - 統計・分析画面
  - ユーザー管理
  - イベント管理
  - システム設定

- [ ] **ビジネス機能**
  - 企業向けプラン
  - チーム管理機能
  - 高度な権限管理
  - API提供

### 4.3 本格運用準備
- [ ] **インフラ本格設定**
  - AWS ECS本番環境構築
  - Auto Scaling設定
  - 監視・アラート設定
  - バックアップ戦略

- [ ] **運用・保守体制**
  - ログ監視システム
  - エラートラッキング（Sentry）
  - パフォーマンス監視
  - セキュリティ監査

---

## 横断的な継続アイテム

### セキュリティ・コンプライアンス
- [ ] **セキュリティ対策**
  - OWASP対応
  - セキュリティテスト
  - 脆弱性スキャン
  - ペネトレーションテスト

- [ ] **プライバシー対応**
  - GDPR対応
  - 個人情報保護法対応
  - プライバシーポリシー
  - 利用規約

### ドキュメント・運用
- [ ] **ドキュメント整備**
  - API ドキュメント
  - 運用マニュアル
  - 開発者ガイド
  - ユーザーマニュアル

- [ ] **品質管理**
  - コードレビュープロセス
  - 品質メトリクス設定
  - 自動化テストの拡充
  - リリースプロセス確立

---

## GitHub Issue管理方針

### ラベル設計
- **フェーズ**: `phase-1`, `phase-2`, `phase-3`, `phase-4`
- **カテゴリ**: `backend`, `frontend`, `infrastructure`, `documentation`
- **優先度**: `priority-high`, `priority-medium`, `priority-low`
- **サイズ**: `size-xs`, `size-s`, `size-m`, `size-l`, `size-xl`
- **ステータス**: `status-todo`, `status-in-progress`, `status-review`, `status-done`

### マイルストーン設定
- **MVP Release (Phase 1)**
- **Social Features (Phase 2)**
- **Premium Features (Phase 3)**
- **Web Launch (Phase 4)**

### アサイン戦略
- 各Issueに担当者をアサイン
- ペアプログラミング項目の明示
- レビュー担当者の指定

---

**作成日**: 2025年6月22日  
**最終更新**: 2025年7月13日  
**バージョン**: 2.0  
**現在の進捗**: Phase 1 MVP開発 67% 完了 (8/12 アイテム)  
**次のアクション**: イベント一覧・詳細表示機能の実装開始
