# Morrow - ドキュメント

このディレクトリには、Morrowプロジェクトのすべてのドキュメントが整理されています。

## 📁 ディレクトリ構成

### 📋 planning/
プロジェクトの企画・要件定義関連のドキュメント
- [`requirements.md`](planning/requirements.md) - 要件定義書

### 🏗 architecture/
技術選定・アーキテクチャ設計関連のドキュメント
- [`tech-stack.md`](architecture/tech-stack.md) - 技術選定書

### 👨‍💻 development/
開発プロセス・管理関連のドキュメント
- [`development-items.md`](development/development-items.md) - 開発アイテムリスト
- **[`ci-cd-rules.md`](development/ci-cd-rules.md) - CI/CD開発ルール (必読)**
- [`docker-setup.md`](development/docker-setup.md) - Docker環境セットアップ
- [`github-issues-data.md`](development/github-issues-data.md) - GitHub Issue作成用データ

### 📊 プロジェクト管理
- [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) - プロジェクト全体の構成説明

## 📖 主要ドキュメント

### 1. 要件定義書
[`planning/requirements.md`](planning/requirements.md)
- ユーザー要件
- 機能要件
- 非機能要件
- ビジネス要件

### 2. 技術選定書
[`architecture/tech-stack.md`](architecture/tech-stack.md)
- 技術スタック詳細
- 選定理由・比較
- 2024-2025年技術動向評価
- リスク・代替案

### 3. 開発アイテムリスト
[`development/development-items.md`](development/development-items.md)
- 4フェーズの開発計画
- 詳細なタスクリスト
- GitHub Issue管理方針

### 4. CI/CD開発ルール ⚠️ 必読
[`development/ci-cd-rules.md`](development/ci-cd-rules.md)
- CI失敗を防ぐための必須チェック項目
- ローカル検証手順
- 依存関係管理ルール
- コード品質ガイドライン

## 🔄 ドキュメント更新フロー

1. **企画段階**: `planning/` 配下のドキュメントを更新
2. **設計段階**: `architecture/` 配下のドキュメントを更新
3. **開発段階**: `development/` 配下のドキュメントを更新

## 📝 今後追加予定のドキュメント

### API ドキュメント
- `api/` - GraphQL スキーマ・リゾルバ
- `api/examples.md` - API 使用例

### デプロイメント
- `deployment/` - AWS インフラ設定
- `deployment/setup.md` - 環境構築手順

### 運用・保守
- `operations/` - 監視・ログ・運用手順
- `operations/troubleshooting.md` - トラブルシューティング

### ユーザーガイド
- `user-guide/` - エンドユーザー向けドキュメント

---

**最終更新**: 2025年1月22日
**管理者**: [@matsuokashuhei](https://github.com/matsuokashuhei)
