package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/internal/config"
	"github.com/matsuokashuhei/morrow-backend/internal/handler"
	"github.com/matsuokashuhei/morrow-backend/internal/middleware"
	"github.com/sirupsen/logrus"
)

// SetupRoutes configures all application routes
func SetupRoutes(cfg *config.Config, logger *logrus.Logger) *gin.Engine {
	// Create router
	router := gin.New()

	// Add global middleware
	router.Use(middleware.LoggerMiddleware(logger))
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.Auth())
	router.Use(middleware.ErrorHandler())

	// Initialize handlers
	healthHandler := handler.NewHealthHandler()

	// Public routes (no authentication required)
	setupPublicRoutes(router, healthHandler, logger)

	// API v1 routes
	setupAPIV1Routes(router, healthHandler, logger)

	return router
}

// setupPublicRoutes configures public routes that don't require authentication
func setupPublicRoutes(router *gin.Engine, healthHandler *handler.HealthHandler, logger *logrus.Logger) {
	// Health check endpoints
	router.GET("/health", healthHandler.Health)
	router.GET("/ping", healthHandler.Ping)

	logger.Info("Public routes configured")

	// Add other public endpoints here
	// e.g., user registration, password reset, etc.
}

// setupAPIV1Routes configures API v1 routes
func setupAPIV1Routes(router *gin.Engine, healthHandler *handler.HealthHandler, logger *logrus.Logger) {
	v1 := router.Group("/api/v1")

	// Public API endpoints
	v1.GET("/status", healthHandler.Health)

	// Authentication required endpoints
	authRequired := v1.Group("/")
	authRequired.Use(middleware.RequireAuth())
	{
		// TODO: Add authenticated endpoints here in future phases
		// authRequired.GET("/profile", userHandler.GetProfile)
		// authRequired.POST("/events", eventHandler.CreateEvent)
		// authRequired.GET("/events", eventHandler.ListEvents)
	}

	logger.Info("API v1 routes configured")

	// GraphQL endpoint (will be added in Phase 1)
	// v1.POST("/graphql", graphqlHandler.Handle)
	// v1.GET("/graphql", graphqlHandler.Playground)
}
