# Docker 開発環境セットアップ

## 概要

Morrowプロジェクトは、Docker Composeを使用してバックエンド（Go）、フロントエンド（React Native/Expo）、データベース（PostgreSQL）の開発環境を構築します。

## サービス構成

### バックエンド（Go API）
- **コンテナ名**: `morrow-backend`
- **ポート**: 8080
- **技術スタック**: Go, Gin, Ent
- **自動リロード**: Air使用

### フロントエンド（React Native）
- **コンテナ名**: `morrow-frontend`
- **ポート**: 8081（Metro）、19000-19002（Expo DevTools）
- **技術スタック**: React Native, Expo, TypeScript

### データベース（PostgreSQL）
- **コンテナ名**: `morrow-postgres`
- **ポート**: 5432
- **データベース**: morrow_dev

## 開発環境起動

```bash
# 全サービス起動
docker-compose up --build

# バックグラウンド起動
docker-compose up -d --build

# 特定サービスのみ起動
docker-compose up postgres backend
```

## **重要: Go コマンド実行ルール**

**すべてのGoコマンドは、必ずbackendコンテナ内で実行してください。**

### ❌ 禁止されている実行方法
```bash
# ローカル環境での直接実行（禁止）
go mod tidy
go get github.com/gin-gonic/gin
go run cmd/server/main.go
go build
go test ./...
```

### ✅ 推奨される実行方法

#### 1. 一回限りのコマンド実行
```bash
# go mod 操作
docker-compose exec backend go mod tidy
docker-compose exec backend go mod download

# パッケージ追加/更新
docker-compose exec backend go get github.com/gin-gonic/gin
docker-compose exec backend go get -u github.com/gin-gonic/gin

# ビルド・実行
docker-compose exec backend go build cmd/server/main.go
docker-compose exec backend go run cmd/server/main.go

# テスト実行
docker-compose exec backend go test ./...
docker-compose exec backend go test -v ./internal/...
```

#### 2. コンテナ内でのインタラクティブ作業
```bash
# backendコンテナ内でbashシェルを起動
docker-compose exec backend bash

# コンテナ内で通常のgoコマンドが使用可能
go mod tidy
go get github.com/sirupsen/logrus
go test ./...
exit  # コンテナから抜ける
```

### なぜこのルールが必要なのか？

1. **Go バージョンの一貫性**
   - ローカルとコンテナでのGoバージョン差分を回避
   - 全開発者が同じGo環境で作業

2. **依存関係の整合性**
   - go.mod/go.sumファイルがコンテナ環境で生成される
   - 本番環境との環境一致

3. **チーム開発の一貫性**
   - 全開発者が同じ環境で開発
   - 「私の環境では動く」問題の回避

4. **CI/CD との一貫性**
   - CI/CD パイプラインと同じDocker環境での開発

## よく使用するコマンド

```bash
# 開発環境リセット
docker-compose down -v
docker-compose up --build

# ログ確認
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# コンテナ状態確認
docker-compose ps

# 特定サービス再起動
docker-compose restart backend
```

## トラブルシューティング

### Go 依存関係の問題
```bash
# コンテナ内でgo mod整理
docker-compose exec backend go mod tidy
docker-compose exec backend go mod download
```

### ポート競合
```bash
# 使用中のポート確認
lsof -i :8080
lsof -i :5432

# 全コンテナ停止
docker-compose down
```

### ボリューム問題
```bash
# ボリューム削除（データ消失注意）
docker-compose down -v
docker volume prune
```

## データベース管理

### PostgreSQL接続
```bash
# PostgreSQLコンテナへ接続
docker-compose exec postgres psql -U morrow_user -d morrow_dev

# SQL実行例
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "SELECT version();"
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\dt"

# 特定テーブルの構造確認
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\d events"
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\d users"
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\d participants"
```

### データベースマイグレーション
```bash
# マイグレーション状態確認
docker-compose logs backend | grep -i migration

# Entスキーマ再生成（開発時）
docker-compose exec backend go generate ./ent

# データベースリセット（開発環境のみ）
docker-compose down -v postgres
docker-compose up postgres
```

### データベーステスト
```bash
# 接続テスト
curl http://localhost:8080/health | jq '.database'

# 手動接続確認
docker-compose exec backend go run cmd/test-ent/main.go
```

## サービス状態確認

### ヘルスチェック
```bash
# 全サービスの状態確認
curl http://localhost:8080/health

# 期待されるレスポンス
{
  "database": {
    "status": "ok"
  },
  "message": "Morrow API is running",
  "status": "ok",
  "timestamp": "2025-06-29T14:05:30Z",
  "version": "0.1.0"
}
```

### パフォーマンス確認
```bash
# API応答時間測定
time curl -s http://localhost:8080/ping

# 負荷テスト（簡易）
for i in {1..10}; do 
  curl -s http://localhost:8080/health > /dev/null & 
done; 
wait
```
