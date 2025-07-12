# 📏 開発ガイドライン

## 🎯 コード品質の基本原則

### 1. 可読性第一
- **明確な命名**: 変数・関数・クラス名から用途が明確に分かる
- **適切なコメント**: なぜその実装にしたかの理由を記述
- **一貫性**: プロジェクト全体で統一されたスタイル

### 2. 保守性の重視
- **小さな関数**: 1つの関数は1つの責任
- **低い結合度**: モジュール間の依存関係を最小限に
- **高い凝集度**: 関連する機能を適切にグループ化

### 3. テスタビリティ
- **単体テスト**: 各機能を独立してテスト可能
- **モック活用**: 外部依存を排除したテスト
- **エッジケース**: 境界条件や異常系のテスト

## 🔧 Go バックエンド ガイドライン

### プロジェクト構造
```go
// internal/handler/event.go
package handler

import (
    "context"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/matsuokashuhei/morrow-II/internal/service"
)

type EventHandler struct {
    eventService service.EventService
}

func NewEventHandler(eventService service.EventService) *EventHandler {
    return &EventHandler{
        eventService: eventService,
    }
}
```

### 命名規則
```go
// ✅ 良い例
type UserService interface {
    GetUserByID(ctx context.Context, id int) (*User, error)
    CreateUser(ctx context.Context, user *CreateUserRequest) (*User, error)
}

// ❌ 悪い例
type UsrSvc interface {
    Get(id int) *User
    Create(u *User) *User
}
```

### エラーハンドリング
```go
// ✅ 良い例
func (s *eventService) GetEvent(ctx context.Context, id int) (*Event, error) {
    event, err := s.repo.GetByID(ctx, id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, fmt.Errorf("event not found: %w", err)
        }
        return nil, fmt.Errorf("failed to get event: %w", err)
    }
    return event, nil
}

// ❌ 悪い例
func (s *eventService) GetEvent(ctx context.Context, id int) *Event {
    event, _ := s.repo.GetByID(ctx, id)
    return event
}
```

### テスト
```go
// internal/handler/event_test.go
func TestEventHandler_GetEvent(t *testing.T) {
    tests := []struct {
        name           string
        eventID        string
        mockSetup      func(*mocks.MockEventService)
        expectedStatus int
        expectedBody   string
    }{
        {
            name:    "existing event",
            eventID: "1",
            mockSetup: func(m *mocks.MockEventService) {
                m.EXPECT().GetEvent(gomock.Any(), 1).Return(&Event{
                    ID:   1,
                    Name: "Test Event",
                }, nil)
            },
            expectedStatus: http.StatusOK,
        },
        {
            name:    "non-existing event",
            eventID: "999",
            mockSetup: func(m *mocks.MockEventService) {
                m.EXPECT().GetEvent(gomock.Any(), 999).Return(nil, ErrNotFound)
            },
            expectedStatus: http.StatusNotFound,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // テスト実装
        })
    }
}
```

## 🌐 React フロントエンド ガイドライン

### コンポーネント設計
```typescript
// src/components/EventCard.tsx
import React from 'react';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const handlePress = () => {
    onPress(event.id);
  };

  return (
    <div
      className="p-4 my-2 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handlePress}
    >
      <h3 className="text-lg font-bold mb-2">{event.name}</h3>
      <p className="text-sm text-gray-600">{event.description}</p>
    </div>
  );
};
```

### Tailwind CSS スタイリング
```typescript
// ✅ 良い例：Tailwind クラスの使用
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

// ❌ 悪い例：インラインスタイル
const Button = ({ children }) => (
  <button style={{ backgroundColor: 'blue', color: 'white' }}>
    {children}
  </button>
);
```

### カスタムフック
```typescript
// src/hooks/useCountdown.ts
import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const useCountdown = (targetDate: Date): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
```

### 型定義
```typescript
// src/types/event.ts
export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}
```

### テスト
```typescript
// src/components/__tests__/EventCard.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { EventCard } from '../EventCard';

const mockEvent = {
  id: '1',
  name: 'Test Event',
  description: 'Test Description',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-02'),
  createdAt: new Date('2024-12-01'),
  updatedAt: new Date('2024-12-01'),
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    const mockOnPress = jest.fn();
    render(<EventCard event={mockEvent} onPress={mockOnPress} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onPress when clicked', () => {
    const mockOnPress = jest.fn();
    render(<EventCard event={mockEvent} onPress={mockOnPress} />);

    fireEvent.click(screen.getByText('Test Event'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });
});
```

