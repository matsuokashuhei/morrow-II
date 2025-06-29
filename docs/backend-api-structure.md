# Go + Gin APIサーバー プロジェクト構造

## 概要
MorrowプロジェクトのGo + GinによるAPIサーバーの構造と実装について説明します。

## プロジェクト構造

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # アプリケーションエントリーポイント
├── internal/
│   ├── config/
│   │   ├── config.go            # 設定管理
│   │   └── config_test.go       # 設定テスト
│   ├── handler/
│   │   ├── health.go            # ヘルスチェックハンドラー
│   │   └── health_test.go       # ヘルスチェックテスト
│   ├── middleware/
│   │   ├── auth.go              # 認証ミドルウェア
│   │   ├── auth_test.go         # 認証テスト
│   │   ├── cors.go              # CORSミドルウェア
│   │   ├── error.go             # エラーハンドリング
│   │   └── logger.go            # ログミドルウェア
│   └── routes/
│       └── routes.go            # ルーター設定
├── go.mod                       # Go モジュール定義
├── go.sum                       # 依存関係チェックサム
├── Dockerfile.dev               # 開発用Dockerfile
├── Dockerfile                   # 本番用Dockerfile
└── .air.toml                    # ホットリロード設定
```

## 実装済み機能

### 1. プロジェクト構造設計 ✅
- Cleanアーキテクチャに基づいた構造
- `cmd/`: アプリケーションエントリーポイント
- `internal/`: 内部パッケージ（外部からimport不可）
- レイヤー分離: handler, middleware, config, routes

### 2. Gin ルーター設定 ✅
- **ファイル**: `internal/routes/routes.go`
- **機能**:
  - ルーター初期化と設定
  - 公開エンドポイントと認証必須エンドポイントの分離
  - API v1のグループ化
  - 将来のGraphQL対応準備

### 3. ミドルウェア設定 ✅
#### CORS ミドルウェア
- **ファイル**: `internal/middleware/cors.go`
- **機能**: フロントエンド（React Native, Expo）との通信許可

#### ログ ミドルウェア
- **ファイル**: `internal/middleware/logger.go`
- **機能**:
  - logrusを使用した構造化ログ
  - 環境別ログフォーマット（dev: text, prod: JSON）
  - リクエスト詳細のログ記録

#### 認証ミドルウェア
- **ファイル**: `internal/middleware/auth.go`
- **機能**:
  - Phase 2のCognito統合準備
  - MVP段階での基本認証枠組み
  - 開発用トークンサポート

#### エラーハンドリング ミドルウェア
- **ファイル**: `internal/middleware/error.go`
- **機能**:
  - 統一されたエラーレスポンス
  - 構造化エラーログ
  - HTTPステータスコード管理

### 4. ヘルスチェックエンドポイント ✅
- **ファイル**: `internal/handler/health.go`
- **エンドポイント**:
  - `GET /health` - サービス状態確認
  - `GET /ping` - 疎通確認
  - `GET /api/v1/status` - API状態確認

## データベース統合 ✅

### 1. PostgreSQL データベース設定
- **データベース**: PostgreSQL 15.13
- **接続設定**: Docker Composeネットワーク経由
- **データベース名**: morrow_dev
- **ユーザー**: morrow_user

### 2. Ent ORM統合
- **ファイル**: `ent/` ディレクトリ配下
- **スキーマ定義**:
  - `ent/schema/user.go` - ユーザーエンティティ
  - `ent/schema/event.go` - イベントエンティティ
  - `ent/schema/participant.go` - 参加者エンティティ
- **マイグレーション**: アプリケーション起動時自動実行

### 3. データベース設定管理
- **ファイル**: `internal/database/database.go`
- **機能**:
  - PostgreSQL接続管理
  - ヘルスチェック機能
  - 自動マイグレーション
  - 接続プール設定

### 4. 環境変数設定
```bash
# 必須環境変数
DATABASE_HOST=postgres     # Docker Composeサービス名
DATABASE_PORT=5432
DATABASE_NAME=morrow_dev
DATABASE_USER=morrow_user
DATABASE_PASSWORD=morrow_password
DATABASE_SSL_MODE=disable  # 開発環境用
```

## テスト構成 ✅

### 1. ユニットテスト
- **設定テスト**: `internal/config/config_test.go`
- **ハンドラーテスト**: `internal/handler/health_test.go`
- **ミドルウェアテスト**: `internal/middleware/auth_test.go`

### 2. テスト実行
```bash
# 全テスト実行（Dockerコンテナ内）
docker-compose exec backend go test ./... -v

