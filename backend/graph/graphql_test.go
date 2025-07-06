package graph

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/graph/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	_ "github.com/lib/pq"
)

// setupTestDB creates a test database connection
func setupTestDB(t *testing.T) *ent.Client {
	// Use test database configuration
	testDBHost := os.Getenv("TEST_DB_HOST")
	if testDBHost == "" {
		testDBHost = "localhost"
	}

	testDBPort := os.Getenv("TEST_DB_PORT")
	if testDBPort == "" {
		testDBPort = "5432"
	}

	testDBName := os.Getenv("TEST_DB_NAME")
	if testDBName == "" {
		testDBName = "morrow_test"
	}

	testDBUser := os.Getenv("TEST_DB_USER")
	if testDBUser == "" {
		testDBUser = "postgres"
	}

	testDBPassword := os.Getenv("TEST_DB_PASSWORD")
	if testDBPassword == "" {
		testDBPassword = "postgres"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		testDBHost, testDBPort, testDBUser, testDBPassword, testDBName)

	client, err := ent.Open("postgres", dsn)
	require.NoError(t, err, "failed to open database connection")

	// Run auto migration
	err = client.Schema.Create(context.Background())
	require.NoError(t, err, "failed to create schema")

	return client
}

// teardownTestDB cleans up the test database
func teardownTestDB(t *testing.T, client *ent.Client) {
	// Clean up test data
	ctx := context.Background()

	// Delete in correct order to respect foreign key constraints
	_, err := client.Participant.Delete().Exec(ctx)
	if err != nil {
		t.Logf("Warning: failed to delete participants: %v", err)
	}

	_, err = client.Event.Delete().Exec(ctx)
	if err != nil {
		t.Logf("Warning: failed to delete events: %v", err)
	}

	_, err = client.User.Delete().Exec(ctx)
	if err != nil {
		t.Logf("Warning: failed to delete users: %v", err)
	}

	err = client.Close()
	if err != nil {
		t.Logf("Warning: failed to close database: %v", err)
	}
}

func TestUserMutations(t *testing.T) {
	client := setupTestDB(t)
	defer teardownTestDB(t, client)

	resolver := &Resolver{Client: client}
	ctx := context.Background()

	t.Run("CreateUser", func(t *testing.T) {
		input := model.CreateUserInput{
			Email: "test@example.com",
			Name:  "Test User",
		}

		user, err := resolver.CreateUser(ctx, input)
		require.NoError(t, err)
		assert.Equal(t, "test@example.com", user.Email)
		assert.Equal(t, "Test User", user.Name)
		assert.NotEmpty(t, user.ID)
	})

	t.Run("GetUsers", func(t *testing.T) {
		users, err := resolver.Users(ctx)
		require.NoError(t, err)
		assert.Len(t, users, 1)
		assert.Equal(t, "test@example.com", users[0].Email)
	})

	t.Run("UpdateUser", func(t *testing.T) {
		// First create a user
		createInput := model.CreateUserInput{
			Email: "update@example.com",
			Name:  "Update User",
		}
		createdUser, err := resolver.CreateUser(ctx, createInput)
		require.NoError(t, err)

		// Then update it
		newName := "Updated User"
		updateInput := model.UpdateUserInput{
			Name: &newName,
		}

		updatedUser, err := resolver.UpdateUser(ctx, createdUser.ID, updateInput)
		require.NoError(t, err)
		assert.Equal(t, "Updated User", updatedUser.Name)
		assert.Equal(t, createdUser.Email, updatedUser.Email) // Email should remain unchanged
	})

	t.Run("DeleteUser", func(t *testing.T) {
		// First create a user
		createInput := model.CreateUserInput{
			Email: "delete@example.com",
			Name:  "Delete User",
		}
		createdUser, err := resolver.CreateUser(ctx, createInput)
		require.NoError(t, err)

		// Then delete it
		deleted, err := resolver.DeleteUser(ctx, createdUser.ID)
		require.NoError(t, err)
		assert.True(t, deleted)

		// Verify it's deleted
		_, err = resolver.User(ctx, createdUser.ID)
		assert.Error(t, err) // Should return error for non-existent user
	})
}

