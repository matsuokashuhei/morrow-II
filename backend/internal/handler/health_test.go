package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
)

func TestHealthHandler_Health(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()

	// Create mock database client and logger
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel) // Suppress logs during testing

	// For testing, we pass nil for the database client since health check will handle it gracefully
	healthHandler := NewHealthHandler(nil, logger)
	router.GET("/health", healthHandler.Health)

	// Create request
	req, _ := http.NewRequest("GET", "/health", nil)
	resp := httptest.NewRecorder()

	// Execute
	router.ServeHTTP(resp, req)

	// Assert
	assert.Equal(t, http.StatusServiceUnavailable, resp.Code) // Database unavailable should return 503

	var response map[string]interface{}
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "ok", response["status"])
	assert.Equal(t, "Morrow API is running", response["message"])
	assert.Equal(t, "0.1.0", response["version"])

	// Check database status (should be unavailable for nil client)
	database := response["database"].(map[string]interface{})
	assert.Equal(t, "unavailable", database["status"])
}

func TestHealthHandler_Ping(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()

	// Create mock logger
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel) // Suppress logs during testing

	healthHandler := NewHealthHandler(nil, logger)
	router.GET("/ping", healthHandler.Ping)

	// Create request
	req, _ := http.NewRequest("GET", "/ping", nil)
	resp := httptest.NewRecorder()

	// Execute
	router.ServeHTTP(resp, req)

	// Assert
	assert.Equal(t, http.StatusOK, resp.Code)

	var response map[string]interface{}
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "pong", response["message"])
}
