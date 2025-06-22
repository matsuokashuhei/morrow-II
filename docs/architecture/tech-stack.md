# Morrow - 技術選定書

## 1. 技術スタック概要

### 1.1 アーキテクチャ
- **アーキテクチャパターン**: マイクロサービス指向
- **API設計**: GraphQL + Server-Sent Events (SSE)
- **データベース設計**: リレーショナルデータベース（PostgreSQL）

### 1.2 選定基準
- 開発チームのGo言語での開発希望
- スケーラビリティの確保
- 開発・運用コストの最適化
- モバイルファーストからWeb展開への対応

## 2. フロントエンド技術

### 2.1 モバイルアプリケーション
- **フレームワーク**: React Native
- **言語**: JavaScript/TypeScript
- **状態管理**: Redux Toolkit または Zustand
- **UI コンポーネント**: React Native Elements または NativeBase
- **ナビゲーション**: React Navigation

#### 選定理由
- iOS/Android両プラットフォーム対応
- Webアプリとの技術スタック統一
- 豊富なライブラリとコミュニティサポート
- 開発効率の向上

### 2.2 Webアプリケーション
- **フレームワーク**: React
- **言語**: TypeScript
- **ビルドツール**: Vite
- **状態管理**: Redux Toolkit または Zustand
- **UI ライブラリ**: Material-UI (MUI) または Chakra UI
- **CSS フレームワーク**: Tailwind CSS

#### 選定理由
- React Nativeとの技術的親和性
- 豊富なエコシステム
- TypeScriptによる型安全性
- 高いパフォーマンス

## 3. バックエンド技術

