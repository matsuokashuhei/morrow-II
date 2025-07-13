# Statement of Work (SOW) - Issue #16: イベント作成機能の実装

**プロジェクト**: Morrow II - Event Countdown Sharing App
**作成日**: 2025年7月13日
**工数見積もり**: 10-15時間
**優先度**: P1-Critical
**フェーズ**: Phase 1 MVP開発

## 1. プロジェクト概要

### 1.1 目的
ユーザーがアプリでイベントを作成できる包括的な機能を実装し、イベント管理の基盤機能を提供する。

### 1.2 背景
- 既存のGraphQL APIとUIコンポーネントを活用
- React Web版での実装（React Native仕様から変更）
- MVP開発フェーズの重要機能として実装
- ユーザーの主要な価値提供機能

### 1.3 スコープ
**含まれるもの**:
- イベント作成フォームUI実装
- 日時選択機能（DateTimePicker）
- バリデーション機能（リアルタイム）
- GraphQL mutation統合
- エラーハンドリング
- 作成成功時の遷移処理
- レスポンシブデザイン対応

**含まれないもの**:
- イベント編集機能（別Issue）
- イベント削除機能（別Issue）
- 招待機能（Phase 2）
- 画像アップロード（Phase 3）

## 2. 技術仕様

### 2.1 技術スタック
- **フレームワーク**: React 18.2.0 + TypeScript
- **フォーム管理**: React Hook Form
- **バリデーション**: Yup schema validation
- **GraphQL**: Apollo Client 3.x
- **日時選択**: React DatePicker
- **スタイリング**: Tailwind CSS
- **テスト**: Jest + React Testing Library

### 2.2 既存リソース活用
```
既存リソース（活用）:
├── GraphQL Schema ✅
│   ├── Event type定義完了
│   ├── CreateEventInput完了
│   └── createEvent mutation完了
├── UI Components ✅
│   ├── FormContainer
│   ├── FormField
│   ├── Button
│   ├── Card
│   ├── DatePicker
│   └── TextArea
├── GraphQL Client ✅
│   ├── Apollo Client設定済み
│   ├── Generated types完了
│   └── Mutation hooks基盤完了
└── 型定義 ✅
    ├── Event type完了
    └── Form validation types完了
```

## 3. 実装内容詳細

### 3.1 イベント作成フォームコンポーネント

#### 3.1.1 ファイル構成
```
src/components/forms/
├── EventCreationForm.tsx        # メインフォームコンポーネント
├── EventDateTimeSection.tsx     # 日時選択セクション
├── EventDetailsSection.tsx      # イベント詳細セクション
└── index.ts                     # エクスポート
```

#### 3.1.2 機能仕様

**EventCreationForm.tsx**:
- React Hook Formベースの実装
- Yupスキーマバリデーション
- リアルタイムバリデーション
- GraphQL mutation統合
- ローディング状態管理
- エラーハンドリング

**フォームフィールド**:
```typescript
interface EventFormData {
  title: string;           // 必須、1-100文字
  description?: string;    // 任意、最大500文字
  startTime: Date;         // 必須、現在時刻以降
  endTime: Date;           // 必須、開始時刻以降
  emoji?: string;          // 任意、絵文字1文字
  visibility: EventVisibility; // デフォルト: private
}
```

### 3.2 日時選択機能

#### 3.2.1 EventDateTimeSection.tsx
- 開始日時・終了日時の選択
- 日時の相関バリデーション
- 時間帯設定のプリセット機能
- タイムゾーン考慮

#### 3.2.2 バリデーションルール
```typescript
const eventValidationSchema = yup.object({
  title: yup.string()
    .required('イベント名は必須です')
    .min(1, '1文字以上入力してください')
    .max(100, '100文字以内で入力してください'),

  description: yup.string()
    .max(500, '500文字以内で入力してください'),

  startTime: yup.date()
    .required('開始日時は必須です')
    .min(new Date(), '現在時刻以降を選択してください'),

  endTime: yup.date()
    .required('終了日時は必須です')
    .min(yup.ref('startTime'), '開始日時以降を選択してください'),

  emoji: yup.string()
    .matches(/^.{0,1}$/, '絵文字は1文字以内で入力してください'),
});
```

### 3.3 画面実装

#### 3.3.1 EventCreationScreen.tsx
**ファイル**: `src/screens/EventCreationScreen.tsx`

**機能要件**:
- フォーム全体のレイアウト
- ナビゲーション処理
- 成功時の遷移
- エラー時の処理

**UI構成**:
```
Header
├── Back Button
├── Title: "新しいイベント"
└── Save Button (フォーム送信)

Form Container
├── EventDetailsSection
│   ├── Title Input
│   ├── Description TextArea
│   └── Emoji Picker
├── EventDateTimeSection
│   ├── Start DateTime Picker
│   └── End DateTime Picker
└── Visibility Settings
    └── Radio Button Group

Footer
├── Cancel Button
└── Create Event Button
```

### 3.4 GraphQL統合

#### 3.4.1 カスタムフック実装
**ファイル**: `src/hooks/useCreateEvent.ts`

```typescript
interface UseCreateEventReturn {
  createEvent: (data: EventFormData) => Promise<Event>;
  loading: boolean;
  error?: ApolloError;
}

export const useCreateEvent = (): UseCreateEventReturn => {
  // Apollo useMutation hook
  // エラーハンドリング
  // 成功時のキャッシュ更新
  // ローディング状態管理
}
```

#### 3.4.2 型安全性確保
- GraphQL Codegenによる型生成
- TypeScript strict mode対応
- Runtime型チェック（zod/yup）

