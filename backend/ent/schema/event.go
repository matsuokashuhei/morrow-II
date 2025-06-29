package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Event holds the schema definition for the Event entity.
type Event struct {
	ent.Schema
}

// Fields of the Event.
func (Event) Fields() []ent.Field {
	return []ent.Field{
		field.String("title").
			Comment("イベントのタイトル"),
		field.String("description").
			Optional().
			Comment("イベントの説明"),
		field.Time("start_time").
			Comment("イベント開始日時"),
		field.Time("end_time").
			Comment("イベント終了日時"),
		field.String("emoji").
			Optional().
			Comment("イベントの絵文字"),
		field.Enum("visibility").
			Values("private", "shared", "public").
			Default("private").
			Comment("イベントの公開設定"),
		field.Time("created_at").
			Default(time.Now).
			Comment("作成日時"),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now).
			Comment("更新日時"),
	}
}

// Edges of the Event.
func (Event) Edges() []ent.Edge {
	return []ent.Edge{
		// イベントの作成者
		edge.From("creator", User.Type).
			Ref("created_events").
			Unique().
			Required().
			Comment("イベントの作成者"),
		// イベントの参加者（Participantを通じて）
		edge.To("participants", Participant.Type).
			Comment("イベントの参加者情報"),
	}
}
