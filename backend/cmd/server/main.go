package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/matsuokashuhei/morrow-backend/internal/config"
	"github.com/matsuokashuhei/morrow-backend/internal/database"
	"github.com/matsuokashuhei/morrow-backend/internal/middleware"
	"github.com/matsuokashuhei/morrow-backend/internal/routes"
)

func main() {
	// Initialize structured logging
	logger := middleware.InitLogger()

	// Set Gin mode based on environment
	middleware.SetGinMode()

	// Load configuration
	cfg := config.New()

	// Validate configuration
	if err := cfg.Validate(); err != nil {
		logger.WithError(err).Fatal("Configuration validation failed")
	}

	// Initialize database connection
	dbClient, err := database.NewClient(cfg, logger)
	if err != nil {
		logger.WithError(err).Fatal("Failed to connect to database")
	}
	defer func() {
		if err := dbClient.Close(); err != nil {
			logger.WithError(err).Error("Failed to close database connection")
		}
	}()

	// Run database migration
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := dbClient.AutoMigrate(ctx); err != nil {
		logger.WithError(err).Fatal("Database migration failed")
	}

	// Perform initial health check
	if err := dbClient.HealthCheck(ctx); err != nil {
		logger.WithError(err).Fatal("Database health check failed")
	}

	// Create router with database client
	router := routes.SetupRoutes(cfg, logger, dbClient)

	// Log server start information
	logger.WithField("port", cfg.Port).
		WithField("environment", cfg.Env).
		WithField("database_host", cfg.DatabaseHost()).
		WithField("database_port", cfg.DatabasePort()).
		WithField("database_name", cfg.DatabaseName()).
		Info("Starting Morrow API server")

	// Start server in a goroutine
	go func() {
		if err := router.Run(":" + cfg.Port); err != nil {
			logger.WithError(err).Fatal("Failed to start server")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down server...")

	// Graceful shutdown with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	// Here you would add graceful shutdown for the HTTP server if using a different setup
	// For now, we just wait for the context timeout
	<-shutdownCtx.Done()

	logger.Info("Server shutdown complete")
}
