package main

import (
	"context"
	"fmt"
	"time"

	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/internal/config"
	"github.com/matsuokashuhei/morrow-backend/internal/database"
	"github.com/matsuokashuhei/morrow-backend/internal/middleware"
	"github.com/sirupsen/logrus"
)

func main() {
	ctx := context.Background()

	// Initialize logger
	logger := middleware.InitLogger()

	// Load configuration
	cfg := config.New()
	if err := cfg.Validate(); err != nil {
		logger.WithError(err).Fatal("Configuration validation failed")
	}

	// データベースクライアントの作成
	client, err := database.NewClient(cfg, logger)
	if err != nil {
		logger.WithError(err).Fatal("Failed to create database client")
	}
	defer client.Close()

	// マイグレーション実行
	if err := client.AutoMigrate(ctx); err != nil {
		logger.WithError(err).Fatal("Failed to run migration")
	}

	// ヘルスチェック実行
	if err := client.HealthCheck(ctx); err != nil {
		logger.WithError(err).Fatal("Database health check failed")
	}

	// テストデータの作成
	if err := createTestData(ctx, client.Client, logger); err != nil {
		logger.WithError(err).Fatal("Failed to create test data")
	}

	fmt.Println("✅ Ent schema setup completed successfully!")
}

func createTestData(ctx context.Context, client *ent.Client, logger *logrus.Logger) error {
	// ユーザーの作成
	user, err := client.User.
		Create().
		SetEmail("test@example.com").
		SetName("Test User").
		Save(ctx)
	if err != nil {
		return fmt.Errorf("failed creating user: %v", err)
	}
	logger.WithField("user_id", user.ID).Info("Created test user")

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
	logger.WithField("event_id", event.ID).Info("Created test event")

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
	logger.WithField("participant_id", participant.ID).Info("Created test participant")

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
		logger.WithFields(logrus.Fields{
			"event_title":       e.Title,
			"creator_name":      e.Edges.Creator.Name,
			"participants_count": len(e.Edges.Participants),
		}).Info("Retrieved event data")
	}

	return nil
}
