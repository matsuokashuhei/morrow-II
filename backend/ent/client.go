// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"log"
	"reflect"

	"github.com/matsuokashuhei/morrow-backend/ent/migrate"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/matsuokashuhei/morrow-backend/ent/event"
	"github.com/matsuokashuhei/morrow-backend/ent/participant"
	"github.com/matsuokashuhei/morrow-backend/ent/user"
)

// Client is the client that holds all ent builders.
type Client struct {
	config
	// Schema is the client for creating, migrating and dropping schema.
	Schema *migrate.Schema
	// Event is the client for interacting with the Event builders.
	Event *EventClient
	// Participant is the client for interacting with the Participant builders.
	Participant *ParticipantClient
	// User is the client for interacting with the User builders.
	User *UserClient
}

// NewClient creates a new client configured with the given options.
func NewClient(opts ...Option) *Client {
	client := &Client{config: newConfig(opts...)}
	client.init()
	return client
}

func (c *Client) init() {
	c.Schema = migrate.NewSchema(c.driver)
	c.Event = NewEventClient(c.config)
	c.Participant = NewParticipantClient(c.config)
	c.User = NewUserClient(c.config)
}

type (
	// config is the configuration for the client and its builder.
	config struct {
		// driver used for executing database requests.
		driver dialect.Driver
		// debug enable a debug logging.
		debug bool
		// log used for logging on debug mode.
		log func(...any)
		// hooks to execute on mutations.
		hooks *hooks
		// interceptors to execute on queries.
		inters *inters
	}
	// Option function to configure the client.
	Option func(*config)
)

// newConfig creates a new config for the client.
func newConfig(opts ...Option) config {
	cfg := config{log: log.Println, hooks: &hooks{}, inters: &inters{}}
	cfg.options(opts...)
	return cfg
}

// options applies the options on the config object.
func (c *config) options(opts ...Option) {
	for _, opt := range opts {
		opt(c)
	}
	if c.debug {
		c.driver = dialect.Debug(c.driver, c.log)
	}
}

// Debug enables debug logging on the ent.Driver.
func Debug() Option {
	return func(c *config) {
		c.debug = true
	}
}

// Log sets the logging function for debug mode.
func Log(fn func(...any)) Option {
	return func(c *config) {
		c.log = fn
	}
}

// Driver configures the client driver.
func Driver(driver dialect.Driver) Option {
	return func(c *config) {
		c.driver = driver
	}
}

// Open opens a database/sql.DB specified by the driver name and
// the data source name, and returns a new client attached to it.
// Optional parameters can be added for configuring the client.
func Open(driverName, dataSourceName string, options ...Option) (*Client, error) {
	switch driverName {
	case dialect.MySQL, dialect.Postgres, dialect.SQLite:
		drv, err := sql.Open(driverName, dataSourceName)
		if err != nil {
			return nil, err
		}
		return NewClient(append(options, Driver(drv))...), nil
	default:
		return nil, fmt.Errorf("unsupported driver: %q", driverName)
	}
}

// ErrTxStarted is returned when trying to start a new transaction from a transactional client.
var ErrTxStarted = errors.New("ent: cannot start a transaction within a transaction")

// Tx returns a new transactional client. The provided context
// is used until the transaction is committed or rolled back.
func (c *Client) Tx(ctx context.Context) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, ErrTxStarted
	}
	tx, err := newTx(ctx, c.driver)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = tx
	return &Tx{
		ctx:         ctx,
		config:      cfg,
		Event:       NewEventClient(cfg),
		Participant: NewParticipantClient(cfg),
		User:        NewUserClient(cfg),
	}, nil
}

// BeginTx returns a transactional client with specified options.
func (c *Client) BeginTx(ctx context.Context, opts *sql.TxOptions) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, errors.New("ent: cannot start a transaction within a transaction")
	}
	tx, err := c.driver.(interface {
		BeginTx(context.Context, *sql.TxOptions) (dialect.Tx, error)
	}).BeginTx(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = &txDriver{tx: tx, drv: c.driver}
	return &Tx{
		ctx:         ctx,
		config:      cfg,
		Event:       NewEventClient(cfg),
		Participant: NewParticipantClient(cfg),
		User:        NewUserClient(cfg),
	}, nil
}

// Debug returns a new debug-client. It's used to get verbose logging on specific operations.
//
//	client.Debug().
//		Event.
//		Query().
//		Count(ctx)
func (c *Client) Debug() *Client {
	if c.debug {
		return c
	}
	cfg := c.config
	cfg.driver = dialect.Debug(c.driver, c.log)
	client := &Client{config: cfg}
	client.init()
	return client
}

