# SOW: GraphQLクライアント設定 - Issue #15

## 概要
MorrowアプリのReact WebフロントエンドにGraphQLクライアントを設定し、バックエンドGraphQL APIとの効率的な通信を実現します。この実装により、型安全で自動生成されたクエリ・ミューテーションを使用して、イベント管理機能の基盤を構築します。

## 背景
- 現在のフロントエンドはStatic UIコンポーネントのみで構成されている
- Apollo Clientは既にpackage.jsonに含まれているが、設定されていない
- バックエンドにはGraphQL API（schema.graphqls）が実装済み
- TypeScript型安全性を重視した開発が求められている

## 技術仕様

### 使用技術
- **Apollo Client** `^3.13.0` - GraphQLクライアント
- **GraphQL Code Generator** - TypeScript型定義自動生成
- **GraphQL** `^16.9.0` - GraphQLライブラリ
- **TypeScript** - 型安全性確保

### バックエンドAPI情報
- **エンドポイント**: `http://localhost:8080/api/v1/graphql`
- **Playground**: `http://localhost:8080/api/v1/graphql` (GET)
- **スキーマ**: `backend/graph/schema.graphqls`

## 実装タスク

### 1. 必要な依存関係のインストール
- `@graphql-codegen/cli`
- `@graphql-codegen/typescript`
- `@graphql-codegen/typescript-operations`
- `@graphql-codegen/typescript-react-apollo`

### 2. GraphQL Code Generation設定
- `codegen.yml` 設定ファイル作成
- TypeScript型定義生成設定
- React Hooks自動生成設定
- npm scripts追加

### 3. Apollo Client設定
- Apollo Client Provider設定
- GraphQLエンドポイント設定
- InMemoryCache設定
- エラーハンドリング設定
- App.tsxへの統合

### 4. 基本GraphQL操作の実装
- Users クエリ・ミューテーション
- Events クエリ・ミューテーション
- Participants クエリ・ミューテーション
- エラーハンドリング

### 5. カスタムフック実装
- `useUsers` フック
- `useEvents` フック
- `useCreateEvent` フック
- `useUpdateEvent` フック
- `useDeleteEvent` フック

## ファイル構成

```
frontend/
├── codegen.yml                    # GraphQL Code Generator設定
├── src/
│   ├── graphql/
│   │   ├── generated.ts           # 自動生成型定義
│   │   ├── client.ts              # Apollo Client設定
│   │   ├── queries/
│   │   │   ├── users.graphql      # User関連クエリ
│   │   │   ├── events.graphql     # Event関連クエリ
│   │   │   └── participants.graphql # Participant関連クエリ
│   │   └── hooks/
│   │       ├── index.ts           # フックのre-export
│   │       ├── useUsers.ts        # User操作フック
│   │       ├── useEvents.ts       # Event操作フック
│   │       └── useParticipants.ts # Participant操作フック
│   └── main.tsx                   # Apollo Provider統合
```

## 受け入れ条件

### 機能要件
- [ ] Apollo Clientが正常に設定されている
- [ ] GraphQLスキーマからTypeScript型が自動生成される
- [ ] 基本的なクエリ・ミューテーションが動作する
- [ ] エラーハンドリングが適切に実装されている
- [ ] 型安全性が確保されている

### 技術要件
- [ ] バックエンドGraphQL APIとの接続確認
- [ ] Code Generation が正常に動作
- [ ] TypeScriptコンパイルエラーなし
- [ ] ESLintエラーなし
- [ ] 既存テストが継続して動作

### 動作確認項目
- [ ] `npm run codegen` でコード生成成功
- [ ] Apollo Client Provider が正常に初期化
- [ ] GraphQL Playground接続確認
- [ ] 基本クエリ実行確認（users, events）
- [ ] エラーレスポンス適切ハンドリング

## 開発手順

### Phase 1: 環境設定
1. 必要な依存関係のインストール
2. GraphQL Code Generator設定
3. codegen.yml作成とnpm scripts追加

### Phase 2: Apollo Client設定
1. Apollo Client設定ファイル作成
2. App.tsxにProvider統合
3. エラーハンドリング設定

### Phase 3: GraphQL操作実装
1. 基本クエリ・ミューテーション定義
2. TypeScript型定義生成
3. カスタムフック実装

### Phase 4: テスト・検証
1. バックエンド接続テスト
2. 基本操作動作確認
3. エラーハンドリング確認
4. 既存機能への影響確認

## リスク・制約事項

### リスク
- バックエンドAPIの変更によるスキーマ不整合
- Apollo ClientとReact Router間の競合
- 既存コンポーネントへの破壊的変更

### 制約事項
- 認証機能未実装（Phase 2予定）
- リアルタイム機能未実装（Phase 3予定）
- ファイルアップロード機能未実装（Phase 3予定）

## 工数見積もり
- **合計**: 8-10時間
- **Phase 1**: 2時間（環境設定）
- **Phase 2**: 3時間（Apollo Client設定）
- **Phase 3**: 3-4時間（GraphQL操作実装）
- **Phase 4**: 1時間（テスト・検証）

## 関連ドキュメント
- [開発計画](../05-planning/development-plan.md)
- [API仕様書](../03-api/README.md)
- [バックエンド構造](../04-architecture/backend-api-structure.md)

---

**作成日**: 2025年7月13日
**担当者**: GitHub Copilot
**優先度**: High (P2)
**フェーズ**: Phase 1 MVP開発
