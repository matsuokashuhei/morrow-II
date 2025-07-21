# SOW: Navigation Test-ID Mismatch Fix

## 問題の概要

E2Eテストの2つのテストが失敗しています：
- `should display breadcrumb navigation from home`
- `should update URL when navigating from different pages`

**エラー**: `Target page, context or browser has been closed` (30秒タイムアウト)

## 根本原因の分析

### 1. Test-ID の不一致
- **期待値**: `[data-testid="events-list-link"]`, `[data-testid="events-link"]`
- **実際の実装**: `nav-イベント一覧` (日本語)
- **セレクタ定義**: `navigation.eventsLink: '[data-testid="nav-events"]'`

### 2. Navigation.tsx の実装
```tsx
data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
```
- 「イベント一覧」→ `nav-イベント一覧` となる
- 英語化されていない

### 3. App.tsx の navigationItems
```tsx
{ label: 'イベント一覧', to: ROUTES.EVENTS, active: false }
```

## 修正計画

### A案：Navigation.tsx を修正（推奨）
labelを英語キーに基づくtest-idに変更
```tsx
const getTestId = (label: string) => {
  const mapping = {
    'ホーム': 'nav-home',
    'イベント一覧': 'nav-events', 
    'GraphQL Test': 'nav-graphql-test'
  };
  return mapping[label] || `nav-${label.toLowerCase().replace(/\s+/g, '-')}`;
};
```

### B案：テストコードを修正
現在の日本語test-idに合わせてテストを修正

### C案：セレクタファイルの統一
test-data.tsとNavigation.tsxの完全な一致

## 実装方針

**A案を採用**: Navigation.tsxを修正してtest-idを統一
- 英語ベースのtest-idで一貫性を保つ
- 既存のセレクタ定義と一致させる
- 国際化対応にも適している

## 検証計画

1. Navigation.tsx修正
2. ローカルでE2Eテスト実行
3. 失敗していた2つのテストが成功することを確認
4. CI/CDでの全体テスト実行

## 成功基準

- 2つの失敗テストが成功
- 他のナビゲーション関連テストが引き続き動作
- CI/CDパイプラインが完全成功

## リスク評価

- **リスク**: 他のテストへの影響
- **軽減策**: 段階的修正とテスト実行での確認
