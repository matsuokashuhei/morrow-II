# SOW Issue#17: イベント一覧・詳細表示機能の実装

## 📋 プロジェクト概要

### 目的
ユーザーが作成したイベントの一覧表示と詳細表示機能を実装し、リアルタイムカウントダウンを含む包括的なイベント管理機能を提供する。

### スコープ
- イベント一覧画面の実装
- イベント詳細画面の実装
- リアルタイムカウントダウン機能
- 検索・フィルタリング機能
- GraphQL クエリの実装
- React Router による画面遷移

## 🎯 実装要件

### 1. イベント一覧画面（EventListScreen）
- **UI/UX**
  - イベントカードの一覧表示
  - リアルタイムカウントダウン表示
  - 検索バー（タイトル検索）
  - フィルタリング機能（開催予定/終了済み）
  - 新規イベント作成ボタン
  - レスポンシブデザイン

- **機能**
  - GraphQL による イベント一覧取得
  - 検索・フィルタリングの即座反映
  - イベント詳細画面への遷移
  - エラーハンドリングとローディング状態

### 2. イベント詳細画面（EventDetailScreen）
- **UI/UX**
  - イベント情報の詳細表示
  - 大きなカウントダウン表示
  - イベント編集・削除ボタン
  - 参加者情報表示（Phase 2への準備）
  - 共有ボタン（Phase 2への準備）

- **機能**
  - GraphQL による単一イベント取得
  - リアルタイムカウントダウン更新
  - 編集・削除画面への遷移
  - 404エラーハンドリング

### 3. カウントダウン機能強化
- **表示フォーマット**
  - 日・時・分・秒の詳細表示
  - イベント終了時の特別表示
  - アニメーション効果

- **計算ロジック**
  - 高精度な時間計算
  - タイムゾーン対応
  - パフォーマンス最適化

### 4. GraphQL 実装
- **クエリ**
  - `GetEvents`: 一覧取得（検索・フィルタ対応）
  - `GetEvent`: 単一イベント取得
  - ページネーション準備（将来対応）

- **型定義**
  - GraphQL Codegen による自動生成
  - TypeScript型の完全対応

## 🛠️ 技術仕様

### フロントエンド
- **React 18** + TypeScript
- **Vite** 開発環境
- **Apollo Client** GraphQL クライアント
- **React Router** ナビゲーション
- **Zustand** 状態管理
- **Tailwind CSS** スタイリング

### バックエンド
- 既存の **GraphQL API** 利用
- **gqlgen** + **Ent ORM**
- **PostgreSQL** データベース

### 開発環境
- **Docker Compose** 環境
- **ESLint** + **Prettier** コード品質
- **Jest** + **React Testing Library** テスト

## 📁 ファイル構成

```
frontend/src/
├── screens/
│   ├── EventListScreen.tsx      # 新規作成
│   └── EventDetailScreen.tsx    # 新規作成
├── components/
│   ├── EventCard.tsx           # 既存（軽微な修正）
│   ├── event/
│   │   ├── EventList.tsx       # 新規作成
│   │   ├── EventFilters.tsx    # 新規作成
│   │   └── EventSearch.tsx     # 新規作成
│   └── ui/
│       └── Countdown.tsx       # 新規作成
├── hooks/
│   ├── useEventList.tsx        # 新規作成
│   ├── useEventDetail.tsx      # 新規作成
│   └── useCountdown.tsx        # 新規作成
├── graphql/
│   └── queries/events.graphql  # 既存（拡張）
└── __tests__/
    ├── screens/
    ├── components/
    └── hooks/
```

## 🧪 テスト仕様

### 単体テスト
- **EventListScreen**: 一覧表示、検索、フィルタリング
- **EventDetailScreen**: 詳細表示、エラーハンドリング
- **EventCard**: カウントダウン、アクション
- **hooks**: カスタムフック各種

### 統合テスト
- **GraphQL**: クエリ実行とデータフロー
- **Router**: 画面遷移とURL管理
- **State**: Zustand ストア連携

### E2E テスト（将来）
- イベント作成から詳細表示まで
- 検索・フィルタリング操作

## 📅 実装スケジュール

### Phase 1: 基盤実装（3-4時間）
- [ ] EventListScreen 基本実装
- [ ] EventDetailScreen 基本実装
- [ ] Router 設定とナビゲーション

### Phase 2: 機能実装（4-5時間）
- [ ] GraphQL クエリ実装
- [ ] カウントダウン機能強化
- [ ] 検索・フィルタリング実装

### Phase 3: UI/UX 強化（3-4時間）
- [ ] レスポンシブデザイン
- [ ] アニメーション追加
- [ ] エラー・ローディング状態

### Phase 4: テスト・品質向上（3-4時間）
- [ ] 単体テスト実装
- [ ]統合テスト実装
- [ ] コード品質向上

**合計工数**: 13-17時間（Large サイズ）

## ✅ 受け入れ条件

### 必須条件
- [ ] イベント一覧が正常に表示される
- [ ] カウントダウンがリアルタイムで更新される
- [ ] イベント詳細が正常に表示される
- [ ] 検索・フィルタリングが動作する
- [ ] 編集・削除機能への遷移が正常に動作する

### 品質条件
- [ ] 全CI/CDパイプラインが成功
- [ ] テストカバレッジ 80% 以上
- [ ] TypeScript エラーなし
- [ ] ESLint エラーなし
- [ ] レスポンシブ対応完了

### パフォーマンス条件
- [ ] 初期表示 < 2秒
- [ ] カウントダウン更新遅延 < 100ms
- [ ] 検索応答時間 < 500ms

## 🔗 関連リソース

- **Issue**: [#17 イベント一覧・詳細表示機能の実装](https://github.com/matsuokashuhei/morrow-II/issues/17)
- **API仕様**: `docs/03-api/README.md`
- **開発計画**: `docs/05-planning/development-plan.md`
- **既存コンポーネント**: `frontend/src/components/EventCard.tsx`

## 🚀 開始準備

### 前提条件
- Docker環境の構築完了
- 既存機能の動作確認
- GraphQL API の動作確認
- Issue #16 (イベント作成機能) の完了

### ブランチ戦略
```bash
git checkout -b feature/issue-17-event-list-detail
```

### 開発環境確認
```bash
make dev
# http://localhost:3000 で動作確認
# http://localhost:8080/query で GraphQL Playground 確認
```

---

**作成日**: 2025年7月19日
**作成者**: AI Assistant
**レビュー**: 要レビュー
**ステータス**: 承認待ち