# カバレッジレポート
docker-compose exec backend go test -coverprofile=coverage.out ./...
```

### 3. データベーステスト
```bash
# 接続テスト
curl http://localhost:8080/health | jq '.database'

# PostgreSQL直接接続
docker-compose exec postgres psql -U morrow_user -d morrow_dev
```

## API エンドポイント詳細

### ヘルスチェックエンドポイント
```bash
# 統合ヘルスチェック（データベース状態含む）
GET /health
レスポンス例:
{
  "database": {"status": "ok"},
  "message": "Morrow API is running",
  "status": "ok",
  "timestamp": "2025-06-29T14:05:30Z",
  "version": "0.1.0"
}

# 簡易疎通確認
GET /ping
レスポンス例:
{
  "message": "pong",
  "timestamp": "2025-06-29T14:05:30Z"
}

# API v1 ステータス
GET /api/v1/status
レスポンス例: /health と同様
```

### パフォーマンス仕様
- **平均応答時間**: 10-15ms
- **同時接続**: 10件まで確認済み
- **データベース接続**: 接続プール使用

## セキュリティ設定 ✅

### CORS設定
- **開発環境**: localhost:3000, localhost:8081 許可
- **認証情報**: Credentials サポート
- **公開ヘッダー**: Content-Length

### 認証ミドルウェア
- **現在**: MVP用基本実装
- **将来対応**: AWS Cognito統合準備
- **開発用**: Development token サポート

## 技術仕様

### 使用技術
- **フレームワーク**: Gin v1.10.1
- **ログライブラリ**: logrus v1.9.3
- **テストライブラリ**: testify
- **CORS**: gin-contrib/cors

### 設定管理
- **環境変数**: 12-Factor App準拠
- **デフォルト値**: 開発環境向けフォールバック
- **設定検証**: 起動時必須項目チェック

### ログ設定
- **開発環境**: テキスト形式、色付き、詳細タイムスタンプ
- **本番環境**: JSON形式、構造化ログ
- **ログレベル**: 環境別自動設定

## 現在のエンドポイント

### 公開エンドポイント（認証不要）
```bash
GET  /health              # ヘルスチェック
GET  /ping                # Ping-Pong
GET  /api/v1/status       # API状態
```

### 認証必須エンドポイント
現在は実装なし（Phase 2で追加予定）

## テスト

### 実行方法
```bash
# すべてのテストを実行
docker-compose exec backend go test ./...

# カバレッジ付きテスト
docker-compose exec backend go test -cover ./...

# 詳細出力
docker-compose exec backend go test -v ./...
```

### テストカバレッジ
- **config**: 設定の読み込み、バリデーション
- **handler**: ヘルスチェックエンドポイント
- **middleware**: 認証、エラーハンドリング

## 今後の拡張予定

### Phase 1（継続）
- [ ] Ent（ORM）統合
- [ ] GraphQLエンドポイント実装
- [ ] PostgreSQL接続

### Phase 2
- [ ] Amazon Cognito認証統合
- [ ] JWT トークン検証
- [ ] ユーザー管理エンドポイント

### Phase 3
- [ ] イベント管理API
- [ ] リアルタイム通信（SSE）
- [ ] チャット機能API

## 開発ガイドライン

### コマンド実行ルール
すべてのGoコマンドは必ずDockerコンテナ内で実行してください：
```bash
# ❌ ローカル実行（禁止）
go mod tidy
go get package

# ✅ コンテナ内実行（推奨）
docker-compose exec backend go mod tidy
docker-compose exec backend go get package
```

### コード品質
- **Lint**: golangci-lint（CI設定済み）
- **フォーマット**: gofmt（CI設定済み）
- **テスト**: 新機能には必ずテスト追加

---

**作成日**: 2025年6月29日
**バージョン**: 1.0
**GitHub Issue**: [#3 - Go + Gin APIサーバー基盤構築](https://github.com/matsuokashuhei/morrow-II/issues/3)
