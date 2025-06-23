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

# Database commands
db-migrate: ## Run database migrations (Ent)
	docker-compose run --rm backend go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema

db-reset: ## Reset database
	docker-compose down -v postgres
	docker-compose up -d postgres

# Code quality
lint-backend: ## Lint backend code
	docker-compose run --rm backend golangci-lint run

lint-frontend: ## Lint frontend code
	docker-compose run --rm frontend npm run lint

test-backend: ## Run backend tests
	docker-compose run --rm backend go test ./...

test-frontend: ## Run frontend tests
	docker-compose run --rm frontend npm test

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