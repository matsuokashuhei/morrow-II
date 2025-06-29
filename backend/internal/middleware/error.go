package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ErrorHandler handles errors and provides consistent error responses
func ErrorHandler() gin.HandlerFunc {
	logger := InitLogger()
	
	return func(c *gin.Context) {
		c.Next()

		// Handle any errors that occurred during request processing
		if len(c.Errors) > 0 {
			err := c.Errors.Last()

			// Determine error type and status code
			var statusCode int
			var errorType string

			switch err.Type {
			case gin.ErrorTypePublic:
				statusCode = http.StatusBadRequest
				errorType = "validation_error"
			case gin.ErrorTypeBind:
				statusCode = http.StatusBadRequest
				errorType = "binding_error"
			default:
				statusCode = http.StatusInternalServerError
				errorType = "internal_error"
			}

			// Log the error with context
			logger.WithFields(logrus.Fields{
				"error_type":   errorType,
				"status_code":  statusCode,
				"path":         c.Request.URL.Path,
				"method":       c.Request.Method,
				"user_agent":   c.Request.UserAgent(),
				"ip":           c.ClientIP(),
				"error_detail": err.Error(),
			}).Error("Request processing error")

			// Return consistent error response
			c.JSON(statusCode, gin.H{
				"error": gin.H{
					"type":    errorType,
					"message": err.Error(),
				},
				"success": false,
			})

			// Prevent other handlers from running
			c.Abort()
		}
	}
}

// APIError represents a structured API error
type APIError struct {
	Type    string `json:"type"`
	Message string `json:"message"`
	Code    int    `json:"code,omitempty"`
}

// NewAPIError creates a new API error
func NewAPIError(errorType, message string, code int) *APIError {
	return &APIError{
		Type:    errorType,
		Message: message,
		Code:    code,
	}
}

// Error implements the error interface
func (e *APIError) Error() string {
	return e.Message
}

// RespondWithError sends a consistent error response
func RespondWithError(c *gin.Context, statusCode int, errorType, message string) {
	logger := InitLogger()
	
	logger.WithFields(logrus.Fields{
		"status_code": statusCode,
		"error_type":  errorType,
		"message":     message,
		"path":        c.Request.URL.Path,
		"method":      c.Request.Method,
		"ip":          c.ClientIP(),
	}).Error("API Error Response")

	c.JSON(statusCode, gin.H{
		"error": gin.H{
			"type":    errorType,
			"message": message,
		},
		"success": false,
	})
}

// RespondWithSuccess sends a consistent success response
func RespondWithSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"data":    data,
		"success": true,
	})
}