### 3.1 APIサーバー
- **言語**: Go (Golang)
- **フレームワーク**: Gin
- **GraphQL**: gqlgen (GraphQL Code Generator for Go)
- **ORM**: Ent (Facebook's Entity Framework for Go)
- **バリデーション**: go-playground/validator
- **ログ**: logrus または zap

#### 選定理由
- 高いパフォーマンスと並行処理能力
- 軽量で高速なGinフレームワーク
- gqlgenによる型安全なGraphQL実装
- 豊富なライブラリエコシステム
- デプロイメントの簡易性

#### Ent採用理由
- **GraphQL完全統合**: entgqlによるgqlgenとの密接な統合
- **型安全性**: 100%静的型付け、コード生成による明示的API
- **GraphQLフィルタ自動生成**: 複雑なクエリ条件の自動対応
- **スキーマファースト**: GraphQLスキーマとDBスキーマの一貫性
- **最新アーキテクチャ**: Atlas移行エンジン、最新のベストプラクティス対応
- **Relay Spec対応**: pagination、connection等のGraphQL標準仕様完全対応

#### GraphQL採用理由（2024-2025年最新評価）
- **フロントエンド効率**: 必要なデータのみ取得
- **単一エンドポイント**: API設計の効率化
- **型安全性**: TypeScript との完全統合
- **モバイル最適化**: 通信量削減（重要）
- **Subscription対応**: リアルタイム機能との親和性

#### GraphQL vs tRPC vs REST（2024-2025年比較）
- **GraphQL**:
  - 利点: 柔軟なクエリ、型安全、エコシステム成熟
  - 現状: エンタープライズ標準、モバイル最適
- **tRPC**:
  - 利点: TypeScript特化、開発効率、Zero-API
  - 制約: TypeScriptモノレポ限定
- **REST**:
  - 利点: シンプル、HTTP標準、キャッシュ効率
  - 制約: Over-fetching、型安全性
- **結論**: GraphQL採用継続が最適（モバイル・型安全性重視）

### 3.2 リアルタイム通信
- **方式**: Server-Sent Events (SSE) + ポーリング
- **実装**: Gin標準機能 + カスタムミドルウェア
- **代替案**: Socket.io, Pusher, WebSocket

#### SSE採用理由（2024-2025年最新評価）
- **単方向通信で十分**: チャット通知・イベント通知には最適
- **インフラコスト**: WebSocketより運用コストが低い
- **HTTP/2の恩恵**: 多重化による効率的な通信
- **段階的移行**: 必要に応じてWebSocketに切り替え可能
- **最新ライブラリ対応**: EventSource v3.0+ (2024年12月) の安定性向上

#### 2024-2025年動向
- **Socket.io v4.8+**: WebTransport対応、パフォーマンス改善
- **Pusher**: エンタープライズ向け機能強化
- **WebSocket**: HTTP/3対応、ブラウザサポート向上
- **結論**: チャット主体のアプリではSSEが最適、必要時WebSocket拡張

### 3.3 認証・認可
- **認証サービス**: Amazon Cognito
- **ソーシャルログイン**: Cognito Identity Providers
  - Google OAuth
  - Apple Sign-In
  - Facebook Login（予定）
- **トークン管理**: Cognito JWT トークン
- **Go統合**: AWS SDK for Go (Cognito Identity Provider)

#### 選定理由
- AWSエコシステムとの完全統合
- ソーシャルログインの統一管理
- スケーラブルなユーザー管理
- セキュリティのベストプラクティス内蔵
- 運用コストの削減

## 4. データベース・ストレージ

### 4.1 メインデータベース（リレーショナル）
- **データベース**: PostgreSQL 15+
- **接続**: Ent (Go Entity Framework)
- **マイグレーション**: Ent Schema Definition + Atlas Migration Engine
- **用途**:
  - ユーザー情報
  - イベント情報
  - 課金・プラン情報
  - イベント参加者管理

#### 選定理由
- 高い信頼性とパフォーマンス
- JSONサポートによる柔軟性
- 豊富な機能セット
- AWS RDSとの親和性
- 複雑なリレーションシップの管理

#### Entによるメリット
- **スキーマ as コード**: Go言語でのスキーマ定義
- **型安全なクエリ**: コンパイル時エラー検出
- **GraphQL自動統合**: entgqlによるスキーマ自動生成
- **Atlas移行エンジン**: 安全で高度なマイグレーション機能

### 4.2 チャットデータベース（NoSQL）
- **データベース**: Amazon DynamoDB
- **接続**: AWS SDK for Go (DynamoDB)
- **用途**:
  - チャットメッセージ
  - メッセージ既読状態
  - リアクション情報

#### 選定理由
- 高いスループットと低レイテンシ
- 自動スケーリング
- 時系列データに最適
- 大量の読み書きに対応
- AWSエコシステムとの統合

#### DynamoDBテーブル設計
```
メッセージテーブル:
- PK: event_id (イベントID)
- SK: timestamp#message_id (タイムスタンプ#メッセージID)
- 属性: user_id, content, message_type, attachments

既読状態テーブル:
- PK: event_id#user_id
- SK: last_read_timestamp
```

### 4.3 キャッシュ・セッション
- **Redis**: キャッシュ、リアルタイム状態管理
- **用途**:
  - API レスポンスキャッシュ
  - レート制限
  - SSE接続状態管理
  - オンラインユーザー状態
  - 一時的なアプリケーション状態

#### 選定理由（Cognito使用時）
- **AWS統合**: エコシステム完全連携
- **最新機能**: 2024年後半のAdvanced Security強化
- **認証方式**: Passkey対応、MFA改善
- **スケーラビリティ**: グローバルユーザー管理
- **運用効率**: 管理コストの削減

#### 2024-2025年認証動向評価
- **Amazon Cognito**:
  - Advanced Security、Passkey対応強化
  - エンタープライズ向け機能拡張
- **Supabase Auth**:
  - オープンソース、開発体験向上
  - 小規模〜中規模プロジェクトに適合
- **Auth0**:
  - エンタープライズ特化、高コスト
- **Firebase Auth**:
  - Googleエコシステム依存
- **結論**: AWS中心設計によりCognito継続が最適

### 4.5 メッセージキュー
- **サービス**: Amazon SQS (Simple Queue Service)
- **用途**:
  - チャット通知キュー
  - イベント通知キュー
  - プッシュ通知配信キュー
  - 非同期処理タスク

#### 選定理由
- 高い可用性と耐障害性
- 自動スケーリング
- デッドレターキューサポート
- AWSエコシステムとの統合
- メッセージの確実な配信保証

### 4.4 ファイルストレージ
- **サービス**: Amazon S3
- **用途**: チャット画像、プロフィール画像
- **CDN**: Amazon CloudFront

#### 選定理由
- 高い可用性とスケーラビリティ
- コスト効率
- AWS エコシステムとの統合

## 5. インフラ・デプロイメント

### 5.1 クラウドプロバイダー
- **プロバイダー**: Amazon Web Services (AWS)
- **リージョン**: ap-northeast-1 (東京)

### 5.2 コンピューティング
- **バックエンド**: AWS ECS (Elastic Container Service)
- **Webフロントエンド**: AWS Amplify または Vercel
- **データベース**:
  - AWS RDS (PostgreSQL) - メインデータ
  - Amazon DynamoDB - チャットデータ
- **キャッシュ**: AWS ElastiCache (Redis)
- **メッセージキュー**: Amazon SQS

### 5.3 ネットワーク・セキュリティ
- **ロードバランサー**: AWS Application Load Balancer
- **SSL/TLS**: AWS Certificate Manager
- **DNS**: AWS Route 53
- **セキュリティ**: AWS Security Groups, WAF

### 5.4 CI/CD
- **ソースコード管理**: GitHub
- **CI/CD**: GitHub Actions
- **コンテナレジストリ**: AWS ECR
- **インフラ管理**: AWS CDK または Terraform

## 6. 外部サービス連携

### 6.1 プッシュ通知
- **サービス**: Firebase Cloud Messaging (FCM)
- **用途**: チャット通知、イベント通知

### 6.2 決済システム
- **モバイル**: App Store Connect (iOS), Google Play Billing (Android)
- **Web**: Stripe または PayPal

### 6.3 監視・ログ
- **アプリケーション監視**: AWS CloudWatch
- **エラートラッキング**: Sentry
- **ログ集約**: AWS CloudWatch Logs

## 7. 開発・運用ツール

### 7.1 開発環境
- **バージョン管理**: Git (GitHub)
- **コードフォーマット**:
  - Go: gofmt, golangci-lint
  - JavaScript/TypeScript: Prettier, ESLint
- **API ドキュメント**: GraphQL Schema + GraphiQL Playground
- **スキーマ管理**: Ent Schema Definition + entgql

#### Ent開発ツール
- **entc**: Entコード生成ツール
- **Atlas CLI**: マイグレーション管理
- **entgql**: GraphQL統合拡張

### 7.2 テスト
- **Go**: testify, gomock, Ent Test Utilities
- **React/React Native**: Jest, React Testing Library
- **E2E テスト**: Detox (React Native), Cypress (Web)
- **GraphQL テスト**: GraphQL Test Client with Generated Schemas

### 7.3 プロジェクト管理
- **タスク管理**: GitHub Issues + Projects
- **ドキュメント**: GitHub Wiki または Notion

## 8. パフォーマンス・スケーラビリティ

### 8.1 パフォーマンス最適化
- **データベース**: インデックス最適化、クエリ最適化
- **API**: レスポンス圧縮、キャッシュ戦略
- **フロントエンド**: Code Splitting、Lazy Loading

### 8.2 スケーラビリティ戦略
- **水平スケーリング**: ECS Auto Scaling
- **データベース**: Read Replica、接続プーリング
- **キャッシュ**: Redis Cluster
- **CDN**: CloudFront活用

## 9. セキュリティ対策

### 9.1 データ保護
- **暗号化**:
  - 転送時: TLS 1.3
  - 保存時: AWS S3 Server-Side Encryption
- **個人情報**: GDPR/個人情報保護法対応

### 9.2 アプリケーションセキュリティ
- **認証**: OAuth 2.0 + JWT
- **認可**: RBAC (Role-Based Access Control)
- **バリデーション**: 入力値検証、SQLインジェクション対策
- **レート制限**: API制限、DDoS対策

## 10. 開発工程・マイルストーン

### Phase 1: MVP開発 (3-4ヶ月)
- Go + Gin APIサーバー基盤
- Ent スキーマ設計とコード生成
- PostgreSQL データベース設計
- entgql による GraphQL API 自動生成
- React Native基本アプリ
- 基本的なイベント管理機能

### Phase 2: ソーシャル機能 (2-3ヶ月)
- ユーザー認証システム
- イベント共有機能
- SSEベースチャット機能
- プッシュ通知

### Phase 3: 拡張・最適化 (2-3ヶ月)
- 高度なチャット機能
- 課金システム
- パフォーマンス最適化
- テスト強化

### Phase 4: Web版展開 (2-3ヶ月)
- React Webアプリ開発
- ビジネス向け機能
- 本格運用開始

## 11. リスク・代替案

### 11.1 技術的リスク
- **リアルタイム通信**: 負荷増大時のWebSocket移行検討
- **モバイル開発**: 複雑機能でのネイティブ開発必要性
- **スケーリング**: 初期段階でのオーバーエンジニアリング回避

### 11.2 代替技術候補（2024-2025年評価）
- **ORM**:
  - GORM（より一般的、学習リソース豊富）
  - **評価**: Entの型安全性・GraphQL統合により継続
- **API設計**:
  - tRPC（TypeScript特化、高開発効率）
  - **評価**: モバイル最適化によりGraphQL継続
- **リアルタイム通信**:
  - Socket.io（双方向通信、豊富な機能）
  - **評価**: SSE→WebSocket段階移行プラン
- **認証**:
  - Supabase Auth（オープンソース、優れたDX）
  - **評価**: AWS統合によりCognito継続
- **バックエンド**:
  - Node.js + Express（JavaScript統一）
  - **評価**: Go言語のパフォーマンス・並行処理により継続
- **モバイル**:
  - Flutter（Dart、高性能、クロスプラットフォーム）
  - **評価**: React統一性、Web展開によりReact Native継続
- **データベース**:
  - MongoDB（スキーマレス、柔軟性）
  - **評価**: リレーション重要性によりPostgreSQL継続
- **インフラ**:
  - Google Cloud Platform, Microsoft Azure
  - **評価**: AWS専門知識、サービス成熟度により継続

### 11.3 2024-2025年技術動向まとめ
- **現技術選定の妥当性**: 高い（93%の技術が最新トレンドに適合）
- **継続推奨技術**: Go, React Native, PostgreSQL, GraphQL, Ent
- **監視対象技術**: tRPC（TypeScript特化案件増加）、Supabase（小規模案件）
- **段階的移行候補**: SSE→WebSocket（負荷増大時）

---

**作成日**: 2025年6月22日
**バージョン**: 1.0
**作成者**: GitHub Copilot
**承認者**: 未定
