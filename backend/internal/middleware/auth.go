package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// AuthMiddleware handles authentication
// TODO: Integrate with Amazon Cognito in Phase 2
func Auth() gin.HandlerFunc {
	logger := InitLogger()
	
	return func(c *gin.Context) {
		// Skip authentication for health check endpoints
		if strings.HasPrefix(c.Request.URL.Path, "/health") ||
			strings.HasPrefix(c.Request.URL.Path, "/ping") {
			c.Next()
			return
		}

		// For MVP phase, we'll skip authentication
		// In Phase 2, this will validate Cognito JWT tokens
		authHeader := c.GetHeader("Authorization")

		// Basic auth header validation structure
		if authHeader == "" {
			// In MVP, we allow unauthenticated access for local usage
			// Set a default user context for development
			logger.WithFields(logrus.Fields{
				"path":   c.Request.URL.Path,
				"method": c.Request.Method,
				"ip":     c.ClientIP(),
			}).Debug("Unauthenticated access allowed in MVP mode")

			c.Set("user_id", "local_user")
			c.Set("authenticated", false)
			c.Next()
			return
		}

		// TODO: Implement JWT token validation with Cognito
		// For now, accept any Bearer token for development
		if strings.HasPrefix(authHeader, "Bearer ") {
			// Extract token (will be validated against Cognito in Phase 2)
			token := strings.TrimPrefix(authHeader, "Bearer ")

			// TODO: Validate token with Cognito
			if token == "development-token" {
				logger.WithFields(logrus.Fields{
					"user_id": "dev_user",
					"path":    c.Request.URL.Path,
					"method":  c.Request.Method,
				}).Info("Development token authenticated")

				c.Set("user_id", "dev_user")
				c.Set("authenticated", true)
				c.Next()
				return
			}
		}

		// Invalid authentication
		logger.WithFields(logrus.Fields{
			"path":        c.Request.URL.Path,
			"method":      c.Request.Method,
			"ip":          c.ClientIP(),
			"auth_header": authHeader != "",
		}).Warn("Authentication failed")

		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "unauthorized",
			"message": "Invalid or missing authentication token",
		})
		c.Abort()
	}
}

// RequireAuth ensures the user is authenticated
func RequireAuth() gin.HandlerFunc {
	logger := InitLogger()
	
	return func(c *gin.Context) {
		authenticated, exists := c.Get("authenticated")
		if !exists || !authenticated.(bool) {
			logger.WithFields(logrus.Fields{
				"path":   c.Request.URL.Path,
				"method": c.Request.Method,
				"ip":     c.ClientIP(),
			}).Warn("Authentication required but not provided")

			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "authentication_required",
				"message": "This endpoint requires authentication",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

// GetUserID extracts user ID from context
func GetUserID(c *gin.Context) (string, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return "", false
	}
	return userID.(string), true
}
