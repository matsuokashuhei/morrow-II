# React Webアプリケーション構造

## 概要
MorrowプロジェクトのReact + Vite + TypeScriptによるWebフロントエンドの構造と実装について説明します。

## プロジェクト構造

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx           # ボタンコンポーネント
│   │       ├── Card.tsx             # カードコンポーネント
│   │       └── index.ts             # コンポーネント統合
│   ├── screens/
│   │   └── HomeScreen.tsx           # ホーム画面
│   ├── hooks/                       # カスタムフック（現在空）
│   ├── types/
│   │   ├── index.ts                 # 共通型定義
│   │   └── jest-dom.d.ts            # Jest DOM型定義
│   ├── utils/
│   │   ├── cn.ts                    # CSS クラス結合ユーティリティ
│   │   └── test-utils.tsx           # React Testing Library設定
│   ├── __tests__/                   # テストファイル
│   ├── index.css                    # Tailwind CSS設定
│   └── main.tsx                     # アプリケーションエントリーポイント
├── App.tsx                          # ルートコンポーネント
├── index.html                       # HTMLテンプレート
├── package.json                     # 依存関係とスクリプト
├── vite.config.ts                   # Vite設定
├── tailwind.config.js               # Tailwind CSS設定
├── tsconfig.json                    # TypeScript設定
├── jest.config.json                 # Jest設定
├── .eslintrc.cjs                    # ESLint設定
├── .prettierrc                      # Prettier設定
└── Dockerfile.dev                   # 開発用Docker設定
```

## 実装済み機能 ✅

### 1. React + Vite セットアップ
- **React 18.2.0**: 最新の React フィーチャー対応
- **Vite 4.x**: 高速な開発サーバーとビルド
- **TypeScript**: 型安全な開発環境
- **Hot Module Replacement**: リアルタイムコード更新

### 2. UI フレームワーク統合
- **Tailwind CSS**: ユーティリティファーストCSS
- **カスタムコンポーネント**: Button, Card等の基本UIコンポーネント
- **レスポンシブデザイン**: モバイルファースト設計
- **カラーシステム**: カスタムカラーパレット設定

### 3. ルーティング設定
- **React Router 6.20.1**: SPA ルーティング
- **Future flags**: React Router v7 準備済み設定
- **ネストされたルート**: 複雑なUI構造対応準備

### 4. 状態管理
- **Zustand 4.4.7**: 軽量状態管理ライブラリ
- **TypeScript対応**: 型安全な状態管理

### 5. GraphQL統合
- **Apollo Client 3.8.8**: GraphQLクライアント
- **型安全**: GraphQLスキーマとの統合準備

### 6. テスト環境
- **Jest**: JavaScriptテストフレームワーク
- **React Testing Library**: Reactコンポーネントテスト
- **カバレッジレポート**: テストカバレッジ測定

### 7. 開発ツール
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Husky + lint-staged**: Git hooks によるコード品質保証
- **Path aliases**: `@/` エイリアス設定

## 技術仕様

### 依存関係（主要）
```json
{
  "dependencies": {
    "@apollo/client": "^3.8.8",
    "graphql": "^16.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "zustand": "^4.4.7"
  }
}
```

### 開発設定
- **Port**: 3000 (Vite dev server)
- **Host binding**: Docker対応（0.0.0.0）
- **Source maps**: 本番ビルドでも生成
- **Build output**: `dist/` ディレクトリ

## React Native からの移行

### 移行完了項目 ✅
- [x] React Native → React 移行
- [x] Expo設定削除（`.expo/` ディレクトリ削除済み）
- [x] 不要なBabel設定削除（`babel.config.js` 削除済み）
- [x] Vite ビルドシステム導入
- [x] Web最適化設定
- [x] Docker設定更新

**移行完了**: React Nativeから完全にReactへの移行が完了しました。

## 開発ワークフロー

### 開発サーバー起動
```bash
# Docker Compose 経由（推奨）
docker-compose up frontend

# または直接実行
npm run dev
```

### ビルド・テスト
```bash
# 本番ビルド
npm run build

# テスト実行
npm test

# テストカバレッジ
npm run test:coverage

# Lint チェック
npm run lint

# コードフォーマット
npm run format
```

## 今後の拡張予定

### Phase 1（継続）
- [ ] GraphQL クエリ・ミューテーション実装
- [ ] カスタムフック開発（useAuth, useEvents）
- [ ] 追加UIコンポーネント

### Phase 2
- [ ] 認証システム統合
- [ ] ユーザー管理画面
- [ ] イベント管理画面

### Phase 3
- [ ] リアルタイム更新（GraphQL Subscription）
- [ ] 高度なUI/UX機能
- [ ] パフォーマンス最適化

---

**作成日**: 2025年7月12日
**最終更新**: 2025年7月12日（React Native残存ファイル削除完了）
**バージョン**: 1.1
**関連**: React Native → React 移行 (PR #20)
