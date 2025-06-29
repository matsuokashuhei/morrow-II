package schema

import (
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("email").
			Unique().
			Comment("ユーザーのメールアドレス").
			Annotations(entgql.OrderField("EMAIL")),
		field.String("name").
			Comment("ユーザーの表示名").
			Annotations(entgql.OrderField("NAME")),
		field.String("avatar_url").
			Optional().
			Comment("プロフィール画像のURL (S3)"),
		field.String("cognito_id").
			Optional().
			Unique().
			Comment("Amazon Cognito User ID (Phase 2で使用)"),
		field.Time("created_at").
			Default(time.Now).
			Comment("作成日時").
			Annotations(entgql.OrderField("CREATED_AT")),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now).
			Comment("更新日時").
			Annotations(entgql.OrderField("UPDATED_AT")),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		// ユーザーが作成したイベント
		edge.To("created_events", Event.Type).
			Comment("ユーザーが作成したイベント"),
		// ユーザーが参加しているイベント（Participantを通じて）
		edge.To("participants", Participant.Type).
			Comment("ユーザーの参加情報"),
	}
}

// Annotations of the User.
func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
		entgql.QueryField(),
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
