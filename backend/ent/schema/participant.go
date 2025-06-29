package schema

import (
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Participant holds the schema definition for the Participant entity.
type Participant struct {
	ent.Schema
}

// Fields of the Participant.
func (Participant) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("role").
			Values("owner", "viewer").
			Default("viewer").
			Comment("参加者の権限 (owner: 作成者, viewer: 閲覧者)"),
		field.Enum("status").
			Values("pending", "accepted", "declined").
			Default("pending").
			Comment("参加状態"),
		field.Time("joined_at").
			Default(time.Now).
			Comment("参加日時").
			Annotations(entgql.OrderField("JOINED_AT")),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now).
			Comment("更新日時").
			Annotations(entgql.OrderField("UPDATED_AT")),
	}
}

// Edges of the Participant.
func (Participant) Edges() []ent.Edge {
	return []ent.Edge{
		// 参加しているユーザー
		edge.From("user", User.Type).
			Ref("participants").
			Unique().
			Required().
			Comment("参加ユーザー"),
		// 参加しているイベント
		edge.From("event", Event.Type).
			Ref("participants").
			Unique().
			Required().
			Comment("対象イベント"),
	}
}

// Annotations of the Participant.
func (Participant) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
		entgql.QueryField(),
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
