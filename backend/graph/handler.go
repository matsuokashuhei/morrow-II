package graph

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
	"github.com/matsuokashuhei/morrow-backend/ent"
	"github.com/vektah/gqlparser/v2/ast"
)

// GraphQLHandler creates a GraphQL handler for the Gin router
func GraphQLHandler(client *ent.Client) gin.HandlerFunc {
	// Create resolver with Ent client
	resolver := &Resolver{
		Client: client,
	}

	// Create GraphQL server
	srv := handler.New(NewExecutableSchema(Config{
		Resolvers: resolver,
	}))

	// Add transports
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})

	// Add cache
	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	// Add extensions
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return gin.WrapH(srv)
}

// PlaygroundHandler creates a GraphQL playground handler
func PlaygroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL Playground", "/graphql")
	return gin.WrapH(h)
}
