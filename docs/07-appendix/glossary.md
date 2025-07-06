# 📚 用語集

## 🎯 プロジェクト固有の用語

### A

**API (Application Programming Interface)**
- アプリケーション間の通信を可能にするインターフェース
- Morrowでは主にGraphQLとRESTfulAPIを使用

### C

**CI/CD (Continuous Integration/Continuous Deployment)**
- 継続的インテグレーション・継続的デプロイメント
- コードの変更を自動的にテスト・ビルド・デプロイする仕組み

**Container**
- アプリケーションとその依存関係をパッケージ化した実行環境
- MorrowではDockerコンテナを使用

**Countdown**
- イベントまでの残り時間を表示する機能
- Morrowの核となる機能

### D

**Docker**
- コンテナ仮想化技術
- 開発環境から本番環境まで一貫した実行環境を提供

**Docker Compose**
- 複数のDockerコンテナを定義・実行するためのツール
- 開発環境でのマルチコンテナアプリケーション管理に使用

### E

**ECS (Elastic Container Service)**
- AWSのコンテナオーケストレーションサービス
- 本番環境でのコンテナ管理に使用

**Event**
- カウントダウンの対象となるイベント
- Morrowのメインエンティティ

### G

**Go (Golang)**
- Googleが開発した静的型付けのプログラミング言語
- MorrowのバックエンドAPIで使用

**GraphQL**
- Facebook が開発したクエリ言語
- 効率的なAPI通信を実現

### J

**JWT (JSON Web Token)**
- ユーザー認証に使用するトークン形式
- ステートレスな認証を実現

### M

**MVP (Minimum Viable Product)**
- 最小限の機能を持つ製品
- ユーザーフィードバックを早期に得るための戦略

**Morrow**
- プロジェクトのコードネーム
- "明日"を意味し、未来のイベントへの期待を表現

### P

**Participant**
- イベントに参加するユーザー
- 共有イベントの参加者を管理

**PostgreSQL**
- オープンソースのリレーショナルデータベース
- Morrowのメインデータベース

### R

**React Native**
- Facebookが開発したクロスプラットフォームモバイル開発フレームワーク
- iOS/Android両方で動作するアプリを開発可能

**Redis**
- インメモリデータベース
- キャッシュとセッション管理に使用

### S

**SSE (Server-Sent Events)**
- サーバーからクライアントへのリアルタイム通信技術
- イベント更新の通知に使用

### T

**TDD (Test-Driven Development)**
- テスト駆動開発
- テストを先に書いてから実装を行う開発手法

**TypeScript**
- JavaScriptに型安全性を追加したプログラミング言語
- フロントエンドとバックエンドの一部で使用

## 🔧 技術用語

### API関連

**GraphQL Schema**
- GraphQLの型定義とクエリ・ミューテーション・サブスクリプションの定義

**Resolver**
- GraphQLのクエリを実際のデータに変換する関数

**Mutation**
- GraphQLでデータを変更する操作

**Subscription**
- GraphQLでリアルタイムデータ更新を受信する機能

### データベース関連

**ORM (Object-Relational Mapping)**
- オブジェクト指向プログラミング言語とリレーショナルデータベース間のマッピング
- MorrowではEntを使用

**Migration**
- データベースのスキーマ変更を管理する仕組み

**Index**
- データベースの検索性能を向上させるためのデータ構造

### 開発関連

**Linter**
- コードの品質とスタイルをチェックするツール
- Go: golangci-lint, TypeScript: ESLint

**Hot Reload**
- コード変更時にアプリケーションを自動的に再起動する機能

**Pre-commit Hook**
- コミット前に自動的に実行されるスクリプト

### インフラ関連

**Load Balancer**
- 複数のサーバーに負荷を分散するシステム

**CDN (Content Delivery Network)**
- 世界中に配置されたサーバーから静的コンテンツを配信するネットワーク

**VPC (Virtual Private Cloud)**
- クラウド上の仮想的なプライベートネットワーク

## 🎨 UI/UX用語

**Component**
- 再利用可能なUI要素

**Props**
- React/React Nativeコンポーネントに渡されるプロパティ

**State**
- コンポーネントの状態を管理するデータ

**Hook**
- React/React Nativeの状態管理や副作用を扱う関数

## 📊 ビジネス用語

**DAU (Daily Active Users)**
- 日次アクティブユーザー数

**MAU (Monthly Active Users)**
- 月次アクティブユーザー数

**Retention Rate**
- ユーザーの継続利用率

**Churn Rate**
- ユーザーの離脱率

**KPI (Key Performance Indicator)**
- 重要業績評価指標

## 🔒 セキュリティ用語

**CORS (Cross-Origin Resource Sharing)**
- 異なるオリジンからのリソースアクセスを制御する仕組み

**HTTPS**
- HTTPSセキュア通信プロトコル

**WAF (Web Application Firewall)**
- Webアプリケーションへの攻撃を防ぐファイアウォール

**OAuth**
- 認証・認可のオープンスタンダード

## 🚀 開発プロセス用語

**Sprint**
- アジャイル開発における短期間の開発サイクル（通常2週間）

**Backlog**
- 実装予定の機能やタスクのリスト

**Epic**
- 大きな機能単位のまとまり

**Story Point**
- 作業の複雑さや工数を表す相対的な単位

**Velocity**
- チームがスプリントで完了できるストーリーポイントの量

## 🔄 デプロイメント用語

**Blue-Green Deployment**
- 2つの本番環境を切り替えることでゼロダウンタイムでデプロイする手法

**Canary Deployment**
- 新バージョンを段階的に展開する手法

**Rolling Update**
- サービスを停止せずに順次更新していく手法

**Rollback**
- 問題が発生した場合に前のバージョンに戻すこと

## 📈 監視・運用用語

**SLA (Service Level Agreement)**
- サービスレベル合意書
- サービスの可用性などを保証する契約

**SLO (Service Level Objective)**
- サービスレベル目標
- サービスの品質目標

**Monitoring**
- システムの状態を継続的に監視すること

**Alerting**
- 異常検知時に通知を送信すること

**Logging**
- システムの動作記録を残すこと

---

**関連ドキュメント**:
- [参考資料](./references.md)
- [変更履歴](./changelog.md)
- [プロジェクト概要](../01-overview/project-overview.md)

**最終更新**: 2025年7月6日
