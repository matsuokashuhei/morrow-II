package graph_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/ent/enttest"
	"github.com/matsuokashuhei/morrow-backend/graph"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	_ "github.com/lib/pq"
)

type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

type GraphQLResponse struct {
	Data   interface{} `json:"data"`
	Errors interface{} `json:"errors"`
}

func setupTestRouter(client *ent.Client) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/graphql", graph.GraphQLHandler(client))
	return router
}

func TestGraphQL_Users(t *testing.T) {
	ctx := context.Background()

	// Create in-memory SQLite client
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	// Create test user
	_, err := client.User.
		Create().
		SetEmail("test@example.com").
		SetName("Test User").
		Save(ctx)
	require.NoError(t, err)

	// Setup router
	router := setupTestRouter(client)

	// Test query
	query := GraphQLRequest{
		Query: `{ users { id email name } }`,
	}

	body, err := json.Marshal(query)
	require.NoError(t, err)

	req := httptest.NewRequest("POST", "/graphql", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response GraphQLResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.NotNil(t, response.Data)
	assert.Nil(t, response.Errors)
}

func TestGraphQL_CreateUser(t *testing.T) {
	// Create in-memory SQLite client
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	// Setup router
	router := setupTestRouter(client)

	// Test mutation
	query := GraphQLRequest{
		Query: `mutation {
			createUser(input: {
				email: "new@example.com",
				name: "New User"
			}) {
				id
				email
				name
				createdAt
			}
		}`,
	}

	body, err := json.Marshal(query)
	require.NoError(t, err)

	req := httptest.NewRequest("POST", "/graphql", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response GraphQLResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.NotNil(t, response.Data)
	assert.Nil(t, response.Errors)
}

func TestGraphQL_CreateEvent(t *testing.T) {
	ctx := context.Background()

	// Create in-memory SQLite client
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	// Create test user first
	user, err := client.User.
		Create().
		SetEmail("creator@example.com").
		SetName("Creator").
		Save(ctx)
	require.NoError(t, err)

	// Setup router
	router := setupTestRouter(client)

	// Test mutation
	query := GraphQLRequest{
		Query: `mutation {
			createEvent(input: {
				title: "Test Event",
				description: "A test event",
				startTime: "2025-12-25T18:00:00Z",
				endTime: "2025-12-25T23:00:00Z",
				creatorId: "` + strconv.Itoa(user.ID) + `"
			}) {
				id
				title
				description
				startTime
				endTime
				visibility
			}
		}`,
	}

	body, err := json.Marshal(query)
	require.NoError(t, err)

	req := httptest.NewRequest("POST", "/graphql", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response GraphQLResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.NotNil(t, response.Data)
	assert.Nil(t, response.Errors)
}
