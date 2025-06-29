package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/internal/database"
)

func main() {
	ctx := context.Background()

	// データベースクライアントの作成
	client, err := database.NewClient()
	if err != nil {
		log.Fatalf("Failed to create database client: %v", err)
	}
	defer client.Close()

	// マイグレーション実行
	if err := database.AutoMigrate(ctx, client); err != nil {
		log.Fatalf("Failed to run migration: %v", err)
	}

	// テストデータの作成
	if err := createTestData(ctx, client); err != nil {
		log.Fatalf("Failed to create test data: %v", err)
	}

	fmt.Println("✅ Ent schema setup completed successfully!")
}

func createTestData(ctx context.Context, client *ent.Client) error {
	// ユーザーの作成
	user, err := client.User.
		Create().
		SetEmail("test@example.com").
		SetName("Test User").
		Save(ctx)
	if err != nil {
		return fmt.Errorf("failed creating user: %v", err)
	}
	fmt.Printf("Created user: %v\n", user)

	// イベントの作成
	event, err := client.Event.
		Create().
		SetTitle("誕生日パーティー").
		SetDescription("友達の誕生日を祝う").
		SetStartTime(time.Now().Add(24 * time.Hour)).
		SetEndTime(time.Now().Add(28 * time.Hour)).
		SetEmoji("🎉").
		SetVisibility("private").
		SetCreator(user).
		Save(ctx)
	if err != nil {
		return fmt.Errorf("failed creating event: %v", err)
	}
	fmt.Printf("Created event: %v\n", event)

	// 参加者の作成（作成者は自動的にownerとして参加）
	participant, err := client.Participant.
		Create().
		SetRole("owner").
		SetStatus("accepted").
		SetUser(user).
		SetEvent(event).
		Save(ctx)
	if err != nil {
		return fmt.Errorf("failed creating participant: %v", err)
	}
	fmt.Printf("Created participant: %v\n", participant)

	// データの取得テスト
	events, err := client.Event.
		Query().
		WithCreator().
		WithParticipants(func(q *ent.ParticipantQuery) {
			q.WithUser()
		}).
		All(ctx)
	if err != nil {
		return fmt.Errorf("failed querying events: %v", err)
	}

	for _, e := range events {
		fmt.Printf("Event: %s, Creator: %s, Participants: %d\n",
			e.Title, e.Edges.Creator.Name, len(e.Edges.Participants))
	}

	return nil
}
