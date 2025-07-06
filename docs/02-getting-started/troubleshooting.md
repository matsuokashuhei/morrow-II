# 🔧 トラブルシューティング

## 🚨 よくある問題と解決法

### 1. Docker関連の問題

#### Docker が起動しない
```bash
# 症状
docker: command not found
# または
Cannot connect to the Docker daemon

# 解決法
# 1. Docker Desktop が起動しているか確認
# 2. Docker Desktop を再起動
# 3. システムの再起動

# macOS の場合
brew install --cask docker
open /Applications/Docker.app

# Windows の場合
# Docker Desktop を管理者権限で起動
```

#### ポートがすでに使用されている
```bash
# 症状
Error: Port 8080 is already in use

# 解決法
# 1. 使用中のプロセスを確認
lsof -i :8080
netstat -tuln | grep 8080

# 2. プロセスを終了
kill -9 <PID>

# 3. または別のポートを使用
# docker-compose.yml で port を変更
ports:
  - "8081:8080"
```

#### Docker コンテナが起動しない
```bash
# 症状
Container exited with code 1

# 解決法
# 1. ログを確認
docker-compose logs backend
docker-compose logs frontend

# 2. コンテナを再ビルド
docker-compose up --build --force-recreate

# 3. Docker キャッシュをクリア
docker system prune -a
```

### 2. Go バックエンドの問題

#### go.mod / go.sum の不整合
```bash
# 症状
go: inconsistent vendoring in /app
go: module verification failed

# 解決法
# 1. Docker コンテナ内で実行
docker-compose exec backend go mod tidy
docker-compose exec backend go mod verify

# 2. 依存関係を再インストール
docker-compose exec backend go clean -modcache
docker-compose exec backend go mod download
```

#### パッケージが見つからない
```bash
# 症状
package xxx is not in GOROOT or GOPATH

# 解決法
# 1. Go バージョンを確認
docker-compose exec backend go version

# 2. モジュールパスを確認
docker-compose exec backend go list -m

# 3. 依存関係を追加
docker-compose exec backend go get <package-name>
```

#### データベース接続エラー
```bash
# 症状
failed to connect to database: dial tcp 127.0.0.1:5432: connect: connection refused

# 解決法
# 1. PostgreSQL コンテナの状態確認
docker-compose ps postgres

# 2. データベース設定を確認
docker-compose exec backend env | grep DB_

# 3. 接続文字列を確認
DB_HOST=postgres  # localhost ではなく postgres
DB_PORT=5432
DB_NAME=morrow_dev
```

### 3. React Native フロントエンドの問題

#### npm/yarn の依存関係エラー
```bash
# 症状
npm ERR! peer dep missing
Package xxx has been hoisted but is not declared in dependencies

# 解決法
# 1. package-lock.json を削除して再インストール
docker-compose exec frontend rm -rf node_modules package-lock.json
docker-compose exec frontend npm install

# 2. キャッシュをクリア
docker-compose exec frontend npm cache clean --force

# 3. 依存関係を明示的に追加
docker-compose exec frontend npm install <package-name>
```

#### Metro bundler の問題
```bash
# 症状
Error: Metro bundler failed to start
Unable to resolve module xxx

# 解決法
# 1. Metro キャッシュをクリア
docker-compose exec frontend npx react-native start --reset-cache

# 2. Watchman キャッシュをクリア (macOS)
watchman watch-del-all

# 3. Metro 設定を確認
# metro.config.js が正しく設定されているか確認
```

#### TypeScript エラー
```bash
# 症状
TS2307: Cannot find module 'xxx'
TS2339: Property 'xxx' does not exist on type 'yyy'

# 解決法
# 1. 型定義を確認
docker-compose exec frontend npm run type-check

# 2. 型定義ファイルを追加
docker-compose exec frontend npm install --save-dev @types/<package-name>

# 3. tsconfig.json を確認
# パスや型定義が正しく設定されているか確認
```

### 4. テスト関連の問題

#### Go テストの失敗
```bash
# 症状
go test ./... fails

# 解決法
# 1. 詳細なログを確認
docker-compose exec backend go test -v ./...

# 2. 特定のテストを実行
docker-compose exec backend go test -v ./internal/handler/

# 3. テストキャッシュをクリア
docker-compose exec backend go clean -testcache
```

