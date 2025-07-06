package graph

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/matsuokashuhei/morrow-backend/ent/event"
	"github.com/matsuokashuhei/morrow-backend/ent/participant"
	"github.com/matsuokashuhei/morrow-backend/graph/model"
)

// Helper function to convert Ent User to GraphQL User
func entUserToGraphQL(u *ent.User) *model.User {
	return &model.User{
		ID:        strconv.Itoa(u.ID),
		Email:     u.Email,
		Name:      u.Name,
		AvatarURL: &u.AvatarURL,
		CognitoID: &u.CognitoID,
		CreatedAt: u.CreatedAt.Format(time.RFC3339),
		UpdatedAt: u.UpdatedAt.Format(time.RFC3339),
	}
}

// Helper function to convert Ent Event to GraphQL Event
func entEventToGraphQL(e *ent.Event) *model.Event {
	return &model.Event{
		ID:          strconv.Itoa(e.ID),
		Title:       e.Title,
		Description: &e.Description,
		StartTime:   e.StartTime.Format(time.RFC3339),
		EndTime:     e.EndTime.Format(time.RFC3339),
		Emoji:       &e.Emoji,
		Visibility:  model.EventVisibility(e.Visibility),
		CreatedAt:   e.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   e.UpdatedAt.Format(time.RFC3339),
	}
}

// Helper function to convert Ent Participant to GraphQL Participant
func entParticipantToGraphQL(p *ent.Participant) *model.Participant {
	return &model.Participant{
		ID:        strconv.Itoa(p.ID),
		Role:      model.ParticipantRole(p.Role),
		Status:    model.ParticipantStatus(p.Status),
		JoinedAt:  p.JoinedAt.Format(time.RFC3339),
		UpdatedAt: p.UpdatedAt.Format(time.RFC3339),
	}
}

// Mutation resolvers
func (r *Resolver) CreateUser(ctx context.Context, input model.CreateUserInput) (*model.User, error) {
	u, err := r.Client.User.
		Create().
		SetEmail(input.Email).
		SetName(input.Name).
		SetNillableAvatarURL(input.AvatarURL).
		SetNillableCognitoID(input.CognitoID).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return entUserToGraphQL(u), nil
}

func (r *Resolver) UpdateUser(ctx context.Context, id string, input model.UpdateUserInput) (*model.User, error) {
	userID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	update := r.Client.User.UpdateOneID(userID)
	if input.Name != nil {
		update = update.SetName(*input.Name)
	}
	if input.AvatarURL != nil {
		update = update.SetNillableAvatarURL(input.AvatarURL)
	}
	if input.CognitoID != nil {
		update = update.SetNillableCognitoID(input.CognitoID)
	}

	u, err := update.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return entUserToGraphQL(u), nil
}

func (r *Resolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	userID, err := strconv.Atoi(id)
	if err != nil {
		return false, fmt.Errorf("invalid user ID: %w", err)
	}

	err = r.Client.User.DeleteOneID(userID).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete user: %w", err)
	}
	return true, nil
}

func (r *Resolver) CreateEvent(ctx context.Context, input model.CreateEventInput) (*model.Event, error) {
	creatorID, err := strconv.Atoi(input.CreatorID)
	if err != nil {
		return nil, fmt.Errorf("invalid creator ID: %w", err)
	}

	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		return nil, fmt.Errorf("invalid start time: %w", err)
	}

	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		return nil, fmt.Errorf("invalid end time: %w", err)
	}

	create := r.Client.Event.
		Create().
		SetTitle(input.Title).
		SetNillableDescription(input.Description).
		SetStartTime(startTime).
		SetEndTime(endTime).
		SetNillableEmoji(input.Emoji).
		SetCreatorID(creatorID)

	if input.Visibility != nil {
		create = create.SetVisibility(event.Visibility(string(*input.Visibility)))
	} else {
		create = create.SetVisibility(event.VisibilityPrivate)
	}

	e, err := create.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create event: %w", err)
	}
	return entEventToGraphQL(e), nil
}

func (r *Resolver) UpdateEvent(ctx context.Context, id string, input model.UpdateEventInput) (*model.Event, error) {
	eventID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid event ID: %w", err)
	}

	update := r.Client.Event.UpdateOneID(eventID)
	if input.Title != nil {
		update = update.SetTitle(*input.Title)
	}
	if input.Description != nil {
		update = update.SetNillableDescription(input.Description)
	}
	if input.StartTime != nil {
		startTime, err := time.Parse(time.RFC3339, *input.StartTime)
		if err != nil {
			return nil, fmt.Errorf("invalid start time: %w", err)
		}
		update = update.SetStartTime(startTime)
	}
	if input.EndTime != nil {
		endTime, err := time.Parse(time.RFC3339, *input.EndTime)
		if err != nil {
			return nil, fmt.Errorf("invalid end time: %w", err)
		}
		update = update.SetEndTime(endTime)
	}
	if input.Emoji != nil {
		update = update.SetNillableEmoji(input.Emoji)
	}
	if input.Visibility != nil {
		update = update.SetVisibility(event.Visibility(*input.Visibility))
	}

	e, err := update.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update event: %w", err)
	}
	return entEventToGraphQL(e), nil
}

