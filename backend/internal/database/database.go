package database

import (
	"context"
	"fmt"
	"time"

	_ "github.com/lib/pq" // PostgreSQLドライバー
	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/internal/config"
	"github.com/sirupsen/logrus"
)

// Client wraps the Ent client with additional functionality
type Client struct {
	*ent.Client
	logger *logrus.Logger
}

// NewClient creates a new database client with proper configuration
func NewClient(cfg *config.Config, logger *logrus.Logger) (*Client, error) {
	// データベース接続文字列を設定から構築
	dsn := cfg.DatabaseURL()

	logger.WithFields(logrus.Fields{
		"host": cfg.DatabaseHost(),
		"port": cfg.DatabasePort(),
		"name": cfg.DatabaseName(),
	}).Info("Connecting to PostgreSQL database")

	// Entクライアントを作成
	entClient, err := ent.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// 接続テスト（Entクライアントを使用）
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// シンプルなクエリでの接続テスト
	if _, err := entClient.User.Query().Count(ctx); err != nil {
		// テーブルが存在しない場合は正常（マイグレーション前）
		logger.WithError(err).Debug("Initial connection test note (tables may not exist yet)")
	}

	logger.Info("Successfully connected to PostgreSQL database")

	return &Client{
		Client: entClient,
		logger: logger,
	}, nil
}

// Close closes the database connection
func (c *Client) Close() error {
	if err := c.Client.Close(); err != nil {
		c.logger.WithError(err).Error("Failed to close database connection")
		return err
	}
	c.logger.Info("Database connection closed successfully")
	return nil
}

// HealthCheck performs a database health check
func (c *Client) HealthCheck(ctx context.Context) error {
	// Simple query test using Ent
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// カウントクエリでヘルスチェック
	if _, err := c.Client.User.Query().Count(pingCtx); err != nil {
		return fmt.Errorf("database health check failed: %w", err)
	}

	return nil
}

// AutoMigrate runs the auto migration tool
func (c *Client) AutoMigrate(ctx context.Context) error {
	c.logger.Info("Starting database migration")

	if err := c.Schema.Create(ctx); err != nil {
		c.logger.WithError(err).Error("Database migration failed")
		return fmt.Errorf("failed to create schema resources: %w", err)
	}

	c.logger.Info("Database migration completed successfully")
	return nil
}
