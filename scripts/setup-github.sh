#!/bin/bash

# Morrow GitHub Repository Setup Script
# このスクリプトは、Morrowプロジェクトの初期設定を自動化します

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Repository information
REPO_OWNER="matsuokashuhei"  # ここを実際のGitHubユーザー名に変更
REPO_NAME="morrow-II"
GITHUB_TOKEN=""  # GitHub Personal Access Tokenを設定

echo -e "${GREEN}🚀 Morrow GitHub Repository Setup${NC}"
echo "================================================"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) が見つかりません。${NC}"
    echo "インストール方法: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI 認証が必要です${NC}"
    echo "以下のコマンドを実行してください:"
    echo "gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI が認証済みです${NC}"

# Function to create milestones
create_milestones() {
    echo -e "${YELLOW}📋 マイルストーンを作成中...${NC}"

    gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
        --method POST \
        --field title="MVP Release (Phase 1)" \
        --field description="基本的なイベント管理機能とアプリの基盤構築" \
        --field due_on="2025-04-30T23:59:59Z" || echo "マイルストーン 'MVP Release (Phase 1)' は既に存在します"

    gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
        --method POST \
        --field title="Social Features (Phase 2)" \
        --field description="ユーザー認証とイベント共有、チャット機能" \
        --field due_on="2025-07-31T23:59:59Z" || echo "マイルストーン 'Social Features (Phase 2)' は既に存在します"

    gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
        --method POST \
        --field title="Premium Features (Phase 3)" \
        --field description="高度な機能とパフォーマンス最適化" \
        --field due_on="2025-10-31T23:59:59Z" || echo "マイルストーン 'Premium Features (Phase 3)' は既に存在します"

    gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
        --method POST \
        --field title="Web Launch (Phase 4)" \
        --field description="Webアプリ開発とビジネス向け機能" \
        --field due_on="2025-12-31T23:59:59Z" || echo "マイルストーン 'Web Launch (Phase 4)' は既に存在します"

    echo -e "${GREEN}✅ マイルストーン作成完了${NC}"
}

# Function to create Phase 1 issues
create_phase1_issues() {
    echo -e "${YELLOW}📝 Phase 1 Issue を作成中...${NC}"

    # Get milestone number for Phase 1
    MILESTONE_NUMBER=$(gh api repos/$REPO_OWNER/$REPO_NAME/milestones | jq -r '.[] | select(.title=="MVP Release (Phase 1)") | .number')

    # Issue 1: プロジェクト初期化
    gh issue create \
        --title "[PHASE-1] プロジェクト初期化とモノレポ構成設定" \
        --body "## 概要
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

## 受け入れ条件
- [ ] ローカル開発環境がDockerで動作する
- [ ] 基本的なCI/CDが動作する
- [ ] モノレポ構成が適切に設定されている
- [ ] READMEが整備されている

## 見積り
- **作業時間**: 3人日
- **優先度**: High" \
        --label "phase-1,infrastructure,priority-high,size-m" \
        --milestone $MILESTONE_NUMBER

    # Issue 2: 開発ツール設定
    gh issue create \
        --title "[PHASE-1] 開発ツール・リンター設定" \
        --body "## 概要
Go・TypeScriptの開発ツールとコード品質管理ツールを設定します。

## 詳細仕様
- [ ] Go: gofmt, golangci-lint設定
- [ ] TypeScript: Prettier, ESLint設定
- [ ] Pre-commit hooks設定
- [ ] GitHub Actions基本ワークフロー

## 技術仕様
- **使用技術**: golangci-lint, Prettier, ESLint, husky
- **実装ファイル**: .golangci.yml, .prettierrc, .eslintrc.js, .pre-commit-config.yaml

## 見積り
- **作業時間**: 2人日
- **優先度**: High" \
        --label "phase-1,infrastructure,priority-high,size-s" \
        --milestone $MILESTONE_NUMBER

    # Issue 3: Go APIサーバー基盤
    gh issue create \
        --title "[PHASE-1] Go + Gin APIサーバー基盤構築" \
        --body "## 概要
Go + GinによるAPIサーバーの基盤を構築します。

## 詳細仕様
- [ ] プロジェクト構造設計
- [ ] Gin ルーター設定
- [ ] ミドルウェア設定（CORS, ログ, 認証）
- [ ] ヘルスチェックエンドポイント

## 技術仕様
- **使用技術**: Go, Gin, logrus
- **実装ファイル**: main.go, routes/, middleware/, handlers/

## 見積り
- **作業時間**: 4人日
- **優先度**: High" \
        --label "phase-1,backend,priority-high,size-l" \
        --milestone $MILESTONE_NUMBER

    echo -e "${GREEN}✅ Phase 1 Issue 作成完了${NC}"
}

# Function to setup repository settings
setup_repository() {
    echo -e "${YELLOW}⚙️  リポジトリ設定を更新中...${NC}"

    # Enable issues and projects
    gh api repos/$REPO_OWNER/$REPO_NAME \
        --method PATCH \
        --field has_issues=true \
        --field has_projects=true \
        --field has_wiki=true

    echo -e "${GREEN}✅ リポジトリ設定更新完了${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}🔧 セットアップを開始します...${NC}"
    echo ""

    setup_repository
    echo ""

    create_milestones
    echo ""

    create_phase1_issues
    echo ""

    echo -e "${GREEN}🎉 セットアップが完了しました！${NC}"
    echo ""
    echo "次のステップ:"
    echo "1. 作成されたIssueを確認してください"
    echo "2. 必要に応じてAssigneeを設定してください"
    echo "3. プロジェクトボードを作成してください"
    echo "4. 開発を開始してください"
    echo ""
    echo "GitHub Repository: https://github.com/$REPO_OWNER/$REPO_NAME"
}

# Check if repository exists
if ! gh repo view $REPO_OWNER/$REPO_NAME &> /dev/null; then
    echo -e "${RED}❌ リポジトリ $REPO_OWNER/$REPO_NAME が見つかりません${NC}"
    echo "リポジトリを作成するか、REPO_OWNER と REPO_NAME を確認してください"
    exit 1
fi

# Run main function
main