func (r *Resolver) DeleteEvent(ctx context.Context, id string) (bool, error) {
	eventID, err := strconv.Atoi(id)
	if err != nil {
		return false, fmt.Errorf("invalid event ID: %w", err)
	}

	err = r.Client.Event.DeleteOneID(eventID).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete event: %w", err)
	}
	return true, nil
}

func (r *Resolver) CreateParticipant(ctx context.Context, input model.CreateParticipantInput) (*model.Participant, error) {
	userID, err := strconv.Atoi(input.UserID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	eventID, err := strconv.Atoi(input.EventID)
	if err != nil {
		return nil, fmt.Errorf("invalid event ID: %w", err)
	}

	create := r.Client.Participant.
		Create().
		SetUserID(userID).
		SetEventID(eventID)

	if input.Role != nil {
		create = create.SetRole(participant.Role(string(*input.Role)))
	} else {
		create = create.SetRole(participant.RoleViewer)
	}

	if input.Status != nil {
		create = create.SetStatus(participant.Status(string(*input.Status)))
	} else {
		create = create.SetStatus(participant.StatusPending)
	}

	p, err := create.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create participant: %w", err)
	}
	return entParticipantToGraphQL(p), nil
}

func (r *Resolver) UpdateParticipant(ctx context.Context, id string, input model.UpdateParticipantInput) (*model.Participant, error) {
	participantID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid participant ID: %w", err)
	}

	update := r.Client.Participant.UpdateOneID(participantID)
	if input.Role != nil {
		update = update.SetRole(participant.Role(*input.Role))
	}
	if input.Status != nil {
		update = update.SetStatus(participant.Status(*input.Status))
	}

	p, err := update.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update participant: %w", err)
	}
	return entParticipantToGraphQL(p), nil
}

func (r *Resolver) DeleteParticipant(ctx context.Context, id string) (bool, error) {
	participantID, err := strconv.Atoi(id)
	if err != nil {
		return false, fmt.Errorf("invalid participant ID: %w", err)
	}

	err = r.Client.Participant.DeleteOneID(participantID).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete participant: %w", err)
	}
	return true, nil
}

// Query resolvers
func (r *Resolver) Node(ctx context.Context, id string) (model.Node, error) {
	// Basic Node implementation - can be improved with more sophisticated ID handling
	return nil, fmt.Errorf("not implemented: Node - node")
}

func (r *Resolver) User(ctx context.Context, id string) (*model.User, error) {
	userID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	u, err := r.Client.User.Get(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return entUserToGraphQL(u), nil
}

func (r *Resolver) Users(ctx context.Context) ([]*model.User, error) {
	users, err := r.Client.User.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}

	var result []*model.User
	for _, u := range users {
		result = append(result, entUserToGraphQL(u))
	}
	return result, nil
}

func (r *Resolver) Event(ctx context.Context, id string) (*model.Event, error) {
	eventID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid event ID: %w", err)
	}

	e, err := r.Client.Event.Get(ctx, eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}
	return entEventToGraphQL(e), nil
}

func (r *Resolver) Events(ctx context.Context) ([]*model.Event, error) {
	events, err := r.Client.Event.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get events: %w", err)
	}

	var result []*model.Event
	for _, e := range events {
		result = append(result, entEventToGraphQL(e))
	}
	return result, nil
}

func (r *Resolver) Participant(ctx context.Context, id string) (*model.Participant, error) {
	participantID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid participant ID: %w", err)
	}

	p, err := r.Client.Participant.Get(ctx, participantID)
	if err != nil {
		return nil, fmt.Errorf("failed to get participant: %w", err)
	}
	return entParticipantToGraphQL(p), nil
}

func (r *Resolver) Participants(ctx context.Context) ([]*model.Participant, error) {
	participants, err := r.Client.Participant.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get participants: %w", err)
	}

	var result []*model.Participant
	for _, p := range participants {
		result = append(result, entParticipantToGraphQL(p))
	}
	return result, nil
}

// Resolver interface implementations
func (r *Resolver) Mutation() MutationResolver { return r }
func (r *Resolver) Query() QueryResolver { return r }