#### Jest テストの失敗
```bash
# 症状
Test suites: 1 failed, 0 passed, 1 total

# 解決法
# 1. 詳細なエラーを確認
docker-compose exec frontend npm test -- --verbose

# 2. 特定のテストを実行
docker-compose exec frontend npm test -- --testNamePattern="EventCard"

# 3. Jest 設定を確認
# jest.config.json が正しく設定されているか確認
```

### 5. CI/CD パイプラインの問題

#### GitHub Actions の失敗
```yaml
# 症状
Action failed: The process '/usr/bin/docker' failed with exit code 1

# 解決法
# 1. ローカルで同じコマンドを実行
make test
make build

# 2. Docker ビルドログを確認
docker-compose build --no-cache

# 3. .github/workflows/ci-cd.yml を確認
# 環境変数やシークレットが正しく設定されているか
```

#### Linter エラー
```bash
# 症状
golangci-lint: error: analysis skipped due to errors

# 解決法
# 1. ローカルで Linter を実行
make lint

# 2. 特定の問題を修正
docker-compose exec backend golangci-lint run --fix

# 3. 設定ファイルを確認
# .golangci.yml が正しく設定されているか
```

## 🔍 デバッグ手法

### 1. ログの活用
```go
// Go でのログ出力
import "log/slog"

slog.Info("Processing event", "event_id", eventID, "user_id", userID)
slog.Error("Failed to save event", "error", err)
```

```typescript
// React Native でのログ出力
console.log('Event data:', event);
console.error('API call failed:', error);

// デバッグ用のカスタムログ
const debugLog = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

### 2. デバッガーの使用
```bash
# Go デバッガー (Delve)
docker-compose exec backend dlv debug cmd/server/main.go

# React Native デバッガー
# アプリ内でデバッグメニューを開く
# iOS: Cmd + D
# Android: Cmd + M
```

### 3. パフォーマンス監視
```bash
# Docker コンテナの監視
docker stats

# Go プロファイリング
docker-compose exec backend go tool pprof http://localhost:8080/debug/pprof/profile

# React Native パフォーマンス監視
# Flipper を使用した詳細な監視
```

## 🛠️ 診断コマンド

### システム診断
```bash
# Docker 環境の確認
docker version
docker-compose version
docker system df

# コンテナの状態確認
docker-compose ps
docker-compose logs

# ネットワーク確認
docker network ls
docker-compose exec backend ping postgres
```

### アプリケーション診断
```bash
# バックエンドの健全性確認
curl http://localhost:8080/health

# データベース接続確認
docker-compose exec postgres psql -U morrow -d morrow_dev -c "SELECT 1;"

# フロントエンドの状態確認
curl http://localhost:3000
```

## 🆘 エスカレーション

### 問題が解決しない場合

1. **GitHub Issues**
   - 詳細な症状と実行した手順を記載
   - エラーログとスクリーンショットを添付
   - 環境情報（OS、Docker バージョン等）を記載

2. **プロジェクトチーム**
   - Slack の #development チャンネル
   - 緊急度を明確にする

3. **技術サポート**
   - Docker、Go、React Native の公式ドキュメント
   - Stack Overflow での既知の問題検索

## 📋 問題報告テンプレート

```markdown
## 問題の概要
<!-- 何が起きているか簡潔に説明 -->

## 再現手順
1.
2.
3.

## 期待される動作
<!-- 何が起きるべきか -->

## 実際の動作
<!-- 何が起きているか -->

## 環境情報
- OS:
- Docker version:
- Docker Compose version:
- ブラウザ:

## エラーログ
```
<!-- エラーメッセージやログを貼り付け -->
```

## 試した解決策
- [ ] Docker の再起動
- [ ] コンテナの再ビルド
- [ ] キャッシュのクリア
- [ ] その他:
```

## 🔄 定期メンテナンス

### 週次タスク
```bash
# Docker イメージの更新
docker-compose pull

# 未使用リソースのクリーンアップ
docker system prune

# 依存関係のセキュリティチェック
make security-audit
```

### 月次タスク
```bash
# 全体的なクリーンアップ
docker system prune -a

# 依存関係の更新
make update-deps

# パフォーマンスチェック
make performance-test
```

---

**関連ドキュメント**:
- [開発環境構築](./development-setup.md)
- [開発ワークフロー](./development-workflow.md)
- [開発ガイドライン](./development-guidelines.md)
- [CI/CD設定](../06-deployment/ci-cd.md)

**最終更新**: 2025年7月6日
