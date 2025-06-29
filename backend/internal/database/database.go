package database

import (
	"context"
	"fmt"
	"log"

	"github.com/matsuokashuhei/morrow-backend/ent"
	_ "github.com/lib/pq" // PostgreSQLドライバー
)

// NewClient creates a new Ent client connected to PostgreSQL
func NewClient() (*ent.Client, error) {
	// Docker Compose環境のPostgreSQL接続情報
	dsn := "host=postgres port=5432 user=morrow_user password=morrow_password dbname=morrow_dev sslmode=disable"
	
	client, err := ent.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed opening connection to postgres: %v", err)
	}

	return client, nil
}

// AutoMigrate runs the auto migration tool
func AutoMigrate(ctx context.Context, client *ent.Client) error {
	if err := client.Schema.Create(ctx); err != nil {
		return fmt.Errorf("failed creating schema resources: %v", err)
	}
	log.Println("Database migration completed successfully")
	return nil
}
