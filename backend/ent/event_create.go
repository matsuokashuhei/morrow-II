// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/matsuokashuhei/morrow-backend/ent/event"
	"github.com/matsuokashuhei/morrow-backend/ent/participant"
	"github.com/matsuokashuhei/morrow-backend/ent/user"
)

// EventCreate is the builder for creating a Event entity.
type EventCreate struct {
	config
	mutation *EventMutation
	hooks    []Hook
}

// SetTitle sets the "title" field.
func (ec *EventCreate) SetTitle(s string) *EventCreate {
	ec.mutation.SetTitle(s)
	return ec
}

// SetDescription sets the "description" field.
func (ec *EventCreate) SetDescription(s string) *EventCreate {
	ec.mutation.SetDescription(s)
	return ec
}

// SetNillableDescription sets the "description" field if the given value is not nil.
func (ec *EventCreate) SetNillableDescription(s *string) *EventCreate {
	if s != nil {
		ec.SetDescription(*s)
	}
	return ec
}

// SetStartTime sets the "start_time" field.
func (ec *EventCreate) SetStartTime(t time.Time) *EventCreate {
	ec.mutation.SetStartTime(t)
	return ec
}

// SetEndTime sets the "end_time" field.
func (ec *EventCreate) SetEndTime(t time.Time) *EventCreate {
	ec.mutation.SetEndTime(t)
	return ec
}

// SetEmoji sets the "emoji" field.
func (ec *EventCreate) SetEmoji(s string) *EventCreate {
	ec.mutation.SetEmoji(s)
	return ec
}

// SetNillableEmoji sets the "emoji" field if the given value is not nil.
func (ec *EventCreate) SetNillableEmoji(s *string) *EventCreate {
	if s != nil {
		ec.SetEmoji(*s)
	}
	return ec
}

// SetVisibility sets the "visibility" field.
func (ec *EventCreate) SetVisibility(e event.Visibility) *EventCreate {
	ec.mutation.SetVisibility(e)
	return ec
}

// SetNillableVisibility sets the "visibility" field if the given value is not nil.
func (ec *EventCreate) SetNillableVisibility(e *event.Visibility) *EventCreate {
	if e != nil {
		ec.SetVisibility(*e)
	}
	return ec
}

// SetCreatedAt sets the "created_at" field.
func (ec *EventCreate) SetCreatedAt(t time.Time) *EventCreate {
	ec.mutation.SetCreatedAt(t)
	return ec
}

// SetNillableCreatedAt sets the "created_at" field if the given value is not nil.
func (ec *EventCreate) SetNillableCreatedAt(t *time.Time) *EventCreate {
	if t != nil {
		ec.SetCreatedAt(*t)
	}
	return ec
}

// SetUpdatedAt sets the "updated_at" field.
func (ec *EventCreate) SetUpdatedAt(t time.Time) *EventCreate {
	ec.mutation.SetUpdatedAt(t)
	return ec
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (ec *EventCreate) SetNillableUpdatedAt(t *time.Time) *EventCreate {
	if t != nil {
		ec.SetUpdatedAt(*t)
	}
	return ec
}

// SetCreatorID sets the "creator" edge to the User entity by ID.
func (ec *EventCreate) SetCreatorID(id int) *EventCreate {
	ec.mutation.SetCreatorID(id)
	return ec
}

// SetCreator sets the "creator" edge to the User entity.
func (ec *EventCreate) SetCreator(u *User) *EventCreate {
	return ec.SetCreatorID(u.ID)
}

// AddParticipantIDs adds the "participants" edge to the Participant entity by IDs.
func (ec *EventCreate) AddParticipantIDs(ids ...int) *EventCreate {
	ec.mutation.AddParticipantIDs(ids...)
	return ec
}

// AddParticipants adds the "participants" edges to the Participant entity.
func (ec *EventCreate) AddParticipants(p ...*Participant) *EventCreate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return ec.AddParticipantIDs(ids...)
}

// Mutation returns the EventMutation object of the builder.
func (ec *EventCreate) Mutation() *EventMutation {
	return ec.mutation
}

