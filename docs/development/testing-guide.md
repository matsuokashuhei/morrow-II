# テスト実行ガイド - Morrow プロジェクト

## 概要

このドキュメントは、Morrowプロジェクトでのテスト実行方法と品質確認手順を説明します。すべてのテストはDockerコンテナ内で実行することを前提としています。

## 🧪 テスト環境セットアップ

### 前提条件
```bash
# Docker環境起動
docker-compose up -d --build

# サービス状態確認
docker-compose ps
```

### 期待される出力
```
NAME              IMAGE                COMMAND                  SERVICE    STATUS
morrow-backend    morrow-ii-backend    "sh -c 'while ! nc -…"   backend    Up
morrow-frontend   morrow-ii-frontend   "docker-entrypoint.s…"   frontend   Up
morrow-postgres   postgres:15-alpine   "docker-entrypoint.s…"   postgres   Up
```

## 🔧 バックエンドテスト

### ユニットテスト実行
```bash
# 全テスト実行
docker-compose exec backend go test ./... -v

# 特定パッケージのテスト
docker-compose exec backend go test ./internal/config -v
docker-compose exec backend go test ./internal/handler -v
docker-compose exec backend go test ./internal/middleware -v
```

### テストカバレッジ
```bash
# カバレッジレポート生成
docker-compose exec backend go test -coverprofile=coverage.out ./...

# HTMLレポート表示
docker-compose exec backend go tool cover -html=coverage.out -o coverage.html

# カバレッジ統計表示
docker-compose exec backend go tool cover -func=coverage.out
```

### 期待されるテスト結果
```
=== 設定テスト ===
✅ TestNew
✅ TestNewWithEnvironmentVariables
✅ TestConfig_DatabaseURL
✅ TestConfig_IsDevelopment
✅ TestConfig_Validate (7 サブテスト)

=== ハンドラーテスト ===
✅ TestHealthHandler_Health
✅ TestHealthHandler_Ping

=== ミドルウェアテスト ===
✅ TestAuth_HealthEndpoints
✅ TestAuth_UnauthenticatedAccess
✅ TestAuth_DevelopmentToken
✅ TestRequireAuth_Authenticated
✅ TestRequireAuth_Unauthenticated
✅ TestGetUserID
✅ TestInitLogger
✅ TestInitLogger_Production
✅ TestSetGinMode

総計: 15テスト全て成功
```

## 🎨 フロントエンドテスト

### Jest テスト実行
```bash
# 全テスト実行
docker-compose exec frontend npm test

# ウォッチモード
docker-compose exec frontend npm test -- --watch

# カバレッジ付きテスト
docker-compose exec frontend npm test -- --coverage
```

### 期待されるテスト結果
```
Test Suites: 3 passed, 3 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.711 s

✅ App.test.tsx
✅ basic.test.tsx
✅ HomeScreen.test.tsx
```

## 🗄️ データベーステスト

### PostgreSQL 接続確認
```bash
# バージョン確認
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "SELECT version();"

# 期待される出力
PostgreSQL 15.13 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
```

### テーブル構造確認
```bash
# 作成されたテーブル一覧
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\dt"

# 期待される出力
              List of relations
 Schema |     Name     | Type  |    Owner
--------+--------------+-------+-------------
 public | events       | table | morrow_user
 public | participants | table | morrow_user
 public | users        | table | morrow_user
```

### 特定テーブルのスキーマ確認
```bash
# eventsテーブル構造
docker-compose exec postgres psql -U morrow_user -d morrow_dev -c "\d events"

# 期待される主要カラム
- id (bigint, PK)
- title (varchar, NOT NULL)
- description (varchar)
- start_time (timestamptz, NOT NULL)
- end_time (timestamptz, NOT NULL)
- emoji (varchar)
- visibility (varchar, DEFAULT 'private')
- created_at (timestamptz, NOT NULL)
- updated_at (timestamptz, NOT NULL)
- user_created_events (bigint, FK to users)
```

## 🌐 API統合テスト

### ヘルスチェックエンドポイント
```bash
# 統合ヘルスチェック
curl http://localhost:8080/health | jq .

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

### 基本エンドポイント
```bash
# 疎通確認
curl http://localhost:8080/ping | jq .

# 期待されるレスポンス
{
  "message": "pong",
  "timestamp": "2025-06-29T14:05:30Z"
}

# API v1 ステータス
curl http://localhost:8080/api/v1/status | jq .
# ※ /health と同じレスポンス形式
```

## ⚡ パフォーマンステスト

### レスポンス時間測定
```bash
# 5回連続測定
for i in {1..5}; do
  echo "Request $i:";
  time curl -s http://localhost:8080/health > /dev/null;
done

# 期待される応答時間: 10-15ms以下
```

### 同時接続テスト
```bash
# 10件同時リクエスト
echo "Concurrent load test (10 requests):"
for i in {1..10}; do
  curl -s http://localhost:8080/ping > /dev/null &
done;
wait && echo "All requests completed"

# 期待される結果: 全リクエスト正常完了
```

## 🔒 セキュリティテスト

### CORS動作確認
```bash
# CORSヘッダー確認
curl -v -H "Origin: http://localhost:3000" http://localhost:8080/health

# 期待されるヘッダー
< Access-Control-Allow-Credentials: true
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Expose-Headers: Content-Length
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. テスト失敗
```bash
# ログ確認
docker-compose logs backend
docker-compose logs frontend

# 環境リセット
docker-compose down -v
docker-compose up -d --build
```

#### 2. データベース接続エラー
```bash
# PostgreSQL再起動
docker-compose restart postgres

# マイグレーション確認
docker-compose logs backend | grep -i migration
```

#### 3. ポート競合
```bash
# 使用中ポート確認
lsof -i :8080
lsof -i :8081
lsof -i :5432

# 全サービス停止
docker-compose down
```

#### 4. パフォーマンス低下
```bash
# リソース使用量確認
docker stats

# コンテナ再起動
docker-compose restart backend frontend
```

## 📊 品質基準

### 成功基準
- **バックエンドテスト**: 全15テスト成功
- **フロントエンドテスト**: 全6テスト成功
- **データベース**: PostgreSQL 15.13稼働
- **API応答時間**: 平均15ms以下
- **ヘルスチェック**: status: "ok"
- **同時接続**: 10件処理成功

### CI/CD統合
この手順は、CI/CDパイプラインでも同様に実行されます：
1. Docker環境構築
2. 全テスト実行
3. 品質チェック
4. パフォーマンス検証

## 📝 レポート作成

### テスト実行レポートテンプレート
```markdown
## テスト実行結果 - YYYY-MM-DD

### ✅ 成功項目
- [ ] Docker Composeビルド
- [ ] サービス起動 (backend/frontend/postgres)
- [ ] バックエンドテスト (15/15)
- [ ] フロントエンドテスト (6/6)
- [ ] データベーステスト
- [ ] API統合テスト
- [ ] パフォーマンステスト
- [ ] セキュリティテスト

### ⚠️ 注意事項
- 発見された警告や改善点

### 🚀 システム状態
- Backend: 正常稼働中 (http://localhost:8080)
- Frontend: 正常稼働中 (http://localhost:8081)
- Database: PostgreSQL 15.13稼働中

### 📈 パフォーマンス
- 平均応答時間: XXms
- 同時接続処理: XX件成功
```

---

**最終更新**: 2025年6月29日
**バージョン**: 1.0
**関連Issue**: [#10 - PostgreSQL database setup](https://github.com/matsuokashuhei/morrow-II/issues/10)
