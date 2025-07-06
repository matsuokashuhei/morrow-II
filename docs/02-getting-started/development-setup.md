# 🚀 開発環境構築ガイド

## 📋 前提条件

### システム要件
- **OS**: macOS 10.15+ / Windows 10+ / Ubuntu 18.04+
- **RAM**: 8GB以上（16GB推奨）
- **ストレージ**: 10GB以上の空き容量
- **ネットワーク**: インターネット接続（依存関係のダウンロード）

### 必要なソフトウェア
- **Docker Desktop**: 4.0.0以上
- **Git**: 2.30.0以上
- **VSCode**: 1.60.0以上（推奨）

## ⚡ 5分クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/matsuokashuhei/morrow-II.git
cd morrow-II
```

### 2. 開発環境を起動

```bash
# 開発環境を起動（初回は自動でビルド）
make dev

# または直接Docker Composeを使用
docker-compose up --build
```

### 3. 動作確認

```bash
# バックエンドAPIの動作確認
curl http://localhost:8080/health

# フロントエンドの動作確認（別ターミナル）
curl http://localhost:3000
```

✅ **すべて正常に動作すれば環境構築完了！**

## 🔧 詳細セットアップ

### Docker Desktop の設定

#### macOS
```bash
# Homebrewでインストール
brew install --cask docker

# Docker Desktopを起動
open /Applications/Docker.app
```

#### Windows
1. [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/) をダウンロード
2. インストーラーを実行
3. WSL2バックエンドを有効化

#### Linux
```bash
# Dockerエンジンのインストール
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Composeのインストール
sudo curl -L "https://github.com/docker/compose/releases/download/v2.10.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Git の設定

```bash
# ユーザー情報の設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# SSH キーの設定（推奨）
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub
# 出力された公開鍵をGitHubに追加
```

### VS Code の設定

#### 推奨拡張機能
```json
{
  "recommendations": [
    "ms-vscode.vscode-go",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-docker"
  ]
}
```

#### 設定ファイル（.vscode/settings.json）
```json
{
  "go.toolsManagement.checkForUpdates": "local",
  "go.useLanguageServer": true,
  "go.lintTool": "golangci-lint",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🐳 Docker 環境の詳細

### 開発環境構成

```yaml
# docker-compose.yml の主要サービス
services:
  backend:
    image: golang:1.23-alpine
    ports:
      - "8080:8080"
    environment:
      - GO_ENV=development
      - DB_HOST=postgres
    depends_on:
      - postgres

  frontend:
    image: node:18-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=morrow_dev
      - POSTGRES_USER=morrow
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
```

### 便利なMakeコマンド

```bash
# 開発環境の起動
make dev

# 依存関係のインストール
make install

# テストの実行
make test

# Linterの実行
make lint

# フォーマットの実行
make format

# 環境のクリーンアップ
make clean

# 全てのコンテナを停止・削除
make down
```

## 🔍 トラブルシューティング

### よくある問題と解決法

#### 1. Docker が起動しない
```bash
# Dockerの状態確認
docker info

# Docker Desktopの再起動
# macOS: Docker Desktop を終了して再起動
# Windows: タスクマネージャーからDocker Desktopを終了して再起動
```

#### 2. ポートが既に使用されている
```bash
# ポートの使用状況確認
lsof -i :8080
lsof -i :3000

# 使用中のプロセスを終了
kill -9 <PID>
```

#### 3. Docker イメージのビルドエラー
```bash
# Docker キャッシュをクリア
docker system prune -a

# 強制的に再ビルド
docker-compose up --build --force-recreate
```

#### 4. 依存関係のエラー
```bash
# Go モジュールのクリーンアップ
docker-compose exec backend go clean -modcache
docker-compose exec backend go mod download

# Node.js のクリーンアップ
docker-compose exec frontend npm ci
```

## 🧪 開発環境のテスト

### バックエンドテスト
```bash
# 単体テスト
make test-backend

# テストカバレッジ
make coverage-backend

# 統合テスト
make test-integration
```

### フロントエンドテスト
```bash
# 単体テスト
make test-frontend

# テストカバレッジ
make coverage-frontend

# E2Eテスト
make test-e2e
```

### API テスト
```bash
# ヘルスチェック
curl http://localhost:8080/health

# API エンドポイントテスト
curl -X GET http://localhost:8080/api/v1/events
```

## 🎯 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

1. **[開発ワークフロー](./development-workflow.md)** - 日常的な開発作業の流れ
2. **[開発ガイドライン](./development-guidelines.md)** - コード品質とベストプラクティス
3. **[API仕様書](../03-api/README.md)** - バックエンドAPI の詳細
4. **[トラブルシューティング](./troubleshooting.md)** - 問題解決のヒント

## 🔄 定期メンテナンス

### 週次タスク
```bash
# Dockerイメージの更新
docker-compose pull

# 依存関係の更新確認
make update-deps
```

### 月次タスク
```bash
# 未使用のDockerリソースクリーンアップ
docker system prune -a

# セキュリティアップデートの確認
make security-audit
```

---

**関連ドキュメント**:
- [開発ワークフロー](./development-workflow.md)
- [トラブルシューティング](./troubleshooting.md)
- [プロジェクト構造](../01-overview/project-structure.md)

**最終更新**: 2025年7月6日