// Save creates the Event in the database.
func (ec *EventCreate) Save(ctx context.Context) (*Event, error) {
	ec.defaults()
	return withHooks(ctx, ec.sqlSave, ec.mutation, ec.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (ec *EventCreate) SaveX(ctx context.Context) *Event {
	v, err := ec.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (ec *EventCreate) Exec(ctx context.Context) error {
	_, err := ec.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (ec *EventCreate) ExecX(ctx context.Context) {
	if err := ec.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (ec *EventCreate) defaults() {
	if _, ok := ec.mutation.Visibility(); !ok {
		v := event.DefaultVisibility
		ec.mutation.SetVisibility(v)
	}
	if _, ok := ec.mutation.CreatedAt(); !ok {
		v := event.DefaultCreatedAt()
		ec.mutation.SetCreatedAt(v)
	}
	if _, ok := ec.mutation.UpdatedAt(); !ok {
		v := event.DefaultUpdatedAt()
		ec.mutation.SetUpdatedAt(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (ec *EventCreate) check() error {
	if _, ok := ec.mutation.Title(); !ok {
		return &ValidationError{Name: "title", err: errors.New(`ent: missing required field "Event.title"`)}
	}
	if _, ok := ec.mutation.StartTime(); !ok {
		return &ValidationError{Name: "start_time", err: errors.New(`ent: missing required field "Event.start_time"`)}
	}
	if _, ok := ec.mutation.EndTime(); !ok {
		return &ValidationError{Name: "end_time", err: errors.New(`ent: missing required field "Event.end_time"`)}
	}
	if _, ok := ec.mutation.Visibility(); !ok {
		return &ValidationError{Name: "visibility", err: errors.New(`ent: missing required field "Event.visibility"`)}
	}
	if v, ok := ec.mutation.Visibility(); ok {
		if err := event.VisibilityValidator(v); err != nil {
			return &ValidationError{Name: "visibility", err: fmt.Errorf(`ent: validator failed for field "Event.visibility": %w`, err)}
		}
	}
	if _, ok := ec.mutation.CreatedAt(); !ok {
		return &ValidationError{Name: "created_at", err: errors.New(`ent: missing required field "Event.created_at"`)}
	}
	if _, ok := ec.mutation.UpdatedAt(); !ok {
		return &ValidationError{Name: "updated_at", err: errors.New(`ent: missing required field "Event.updated_at"`)}
	}
	if len(ec.mutation.CreatorIDs()) == 0 {
		return &ValidationError{Name: "creator", err: errors.New(`ent: missing required edge "Event.creator"`)}
	}
	return nil
}

func (ec *EventCreate) sqlSave(ctx context.Context) (*Event, error) {
	if err := ec.check(); err != nil {
		return nil, err
	}
	_node, _spec := ec.createSpec()
	if err := sqlgraph.CreateNode(ctx, ec.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	ec.mutation.id = &_node.ID
	ec.mutation.done = true
	return _node, nil
}

func (ec *EventCreate) createSpec() (*Event, *sqlgraph.CreateSpec) {
	var (
		_node = &Event{config: ec.config}
		_spec = sqlgraph.NewCreateSpec(event.Table, sqlgraph.NewFieldSpec(event.FieldID, field.TypeInt))
	)
	if value, ok := ec.mutation.Title(); ok {
		_spec.SetField(event.FieldTitle, field.TypeString, value)
		_node.Title = value
	}
	if value, ok := ec.mutation.Description(); ok {
		_spec.SetField(event.FieldDescription, field.TypeString, value)
		_node.Description = value
	}
	if value, ok := ec.mutation.StartTime(); ok {
		_spec.SetField(event.FieldStartTime, field.TypeTime, value)
		_node.StartTime = value
	}
	if value, ok := ec.mutation.EndTime(); ok {
		_spec.SetField(event.FieldEndTime, field.TypeTime, value)
		_node.EndTime = value
	}
	if value, ok := ec.mutation.Emoji(); ok {
		_spec.SetField(event.FieldEmoji, field.TypeString, value)
		_node.Emoji = value
	}
	if value, ok := ec.mutation.Visibility(); ok {
		_spec.SetField(event.FieldVisibility, field.TypeEnum, value)
		_node.Visibility = value
	}
	if value, ok := ec.mutation.CreatedAt(); ok {
		_spec.SetField(event.FieldCreatedAt, field.TypeTime, value)
		_node.CreatedAt = value
	}
	if value, ok := ec.mutation.UpdatedAt(); ok {
		_spec.SetField(event.FieldUpdatedAt, field.TypeTime, value)
		_node.UpdatedAt = value
	}
	if nodes := ec.mutation.CreatorIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   event.CreatorTable,
			Columns: []string{event.CreatorColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.user_created_events = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := ec.mutation.ParticipantsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   event.ParticipantsTable,
			Columns: []string{event.ParticipantsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(participant.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// EventCreateBulk is the builder for creating many Event entities in bulk.
type EventCreateBulk struct {
	config
	err      error
	builders []*EventCreate
}

// Save creates the Event entities in the database.
func (ecb *EventCreateBulk) Save(ctx context.Context) ([]*Event, error) {
	if ecb.err != nil {
		return nil, ecb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(ecb.builders))
	nodes := make([]*Event, len(ecb.builders))
	mutators := make([]Mutator, len(ecb.builders))
	for i := range ecb.builders {
		func(i int, root context.Context) {
			builder := ecb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*EventMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, ecb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, ecb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				if specs[i].ID.Value != nil {
					id := specs[i].ID.Value.(int64)
					nodes[i].ID = int(id)
				}
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, ecb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (ecb *EventCreateBulk) SaveX(ctx context.Context) []*Event {
	v, err := ecb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (ecb *EventCreateBulk) Exec(ctx context.Context) error {
	_, err := ecb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (ecb *EventCreateBulk) ExecX(ctx context.Context) {
	if err := ecb.Exec(ctx); err != nil {
		panic(err)
	}
}