func TestEventMutations(t *testing.T) {
	client := setupTestDB(t)
	defer teardownTestDB(t, client)

	resolver := &Resolver{Client: client}
	ctx := context.Background()

	// First create a user (creator)
	userInput := model.CreateUserInput{
		Email: "creator@example.com",
		Name:  "Event Creator",
	}
	creator, err := resolver.CreateUser(ctx, userInput)
	require.NoError(t, err)

	t.Run("CreateEvent", func(t *testing.T) {
		input := model.CreateEventInput{
			Title:       "Test Event",
			Description: stringPtr("A test event"),
			StartTime:   "2025-07-01T10:00:00Z",
			EndTime:     "2025-07-01T12:00:00Z",
			Emoji:       stringPtr("🎉"),
			Visibility:  eventVisibilityPtr(model.EventVisibilityPrivate),
			CreatorID:   creator.ID,
		}

		event, err := resolver.CreateEvent(ctx, input)
		require.NoError(t, err)
		assert.Equal(t, "Test Event", event.Title)
		assert.Equal(t, "A test event", *event.Description)
		assert.Equal(t, "🎉", *event.Emoji)
		assert.Equal(t, model.EventVisibilityPrivate, event.Visibility)
		assert.NotEmpty(t, event.ID)
	})

	t.Run("GetEvents", func(t *testing.T) {
		events, err := resolver.Events(ctx)
		require.NoError(t, err)
		assert.Len(t, events, 1)
		assert.Equal(t, "Test Event", events[0].Title)
	})

	t.Run("UpdateEvent", func(t *testing.T) {
		// First create an event
		createInput := model.CreateEventInput{
			Title:     "Update Event",
			StartTime: "2025-07-02T10:00:00Z",
			EndTime:   "2025-07-02T12:00:00Z",
			CreatorID: creator.ID,
		}
		createdEvent, err := resolver.CreateEvent(ctx, createInput)
		require.NoError(t, err)

		// Then update it
		newTitle := "Updated Event"
		updateInput := model.UpdateEventInput{
			Title: &newTitle,
		}

		updatedEvent, err := resolver.UpdateEvent(ctx, createdEvent.ID, updateInput)
		require.NoError(t, err)
		assert.Equal(t, "Updated Event", updatedEvent.Title)
	})

	t.Run("DeleteEvent", func(t *testing.T) {
		// First create an event
		createInput := model.CreateEventInput{
			Title:     "Delete Event",
			StartTime: "2025-07-03T10:00:00Z",
			EndTime:   "2025-07-03T12:00:00Z",
			CreatorID: creator.ID,
		}
		createdEvent, err := resolver.CreateEvent(ctx, createInput)
		require.NoError(t, err)

		// Then delete it
		deleted, err := resolver.DeleteEvent(ctx, createdEvent.ID)
		require.NoError(t, err)
		assert.True(t, deleted)

		// Verify it's deleted
		_, err = resolver.Event(ctx, createdEvent.ID)
		assert.Error(t, err) // Should return error for non-existent event
	})
}

func TestParticipantMutations(t *testing.T) {
	client := setupTestDB(t)
	defer teardownTestDB(t, client)

	resolver := &Resolver{Client: client}
	ctx := context.Background()

	// Setup: Create a user and event
	userInput := model.CreateUserInput{
		Email: "participant@example.com",
		Name:  "Participant User",
	}
	user, err := resolver.CreateUser(ctx, userInput)
	require.NoError(t, err)

	eventInput := model.CreateEventInput{
		Title:     "Participant Event",
		StartTime: "2025-07-04T10:00:00Z",
		EndTime:   "2025-07-04T12:00:00Z",
		CreatorID: user.ID,
	}
	event, err := resolver.CreateEvent(ctx, eventInput)
	require.NoError(t, err)

	t.Run("CreateParticipant", func(t *testing.T) {
		input := model.CreateParticipantInput{
			Role:    participantRolePtr(model.ParticipantRoleViewer),
			Status:  participantStatusPtr(model.ParticipantStatusPending),
			UserID:  user.ID,
			EventID: event.ID,
		}

		participant, err := resolver.CreateParticipant(ctx, input)
		require.NoError(t, err)
		assert.Equal(t, model.ParticipantRoleViewer, participant.Role)
		assert.Equal(t, model.ParticipantStatusPending, participant.Status)
		assert.NotEmpty(t, participant.ID)
	})

	t.Run("GetParticipants", func(t *testing.T) {
		participants, err := resolver.Participants(ctx)
		require.NoError(t, err)
		assert.Len(t, participants, 1)
		assert.Equal(t, model.ParticipantRoleViewer, participants[0].Role)
	})

	t.Run("UpdateParticipant", func(t *testing.T) {
		// First create a participant
		createInput := model.CreateParticipantInput{
			Role:    participantRolePtr(model.ParticipantRoleViewer),
			Status:  participantStatusPtr(model.ParticipantStatusPending),
			UserID:  user.ID,
			EventID: event.ID,
		}
		createdParticipant, err := resolver.CreateParticipant(ctx, createInput)
		require.NoError(t, err)

		// Then update it
		newStatus := model.ParticipantStatusAccepted
		updateInput := model.UpdateParticipantInput{
			Status: &newStatus,
		}

		updatedParticipant, err := resolver.UpdateParticipant(ctx, createdParticipant.ID, updateInput)
		require.NoError(t, err)
		assert.Equal(t, model.ParticipantStatusAccepted, updatedParticipant.Status)
		assert.Equal(t, createdParticipant.Role, updatedParticipant.Role) // Role should remain unchanged
	})

	t.Run("DeleteParticipant", func(t *testing.T) {
		// First create a participant
		createInput := model.CreateParticipantInput{
			Role:    participantRolePtr(model.ParticipantRoleViewer),
			Status:  participantStatusPtr(model.ParticipantStatusPending),
			UserID:  user.ID,
			EventID: event.ID,
		}
		createdParticipant, err := resolver.CreateParticipant(ctx, createInput)
		require.NoError(t, err)

		// Then delete it
		deleted, err := resolver.DeleteParticipant(ctx, createdParticipant.ID)
		require.NoError(t, err)
		assert.True(t, deleted)

		// Verify it's deleted
		_, err = resolver.Participant(ctx, createdParticipant.ID)
		assert.Error(t, err) // Should return error for non-existent participant
	})
}

// Helper function to create string pointer
func stringPtr(s string) *string {
	return &s
}

// Helper function to create EventVisibility pointer
func eventVisibilityPtr(v model.EventVisibility) *model.EventVisibility {
	return &v
}

// Helper function to create ParticipantRole pointer
func participantRolePtr(r model.ParticipantRole) *model.ParticipantRole {
	return &r
}

// Helper function to create ParticipantStatus pointer
func participantStatusPtr(s model.ParticipantStatus) *model.ParticipantStatus {
	return &s
}
