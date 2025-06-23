package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/internal/config"
	"github.com/matsuokashuhei/morrow-backend/internal/handler"
	"github.com/matsuokashuhei/morrow-backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.New()

	// Set Gin mode
	if !cfg.IsDevelopment() {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	router := gin.New()

	// Add middleware
	router.Use(middleware.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())

	// Health check endpoints
	healthHandler := handler.NewHealthHandler()
	router.GET("/health", healthHandler.Health)
	router.GET("/ping", healthHandler.Ping)

	// API routes
	v1 := router.Group("/api/v1")
	{
		v1.GET("/status", healthHandler.Health)
	}

	// Start server
	log.Printf("Starting server on port %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Env)
	log.Printf("Database URL: %s", cfg.DatabaseURL())
	
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
