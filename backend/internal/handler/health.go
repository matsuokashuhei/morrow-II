package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/internal/database"
	"github.com/sirupsen/logrus"
)

type HealthHandler struct {
	dbClient *database.Client
	logger   *logrus.Logger
}

func NewHealthHandler(dbClient *database.Client, logger *logrus.Logger) *HealthHandler {
	return &HealthHandler{
		dbClient: dbClient,
		logger:   logger,
	}
}

func (h *HealthHandler) Health(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// Database health check
	dbHealth := "ok"
	var dbError string
	if h.dbClient == nil {
		dbHealth = "unavailable"
		dbError = "database client not initialized"
	} else if err := h.dbClient.HealthCheck(ctx); err != nil {
		dbHealth = "error"
		dbError = err.Error()
		h.logger.WithError(err).Error("Database health check failed")
	}

	response := gin.H{
		"status":    "ok",
		"message":   "Morrow API is running",
		"version":   "0.1.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"database": gin.H{
			"status": dbHealth,
		},
	}

	// Add error information if database check failed
	if dbError != "" {
		response["database"].(gin.H)["error"] = dbError
	}

	// Return appropriate status code
	statusCode := http.StatusOK
	if dbHealth != "ok" {
		statusCode = http.StatusServiceUnavailable
	}

	c.JSON(statusCode, response)
}

func (h *HealthHandler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message":   "pong",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
