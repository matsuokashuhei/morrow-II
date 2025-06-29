# Morrow Development Makefile

# Development commands
.PHONY: help build up down logs clean install-backend install-frontend

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker containers
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs from all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f postgres

clean: ## Clean up Docker containers and volumes
	docker-compose down -v
	docker system prune -f

install-backend: ## Install backend dependencies
	docker-compose run --rm backend go mod download

install-frontend: ## Install frontend dependencies
	docker-compose run --rm frontend npm install

dev-backend: ## Run backend in development mode
	docker-compose up backend postgres

dev-frontend: ## Run frontend in development mode
	docker-compose up frontend

dev: ## Run full development environment
	docker-compose up

# Linting and formatting commands
.PHONY: lint lint-backend lint-frontend format format-backend format-frontend

lint: lint-backend lint-frontend ## Run all linters

lint-backend: ## Run Go linter
	docker run --rm -v $(PWD):/workspace -w /workspace/backend golangci/golangci-lint:latest golangci-lint run --timeout=5m

lint-frontend: ## Run TypeScript/JavaScript linter
	docker-compose run --rm frontend npm run lint

format: format-backend format-frontend ## Format all code

format-backend: ## Format Go code
	docker run --rm -v $(PWD)/backend:/app -w /app golang:1.23-alpine sh -c "go fmt ./..."

format-frontend: ## Format TypeScript/JavaScript code
	docker-compose run --rm frontend npm run format

# Testing commands
.PHONY: test test-backend test-frontend test-coverage

test: test-backend test-frontend ## Run all tests

test-backend: ## Run Go tests
	docker run --rm -v $(PWD)/backend:/app -w /app -e CGO_ENABLED=1 golang:1.23-alpine sh -c "apk add --no-cache gcc musl-dev && go test -v -race ./..."

test-frontend: ## Run React Native tests
	docker-compose run --rm frontend npm test -- --watchAll=false

test-coverage: ## Run tests with coverage
	docker run --rm -v $(PWD)/backend:/app -w /app -e CGO_ENABLED=1 golang:1.23-alpine sh -c "apk add --no-cache gcc musl-dev && go test -v -race -coverprofile=coverage.out -covermode=atomic ./..."
	docker-compose run --rm frontend npm run test:coverage

# Pre-commit validation
.PHONY: pre-commit validate

pre-commit: format lint test ## Run pre-commit validation (format, lint, test)

validate: ## Validate project before push
	@echo "Running project validation..."
	@make format
	@make lint
	@make test
	@echo "✅ All validation passed!"

# Setup commands
.PHONY: setup setup-hooks

setup: install-backend install-frontend setup-hooks ## Setup development environment

setup-hooks: ## Setup pre-commit hooks
	@echo "Setting up pre-commit hooks..."
	pip install pre-commit
	pre-commit install
	cd frontend && npm run prepare
	@echo "✅ Pre-commit hooks installed!"

# Database commands
db-migrate: ## Run database migrations (Ent)
	docker-compose run --rm backend go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema

db-reset: ## Reset database
	docker-compose down -v postgres
	docker-compose up -d postgres


# Go commands
go-mod-init: ## Initialize Go module
	docker run --rm -v $(PWD)/backend:/app -w /app golang:1.23-alpine go mod init github.com/matsuokashuhei/morrow-backend

go-mod-tidy: ## Tidy Go dependencies
	docker-compose run --rm backend go mod tidy

# React Native commands
rn-install: ## Install React Native dependencies
	docker-compose run --rm frontend npm install

rn-start: ## Start React Native development server
	docker-compose up frontend

# Production commands
prod-build: ## Build production containers
	docker-compose -f docker-compose.prod.yml build

prod-up: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production environment
	docker-compose -f docker-compose.prod.yml down