## 4. UI/UX設計

### 4.1 デザイン原則
- **直感的操作**: ステップバイステップの入力フロー
- **リアルタイムフィードバック**: バリデーションとプレビュー
- **エラー防止**: 適切なデフォルト値と制約
- **アクセシビリティ**: ARIA labels, キーボードナビゲーション

### 4.2 レスポンシブ対応
```css
/* Mobile First Design */
.event-form {
  /* Mobile: ~768px */
  @apply p-4 space-y-4;

  /* Tablet: 768px~ */
  @media (min-width: 768px) {
    @apply p-6 space-y-6 max-w-2xl mx-auto;
  }

  /* Desktop: 1024px~ */
  @media (min-width: 1024px) {
    @apply p-8 grid grid-cols-2 gap-8;
  }
}
```

### 4.3 インタラクション設計
1. **フォーム入力**: 段階的な入力サポート
2. **バリデーション**: リアルタイムフィードバック
3. **保存**: 明確な成功・エラー表示
4. **ナビゲーション**: 自然な画面遷移

## 5. テスト戦略

### 5.1 単体テスト
```
src/components/forms/__tests__/
├── EventCreationForm.test.tsx
├── EventDateTimeSection.test.tsx
└── EventDetailsSection.test.tsx

src/screens/__tests__/
└── EventCreationScreen.test.tsx

src/hooks/__tests__/
└── useCreateEvent.test.tsx
```

### 5.2 テストケース
**機能テスト**:
- フォーム入力の正常動作
- バリデーションの動作確認
- GraphQL mutation呼び出し
- エラーハンドリング
- 成功時の画面遷移

**E2Eテスト**:
- イベント作成の完全フロー
- 各種エラーケースの確認
- レスポンシブ動作の確認

### 5.3 カバレッジ目標
- **コンポーネント**: 90%以上
- **ロジック**: 95%以上
- **統合テスト**: 主要パス100%

## 6. 実装計画

### 6.1 開発フェーズ

**Phase 1: コンポーネント実装（4-5時間）**
- EventCreationForm基本実装
- EventDateTimeSection実装
- EventDetailsSection実装
- 基本バリデーション

**Phase 2: 統合・画面実装（3-4時間）**
- EventCreationScreen実装
- GraphQL統合（useCreateEvent）
- ルーティング設定
- 基本テスト実装

**Phase 3: 高度な機能・テスト（3-4時間）**
- 高度なバリデーション
- エラーハンドリング強化
- レスポンシブ対応
- 包括的テスト実装

**Phase 4: 統合テスト・最適化（2-3時間）**
- E2Eテスト
- パフォーマンス最適化
- アクセシビリティ改善
- ドキュメント更新

### 6.2 マイルストーン

✅ **Milestone 1**: 基本フォーム動作確認
✅ **Milestone 2**: GraphQL統合完了
✅ **Milestone 3**: バリデーション・エラーハンドリング完了
✅ **Milestone 4**: テスト完了・デプロイ準備

## 7. 受け入れ条件

### 7.1 機能要件
- [ ] イベント作成フォームが正常に表示される
- [ ] 全てのフィールドが適切に入力できる
- [ ] 日時選択UIが正常に動作する
- [ ] リアルタイムバリデーションが動作する
- [ ] GraphQL mutationが正常に実行される
- [ ] 作成成功時にイベント一覧に遷移する
- [ ] エラー時に適切なメッセージが表示される

### 7.2 非機能要件
- [ ] レスポンシブデザインが正常に動作する
- [ ] アクセシビリティ要件を満たす
- [ ] パフォーマンス（フォーム操作の応答性）
- [ ] ブラウザ互換性（Chrome, Firefox, Safari, Edge）

### 7.3 テスト要件
- [ ] 単体テストカバレッジ90%以上
- [ ] 統合テスト主要パス100%
- [ ] E2Eテスト基本フロー通過
- [ ] エラーケーステスト完了

## 8. 技術的考慮事項

### 8.1 パフォーマンス
- コンポーネントのメモ化（React.memo, useMemo）
- フォームの最適化（debounced validation）
- GraphQL Query最適化

### 8.2 セキュリティ
- 入力値のサニタイゼーション
- XSS攻撃の防止
- CSRFトークン（Phase 2で認証実装時）

### 8.3 エラーハンドリング
- GraphQLエラーの適切な処理
- ネットワークエラーの処理
- バリデーションエラーの表示
- ユーザーフレンドリーなエラーメッセージ

## 9. 今後の拡張性

### 9.1 Phase 2で追加予定
- イベント編集機能
- イベント削除機能
- 招待機能
- 認証機能統合

### 9.2 Phase 3で追加予定
- 画像アップロード
- 繰り返しイベント
- 通知機能
- ソーシャル機能

## 10. 関連ドキュメント

- [Issue #16: イベント作成機能の実装](https://github.com/matsuokashuhei/morrow-II/issues/16)
- [API仕様書](./03-api/README.md)
- [開発計画](./05-planning/development-plan.md)
- [プロジェクト概要](./01-overview/project-overview.md)

## 11. 承認

### 11.1 レビュー担当者
- **Technical Lead**: @matsuokashuhei
- **Product Owner**: @matsuokashuhei

### 11.2 承認基準
- 機能要件の100%実装
- 受け入れテスト通過
- コードレビュー承認
- ドキュメント更新完了

---

**Document Version**: 1.0
**Last Updated**: 2025年7月13日
**Next Review**: 実装完了時
