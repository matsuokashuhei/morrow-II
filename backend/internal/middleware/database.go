package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/internal/database"
)

const DatabaseClientKey = "database_client"

// DatabaseMiddleware injects the database client into the request context
func DatabaseMiddleware(dbClient *database.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(DatabaseClientKey, dbClient)
		c.Next()
	}
}

// GetDatabaseClient retrieves the database client from the Gin context
func GetDatabaseClient(c *gin.Context) (*database.Client, bool) {
	client, exists := c.Get(DatabaseClientKey)
	if !exists {
		return nil, false
	}
	
	dbClient, ok := client.(*database.Client)
	return dbClient, ok
}
