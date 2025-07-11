// Code generated by ent, DO NOT EDIT.

package participant

import (
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/matsuokashuhei/morrow-backend/ent/predicate"
)

// ID filters vertices based on their ID field.
func ID(id int) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldID, id))
}

// IDEQ applies the EQ predicate on the ID field.
func IDEQ(id int) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldID, id))
}

// IDNEQ applies the NEQ predicate on the ID field.
func IDNEQ(id int) predicate.Participant {
	return predicate.Participant(sql.FieldNEQ(FieldID, id))
}

// IDIn applies the In predicate on the ID field.
func IDIn(ids ...int) predicate.Participant {
	return predicate.Participant(sql.FieldIn(FieldID, ids...))
}

// IDNotIn applies the NotIn predicate on the ID field.
func IDNotIn(ids ...int) predicate.Participant {
	return predicate.Participant(sql.FieldNotIn(FieldID, ids...))
}

// IDGT applies the GT predicate on the ID field.
func IDGT(id int) predicate.Participant {
	return predicate.Participant(sql.FieldGT(FieldID, id))
}

// IDGTE applies the GTE predicate on the ID field.
func IDGTE(id int) predicate.Participant {
	return predicate.Participant(sql.FieldGTE(FieldID, id))
}

// IDLT applies the LT predicate on the ID field.
func IDLT(id int) predicate.Participant {
	return predicate.Participant(sql.FieldLT(FieldID, id))
}

// IDLTE applies the LTE predicate on the ID field.
func IDLTE(id int) predicate.Participant {
	return predicate.Participant(sql.FieldLTE(FieldID, id))
}

// JoinedAt applies equality check predicate on the "joined_at" field. It's identical to JoinedAtEQ.
func JoinedAt(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldJoinedAt, v))
}

// UpdatedAt applies equality check predicate on the "updated_at" field. It's identical to UpdatedAtEQ.
func UpdatedAt(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldUpdatedAt, v))
}

// RoleEQ applies the EQ predicate on the "role" field.
func RoleEQ(v Role) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldRole, v))
}

// RoleNEQ applies the NEQ predicate on the "role" field.
func RoleNEQ(v Role) predicate.Participant {
	return predicate.Participant(sql.FieldNEQ(FieldRole, v))
}

// RoleIn applies the In predicate on the "role" field.
func RoleIn(vs ...Role) predicate.Participant {
	return predicate.Participant(sql.FieldIn(FieldRole, vs...))
}

// RoleNotIn applies the NotIn predicate on the "role" field.
func RoleNotIn(vs ...Role) predicate.Participant {
	return predicate.Participant(sql.FieldNotIn(FieldRole, vs...))
}

// StatusEQ applies the EQ predicate on the "status" field.
func StatusEQ(v Status) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldStatus, v))
}

// StatusNEQ applies the NEQ predicate on the "status" field.
func StatusNEQ(v Status) predicate.Participant {
	return predicate.Participant(sql.FieldNEQ(FieldStatus, v))
}

// StatusIn applies the In predicate on the "status" field.
func StatusIn(vs ...Status) predicate.Participant {
	return predicate.Participant(sql.FieldIn(FieldStatus, vs...))
}

// StatusNotIn applies the NotIn predicate on the "status" field.
func StatusNotIn(vs ...Status) predicate.Participant {
	return predicate.Participant(sql.FieldNotIn(FieldStatus, vs...))
}

// JoinedAtEQ applies the EQ predicate on the "joined_at" field.
func JoinedAtEQ(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldJoinedAt, v))
}

// JoinedAtNEQ applies the NEQ predicate on the "joined_at" field.
func JoinedAtNEQ(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldNEQ(FieldJoinedAt, v))
}

// JoinedAtIn applies the In predicate on the "joined_at" field.
func JoinedAtIn(vs ...time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldIn(FieldJoinedAt, vs...))
}

// JoinedAtNotIn applies the NotIn predicate on the "joined_at" field.
func JoinedAtNotIn(vs ...time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldNotIn(FieldJoinedAt, vs...))
}

// JoinedAtGT applies the GT predicate on the "joined_at" field.
func JoinedAtGT(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldGT(FieldJoinedAt, v))
}

// JoinedAtGTE applies the GTE predicate on the "joined_at" field.
func JoinedAtGTE(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldGTE(FieldJoinedAt, v))
}

// JoinedAtLT applies the LT predicate on the "joined_at" field.
func JoinedAtLT(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldLT(FieldJoinedAt, v))
}

// JoinedAtLTE applies the LTE predicate on the "joined_at" field.
func JoinedAtLTE(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldLTE(FieldJoinedAt, v))
}

// UpdatedAtEQ applies the EQ predicate on the "updated_at" field.
func UpdatedAtEQ(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldEQ(FieldUpdatedAt, v))
}

// UpdatedAtNEQ applies the NEQ predicate on the "updated_at" field.
func UpdatedAtNEQ(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldNEQ(FieldUpdatedAt, v))
}

// UpdatedAtIn applies the In predicate on the "updated_at" field.
func UpdatedAtIn(vs ...time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldIn(FieldUpdatedAt, vs...))
}

// UpdatedAtNotIn applies the NotIn predicate on the "updated_at" field.
func UpdatedAtNotIn(vs ...time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldNotIn(FieldUpdatedAt, vs...))
}

// UpdatedAtGT applies the GT predicate on the "updated_at" field.
func UpdatedAtGT(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldGT(FieldUpdatedAt, v))
}

// UpdatedAtGTE applies the GTE predicate on the "updated_at" field.
func UpdatedAtGTE(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldGTE(FieldUpdatedAt, v))
}

// UpdatedAtLT applies the LT predicate on the "updated_at" field.
func UpdatedAtLT(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldLT(FieldUpdatedAt, v))
}

// UpdatedAtLTE applies the LTE predicate on the "updated_at" field.
func UpdatedAtLTE(v time.Time) predicate.Participant {
	return predicate.Participant(sql.FieldLTE(FieldUpdatedAt, v))
}

// HasUser applies the HasEdge predicate on the "user" edge.
func HasUser() predicate.Participant {
	return predicate.Participant(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, UserTable, UserColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasUserWith applies the HasEdge predicate on the "user" edge with a given conditions (other predicates).
func HasUserWith(preds ...predicate.User) predicate.Participant {
	return predicate.Participant(func(s *sql.Selector) {
		step := newUserStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasEvent applies the HasEdge predicate on the "event" edge.
func HasEvent() predicate.Participant {
	return predicate.Participant(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, EventTable, EventColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasEventWith applies the HasEdge predicate on the "event" edge with a given conditions (other predicates).
func HasEventWith(preds ...predicate.Event) predicate.Participant {
	return predicate.Participant(func(s *sql.Selector) {
		step := newEventStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// And groups predicates with the AND operator between them.
func And(predicates ...predicate.Participant) predicate.Participant {
	return predicate.Participant(sql.AndPredicates(predicates...))
}

// Or groups predicates with the OR operator between them.
func Or(predicates ...predicate.Participant) predicate.Participant {
	return predicate.Participant(sql.OrPredicates(predicates...))
}

// Not applies the not operator on the given predicate.
func Not(p predicate.Participant) predicate.Participant {
	return predicate.Participant(sql.NotPredicates(p))
}