## 🗃️ データベース設計ガイドライン

### Ent スキーマ設計
```go
// ent/schema/event.go
package schema

import (
    "time"

    "entgo.io/ent"
    "entgo.io/ent/schema/edge"
    "entgo.io/ent/schema/field"
    "entgo.io/ent/schema/index"
)

type Event struct {
    ent.Schema
}

func (Event) Fields() []ent.Field {
    return []ent.Field{
        field.String("name").
            NotEmpty().
            MaxLen(100),
        field.Text("description").
            Optional().
            MaxLen(1000),
        field.Time("start_date"),
        field.Time("end_date"),
        field.Enum("visibility").
            Values("private", "shared", "public").
            Default("private"),
        field.Time("created_at").
            Default(time.Now),
        field.Time("updated_at").
            Default(time.Now).
            UpdateDefault(time.Now),
    }
}

func (Event) Edges() []ent.Edge {
    return []ent.Edge{
        edge.From("owner", User.Type).
            Ref("events").
            Unique().
            Required(),
        edge.To("participants", Participant.Type),
    }
}

func (Event) Indexes() []ent.Index {
    return []ent.Index{
        index.Fields("start_date"),
        index.Fields("end_date"),
        index.Fields("visibility"),
    }
}
```

## 🔒 セキュリティガイドライン

### 認証・認可
```go
// internal/middleware/auth.go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
            c.Abort()
            return
        }

        // Bearer prefix を削除
        token = strings.TrimPrefix(token, "Bearer ")

        // JWT トークンの検証
        claims, err := validateJWT(token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // ユーザー情報をコンテキストに設定
        c.Set("user_id", claims.UserID)
        c.Next()
    }
}
```

### 入力検証
```go
// internal/handler/validation.go
type CreateEventRequest struct {
    Name        string    `json:"name" binding:"required,max=100"`
    Description string    `json:"description" binding:"max=1000"`
    StartDate   time.Time `json:"start_date" binding:"required"`
    EndDate     time.Time `json:"end_date" binding:"required"`
}

func (r *CreateEventRequest) Validate() error {
    if r.StartDate.After(r.EndDate) {
        return errors.New("start date must be before end date")
    }

    if r.StartDate.Before(time.Now()) {
        return errors.New("start date must be in the future")
    }

    return nil
}
```

## 📊 パフォーマンス最適化

### データベースクエリ最適化
```go
// ❌ N+1 問題
func (r *eventRepository) GetEventsWithParticipants(ctx context.Context) ([]*Event, error) {
    events, err := r.client.Event.Query().All(ctx)
    if err != nil {
        return nil, err
    }

    // 各イベントに対してクエリを実行（N+1問題）
    for _, event := range events {
        participants, _ := r.client.Participant.Query().
            Where(participant.EventID(event.ID)).
            All(ctx)
        event.Participants = participants
    }

    return events, nil
}

// ✅ 良い例
func (r *eventRepository) GetEventsWithParticipants(ctx context.Context) ([]*Event, error) {
    return r.client.Event.Query().
        WithParticipants().
        All(ctx)
}
```

## 🧪 テスト戦略

### テストピラミッド
```
    /\
   /  \
  /E2E \     <- 少数の E2E テスト
 /______\
/        \
|Integration| <- 中程度の統合テスト
|__________|
/            \
|Unit Tests | <- 大量の単体テスト
|___________|
```

### テストカバレッジ目標
- **単体テスト**: 80%以上
- **統合テスト**: 60%以上
- **E2Eテスト**: 主要フロー100%

## 📚 コードレビュー チェックリスト

### 機能性
- [ ] 要件を満たしているか
- [ ] エラーハンドリングが適切か
- [ ] エッジケースが考慮されているか

### 品質
- [ ] コードが読みやすいか
- [ ] 適切な命名がされているか
- [ ] 重複コードがないか

### セキュリティ
- [ ] 入力検証が適切か
- [ ] 認証・認可が実装されているか
- [ ] 機密情報が露出していないか

### パフォーマンス
- [ ] N+1問題がないか
- [ ] 不要な計算がないか
- [ ] メモリリークがないか

### テスト
- [ ] 適切なテストが書かれているか
- [ ] テストカバレッジが十分か
- [ ] モックが適切に使用されているか

---

**関連ドキュメント**:
- [開発ワークフロー](./development-workflow.md)
- [API仕様書](../03-api/README.md)
- [アーキテクチャ設計](../04-architecture/README.md)
- [CI/CD設定](../06-deployment/ci-cd.md)

**最終更新**: 2025年7月6日