// Close closes the database connection and prevents new queries from starting.
func (c *Client) Close() error {
	return c.driver.Close()
}

// Use adds the mutation hooks to all the entity clients.
// In order to add hooks to a specific client, call: `client.Node.Use(...)`.
func (c *Client) Use(hooks ...Hook) {
	c.Event.Use(hooks...)
	c.Participant.Use(hooks...)
	c.User.Use(hooks...)
}

// Intercept adds the query interceptors to all the entity clients.
// In order to add interceptors to a specific client, call: `client.Node.Intercept(...)`.
func (c *Client) Intercept(interceptors ...Interceptor) {
	c.Event.Intercept(interceptors...)
	c.Participant.Intercept(interceptors...)
	c.User.Intercept(interceptors...)
}

// Mutate implements the ent.Mutator interface.
func (c *Client) Mutate(ctx context.Context, m Mutation) (Value, error) {
	switch m := m.(type) {
	case *EventMutation:
		return c.Event.mutate(ctx, m)
	case *ParticipantMutation:
		return c.Participant.mutate(ctx, m)
	case *UserMutation:
		return c.User.mutate(ctx, m)
	default:
		return nil, fmt.Errorf("ent: unknown mutation type %T", m)
	}
}

// EventClient is a client for the Event schema.
type EventClient struct {
	config
}

