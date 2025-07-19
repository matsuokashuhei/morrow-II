# Morrow - Event Countdown Sharing App - AI Coding Guidelines

## Project Architecture Overview

**Morrow** is a full-stack event countdown sharing application with Go backend + React frontend architecture:

- **Backend**: Go 1.23 + Gin + Ent ORM + PostgreSQL + GraphQL (gqlgen)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Apollo Client
- **Infrastructure**: Docker Compose development environment
- **Development**: Monorepo with `backend/` and `frontend/` directories

## Essential Development Workflows

### 1. Development Environment
```bash
# Primary development commands - USE THESE
make dev              # Start full environment (backend + frontend + postgres)
make dev-backend      # Backend only (port 8080)
make dev-frontend     # Frontend only (port 3000)

# Code quality - ALWAYS run before committing
make pre-commit       # Format + lint + test (REQUIRED before PR)
make lint             # Lint all code
make test             # Run all tests
```

### 2. GraphQL Development Pattern
- **Schema First**: Edit `backend/graph/schema.graphqls` → run `go generate ./...`
- **Frontend Codegen**: After schema changes, run `npm run codegen` in frontend/
- **Ent Integration**: Ent entities auto-generate GraphQL types (see `backend/ent/schema/`)

### 3. Database Changes
- **Ent Schema**: Modify files in `backend/ent/schema/` (event.go, user.go, participant.go)
- **Generate**: Run `go generate ./...` to update Ent + GraphQL code
- **Migration**: Use Atlas migration files (see `backend/atlas.hcl`)

## Project-Specific Conventions

### Backend (Go)
- **Resolver Pattern**: GraphQL resolvers in `backend/graph/*.resolvers.go`
- **Ent ORM**: Database entities in `backend/ent/schema/` with GraphQL annotations
- **Japanese Comments**: All Ent field comments are in Japanese (keep this pattern)
- **Time Fields**: Use `field.Time()` with `time.Now` defaults for created_at/updated_at

### Frontend (React)
- **Component Structure**: UI components in `src/components/ui/`, screens in `src/screens/`
- **GraphQL Patterns**: Queries in `src/graphql/queries/*.graphql`, use generated hooks
- **State Management**: Zustand for global state (see existing patterns)
- **Styling**: Tailwind CSS with custom color scheme (orange-600 primary)

### Testing Requirements
- **Backend**: Go tests with `_test.go` suffix, coverage reports required
- **Frontend**: Jest + React Testing Library, all components should have tests
- **CI/CD**: All tests must pass before merge (see `.github/workflows/ci.yml`)

## Critical Integration Points

### GraphQL Schema Synchronization
1. Backend schema changes require frontend codegen refresh
2. Schema endpoint: `http://backend:8080/query` (Docker) or `http://localhost:8080/query`
3. Frontend codegen: `npm run codegen` generates TypeScript types + Apollo hooks

### Database Connection Patterns
- **Development**: PostgreSQL via Docker Compose (postgres:5432)
- **Env Variables**: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- **Migration**: Use Atlas for schema migrations, Ent for code generation

### Docker Environment
- **Services**: postgres (5432), backend (8080), frontend (3000)
- **Volumes**: Persistent postgres data, Go mod cache, node_modules cache
- **Network**: All services on `morrow-network` bridge

## Key Commands Reference

```bash
# Development
make dev                    # Full stack development
docker-compose logs -f      # View all service logs

# Code Quality (MANDATORY before commits)
make pre-commit            # Full validation pipeline
make lint-backend          # Go linting (golangci-lint)
make lint-frontend         # TS/React linting (ESLint)

# Backend Specific - ALWAYS use Docker Compose
docker compose run --rm backend go generate ./...    # Regenerate Ent + GraphQL
docker compose run --rm backend go test -v ./...     # Run backend tests
docker compose run --rm backend go mod tidy          # Clean dependencies

# Frontend Specific - ALWAYS use Docker Compose
docker compose run --rm frontend npm run codegen     # Generate GraphQL types
docker compose run --rm frontend npm run type-check  # TypeScript validation
docker compose run --rm frontend npm install         # Install dependencies
```

## Always Remember
- **Docker Commands Only**: Use `docker compose run --rm backend go ...` and `docker compose run --rm frontend npm ...` instead of direct commands
- **Japanese for Ent comments**: Keep database field comments in Japanese
- **CI/CD First**: All CI jobs must pass before code review
- **Schema Sync**: Backend GraphQL changes require frontend codegen
- **Docker First**: Use Docker Compose for consistent development environment
