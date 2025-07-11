// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/matsuokashuhei/morrow-backend/ent/participant"
	"github.com/matsuokashuhei/morrow-backend/ent/predicate"
)

// ParticipantDelete is the builder for deleting a Participant entity.
type ParticipantDelete struct {
	config
	hooks    []Hook
	mutation *ParticipantMutation
}

// Where appends a list predicates to the ParticipantDelete builder.
func (pd *ParticipantDelete) Where(ps ...predicate.Participant) *ParticipantDelete {
	pd.mutation.Where(ps...)
	return pd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (pd *ParticipantDelete) Exec(ctx context.Context) (int, error) {
	return withHooks(ctx, pd.sqlExec, pd.mutation, pd.hooks)
}

// ExecX is like Exec, but panics if an error occurs.
func (pd *ParticipantDelete) ExecX(ctx context.Context) int {
	n, err := pd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (pd *ParticipantDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := sqlgraph.NewDeleteSpec(participant.Table, sqlgraph.NewFieldSpec(participant.FieldID, field.TypeInt))
	if ps := pd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, pd.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	pd.mutation.done = true
	return affected, err
}

// ParticipantDeleteOne is the builder for deleting a single Participant entity.
type ParticipantDeleteOne struct {
	pd *ParticipantDelete
}

// Where appends a list predicates to the ParticipantDelete builder.
func (pdo *ParticipantDeleteOne) Where(ps ...predicate.Participant) *ParticipantDeleteOne {
	pdo.pd.mutation.Where(ps...)
	return pdo
}

// Exec executes the deletion query.
func (pdo *ParticipantDeleteOne) Exec(ctx context.Context) error {
	n, err := pdo.pd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{participant.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (pdo *ParticipantDeleteOne) ExecX(ctx context.Context) {
	if err := pdo.Exec(ctx); err != nil {
		panic(err)
	}
}