// NewEventClient returns a client for the Event from the given config.
func NewEventClient(c config) *EventClient {
	return &EventClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `event.Hooks(f(g(h())))`.
func (c *EventClient) Use(hooks ...Hook) {
	c.hooks.Event = append(c.hooks.Event, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `event.Intercept(f(g(h())))`.
func (c *EventClient) Intercept(interceptors ...Interceptor) {
	c.inters.Event = append(c.inters.Event, interceptors...)
}

// Create returns a builder for creating a Event entity.
func (c *EventClient) Create() *EventCreate {
	mutation := newEventMutation(c.config, OpCreate)
	return &EventCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Event entities.
func (c *EventClient) CreateBulk(builders ...*EventCreate) *EventCreateBulk {
	return &EventCreateBulk{config: c.config, builders: builders}
}

// MapCreateBulk creates a bulk creation builder from the given slice. For each item in the slice, the function creates
// a builder and applies setFunc on it.
func (c *EventClient) MapCreateBulk(slice any, setFunc func(*EventCreate, int)) *EventCreateBulk {
	rv := reflect.ValueOf(slice)
	if rv.Kind() != reflect.Slice {
		return &EventCreateBulk{err: fmt.Errorf("calling to EventClient.MapCreateBulk with wrong type %T, need slice", slice)}
	}
	builders := make([]*EventCreate, rv.Len())
	for i := 0; i < rv.Len(); i++ {
		builders[i] = c.Create()
		setFunc(builders[i], i)
	}
	return &EventCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Event.
func (c *EventClient) Update() *EventUpdate {
	mutation := newEventMutation(c.config, OpUpdate)
	return &EventUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *EventClient) UpdateOne(e *Event) *EventUpdateOne {
	mutation := newEventMutation(c.config, OpUpdateOne, withEvent(e))
	return &EventUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *EventClient) UpdateOneID(id int) *EventUpdateOne {
	mutation := newEventMutation(c.config, OpUpdateOne, withEventID(id))
	return &EventUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Event.
func (c *EventClient) Delete() *EventDelete {
	mutation := newEventMutation(c.config, OpDelete)
	return &EventDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *EventClient) DeleteOne(e *Event) *EventDeleteOne {
	return c.DeleteOneID(e.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *EventClient) DeleteOneID(id int) *EventDeleteOne {
	builder := c.Delete().Where(event.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &EventDeleteOne{builder}
}

// Query returns a query builder for Event.
func (c *EventClient) Query() *EventQuery {
	return &EventQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeEvent},
		inters: c.Interceptors(),
	}
}

// Get returns a Event entity by its id.
func (c *EventClient) Get(ctx context.Context, id int) (*Event, error) {
	return c.Query().Where(event.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *EventClient) GetX(ctx context.Context, id int) *Event {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryCreator queries the creator edge of a Event.
func (c *EventClient) QueryCreator(e *Event) *UserQuery {
	query := (&UserClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := e.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(event.Table, event.FieldID, id),
			sqlgraph.To(user.Table, user.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, event.CreatorTable, event.CreatorColumn),
		)
		fromV = sqlgraph.Neighbors(e.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// QueryParticipants queries the participants edge of a Event.
func (c *EventClient) QueryParticipants(e *Event) *ParticipantQuery {
	query := (&ParticipantClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := e.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(event.Table, event.FieldID, id),
			sqlgraph.To(participant.Table, participant.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, event.ParticipantsTable, event.ParticipantsColumn),
		)
		fromV = sqlgraph.Neighbors(e.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *EventClient) Hooks() []Hook {
	return c.hooks.Event
}

// Interceptors returns the client interceptors.
func (c *EventClient) Interceptors() []Interceptor {
	return c.inters.Event
}

func (c *EventClient) mutate(ctx context.Context, m *EventMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&EventCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&EventUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&EventUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&EventDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown Event mutation op: %q", m.Op())
	}
}

// ParticipantClient is a client for the Participant schema.
type ParticipantClient struct {
	config
}

// NewParticipantClient returns a client for the Participant from the given config.
func NewParticipantClient(c config) *ParticipantClient {
	return &ParticipantClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `participant.Hooks(f(g(h())))`.
func (c *ParticipantClient) Use(hooks ...Hook) {
	c.hooks.Participant = append(c.hooks.Participant, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `participant.Intercept(f(g(h())))`.
func (c *ParticipantClient) Intercept(interceptors ...Interceptor) {
	c.inters.Participant = append(c.inters.Participant, interceptors...)
}

// Create returns a builder for creating a Participant entity.
func (c *ParticipantClient) Create() *ParticipantCreate {
	mutation := newParticipantMutation(c.config, OpCreate)
	return &ParticipantCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Participant entities.
func (c *ParticipantClient) CreateBulk(builders ...*ParticipantCreate) *ParticipantCreateBulk {
	return &ParticipantCreateBulk{config: c.config, builders: builders}
}

// MapCreateBulk creates a bulk creation builder from the given slice. For each item in the slice, the function creates
// a builder and applies setFunc on it.
func (c *ParticipantClient) MapCreateBulk(slice any, setFunc func(*ParticipantCreate, int)) *ParticipantCreateBulk {
	rv := reflect.ValueOf(slice)
	if rv.Kind() != reflect.Slice {
		return &ParticipantCreateBulk{err: fmt.Errorf("calling to ParticipantClient.MapCreateBulk with wrong type %T, need slice", slice)}
	}
	builders := make([]*ParticipantCreate, rv.Len())
	for i := 0; i < rv.Len(); i++ {
		builders[i] = c.Create()
		setFunc(builders[i], i)
	}
	return &ParticipantCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Participant.
func (c *ParticipantClient) Update() *ParticipantUpdate {
	mutation := newParticipantMutation(c.config, OpUpdate)
	return &ParticipantUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *ParticipantClient) UpdateOne(pa *Participant) *ParticipantUpdateOne {
	mutation := newParticipantMutation(c.config, OpUpdateOne, withParticipant(pa))
	return &ParticipantUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *ParticipantClient) UpdateOneID(id int) *ParticipantUpdateOne {
	mutation := newParticipantMutation(c.config, OpUpdateOne, withParticipantID(id))
	return &ParticipantUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Participant.
func (c *ParticipantClient) Delete() *ParticipantDelete {
	mutation := newParticipantMutation(c.config, OpDelete)
	return &ParticipantDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *ParticipantClient) DeleteOne(pa *Participant) *ParticipantDeleteOne {
	return c.DeleteOneID(pa.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *ParticipantClient) DeleteOneID(id int) *ParticipantDeleteOne {
	builder := c.Delete().Where(participant.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &ParticipantDeleteOne{builder}
}

// Query returns a query builder for Participant.
func (c *ParticipantClient) Query() *ParticipantQuery {
	return &ParticipantQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeParticipant},
		inters: c.Interceptors(),
	}
}

// Get returns a Participant entity by its id.
func (c *ParticipantClient) Get(ctx context.Context, id int) (*Participant, error) {
	return c.Query().Where(participant.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *ParticipantClient) GetX(ctx context.Context, id int) *Participant {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryUser queries the user edge of a Participant.
func (c *ParticipantClient) QueryUser(pa *Participant) *UserQuery {
	query := (&UserClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := pa.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(participant.Table, participant.FieldID, id),
			sqlgraph.To(user.Table, user.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, participant.UserTable, participant.UserColumn),
		)
		fromV = sqlgraph.Neighbors(pa.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// QueryEvent queries the event edge of a Participant.
func (c *ParticipantClient) QueryEvent(pa *Participant) *EventQuery {
	query := (&EventClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := pa.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(participant.Table, participant.FieldID, id),
			sqlgraph.To(event.Table, event.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, participant.EventTable, participant.EventColumn),
		)
		fromV = sqlgraph.Neighbors(pa.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *ParticipantClient) Hooks() []Hook {
	return c.hooks.Participant
}

// Interceptors returns the client interceptors.
func (c *ParticipantClient) Interceptors() []Interceptor {
	return c.inters.Participant
}

func (c *ParticipantClient) mutate(ctx context.Context, m *ParticipantMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&ParticipantCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&ParticipantUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&ParticipantUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&ParticipantDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown Participant mutation op: %q", m.Op())
	}
}

// UserClient is a client for the User schema.
type UserClient struct {
	config
}

// NewUserClient returns a client for the User from the given config.
func NewUserClient(c config) *UserClient {
	return &UserClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `user.Hooks(f(g(h())))`.
func (c *UserClient) Use(hooks ...Hook) {
	c.hooks.User = append(c.hooks.User, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `user.Intercept(f(g(h())))`.
func (c *UserClient) Intercept(interceptors ...Interceptor) {
	c.inters.User = append(c.inters.User, interceptors...)
}

// Create returns a builder for creating a User entity.
func (c *UserClient) Create() *UserCreate {
	mutation := newUserMutation(c.config, OpCreate)
	return &UserCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of User entities.
func (c *UserClient) CreateBulk(builders ...*UserCreate) *UserCreateBulk {
	return &UserCreateBulk{config: c.config, builders: builders}
}

// MapCreateBulk creates a bulk creation builder from the given slice. For each item in the slice, the function creates
// a builder and applies setFunc on it.
func (c *UserClient) MapCreateBulk(slice any, setFunc func(*UserCreate, int)) *UserCreateBulk {
	rv := reflect.ValueOf(slice)
	if rv.Kind() != reflect.Slice {
		return &UserCreateBulk{err: fmt.Errorf("calling to UserClient.MapCreateBulk with wrong type %T, need slice", slice)}
	}
	builders := make([]*UserCreate, rv.Len())
	for i := 0; i < rv.Len(); i++ {
		builders[i] = c.Create()
		setFunc(builders[i], i)
	}
	return &UserCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for User.
func (c *UserClient) Update() *UserUpdate {
	mutation := newUserMutation(c.config, OpUpdate)
	return &UserUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *UserClient) UpdateOne(u *User) *UserUpdateOne {
	mutation := newUserMutation(c.config, OpUpdateOne, withUser(u))
	return &UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *UserClient) UpdateOneID(id int) *UserUpdateOne {
	mutation := newUserMutation(c.config, OpUpdateOne, withUserID(id))
	return &UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for User.
func (c *UserClient) Delete() *UserDelete {
	mutation := newUserMutation(c.config, OpDelete)
	return &UserDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *UserClient) DeleteOne(u *User) *UserDeleteOne {
	return c.DeleteOneID(u.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *UserClient) DeleteOneID(id int) *UserDeleteOne {
	builder := c.Delete().Where(user.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &UserDeleteOne{builder}
}

// Query returns a query builder for User.
func (c *UserClient) Query() *UserQuery {
	return &UserQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeUser},
		inters: c.Interceptors(),
	}
}

// Get returns a User entity by its id.
func (c *UserClient) Get(ctx context.Context, id int) (*User, error) {
	return c.Query().Where(user.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *UserClient) GetX(ctx context.Context, id int) *User {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryCreatedEvents queries the created_events edge of a User.
func (c *UserClient) QueryCreatedEvents(u *User) *EventQuery {
	query := (&EventClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := u.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(user.Table, user.FieldID, id),
			sqlgraph.To(event.Table, event.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, user.CreatedEventsTable, user.CreatedEventsColumn),
		)
		fromV = sqlgraph.Neighbors(u.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// QueryParticipants queries the participants edge of a User.
func (c *UserClient) QueryParticipants(u *User) *ParticipantQuery {
	query := (&ParticipantClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := u.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(user.Table, user.FieldID, id),
			sqlgraph.To(participant.Table, participant.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, user.ParticipantsTable, user.ParticipantsColumn),
		)
		fromV = sqlgraph.Neighbors(u.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *UserClient) Hooks() []Hook {
	return c.hooks.User
}

// Interceptors returns the client interceptors.
func (c *UserClient) Interceptors() []Interceptor {
	return c.inters.User
}

func (c *UserClient) mutate(ctx context.Context, m *UserMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&UserCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&UserUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&UserDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown User mutation op: %q", m.Op())
	}
}

// hooks and interceptors per client, for fast access.
type (
	hooks struct {
		Event, Participant, User []ent.Hook
	}
	inters struct {
		Event, Participant, User []ent.Interceptor
	}
)
