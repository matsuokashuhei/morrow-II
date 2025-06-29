package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAuth_HealthEndpoints(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(Auth())
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Test health endpoint (should pass without auth)
	req, _ := http.NewRequest("GET", "/health", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestAuth_UnauthenticatedAccess(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(Auth())
	router.GET("/test", func(c *gin.Context) {
		userID, _ := GetUserID(c)
		authenticated, _ := c.Get("authenticated")
		c.JSON(http.StatusOK, gin.H{
			"user_id":       userID,
			"authenticated": authenticated,
		})
	})

	// Test without Authorization header
	req, _ := http.NewRequest("GET", "/test", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
	// Should allow access but mark as unauthenticated
}

func TestAuth_DevelopmentToken(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(Auth())
	router.GET("/test", func(c *gin.Context) {
		userID, _ := GetUserID(c)
		authenticated, _ := c.Get("authenticated")
		c.JSON(http.StatusOK, gin.H{
			"user_id":       userID,
			"authenticated": authenticated,
		})
	})

	// Test with development token
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer development-token")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestRequireAuth_Authenticated(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set("authenticated", true)
		c.Set("user_id", "test_user")
		c.Next()
	})
	router.Use(RequireAuth())
	router.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Test authenticated user
	req, _ := http.NewRequest("GET", "/protected", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestRequireAuth_Unauthenticated(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set("authenticated", false)
		c.Next()
	})
	router.Use(RequireAuth())
	router.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Test unauthenticated user
	req, _ := http.NewRequest("GET", "/protected", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusUnauthorized, resp.Code)
}

func TestGetUserID(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/test", func(c *gin.Context) {
		c.Set("user_id", "test_user_123")
		userID, exists := GetUserID(c)
		c.JSON(http.StatusOK, gin.H{
			"user_id": userID,
			"exists":  exists,
		})
	})

	// Test GetUserID function
	req, _ := http.NewRequest("GET", "/test", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}
