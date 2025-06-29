package main

import (
	"github.com/matsuokashuhei/morrow-backend/internal/config"
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

	// Create router
	router := routes.SetupRoutes(cfg, logger)

	// Log server start information
	logger.WithField("port", cfg.Port).
		WithField("environment", cfg.Env).
		WithField("database_host", cfg.DatabaseHost()).
		WithField("database_port", cfg.DatabasePort()).
		WithField("database_name", cfg.DatabaseName()).
		Info("Starting Morrow API server")

	// Start server
	if err := router.Run(":" + cfg.Port); err != nil {
		logger.WithError(err).Fatal("Failed to start server")
	}
}
