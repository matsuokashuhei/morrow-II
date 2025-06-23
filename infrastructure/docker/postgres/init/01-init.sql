-- Morrow Database Initialization Script

-- Create database if not exists (this is handled by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS morrow_dev;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create initial tables will be handled by Ent migrations
-- This script is for any initial setup that needs to happen before the application starts

-- Log initialization
INSERT INTO pg_stat_statements_info VALUES ('Database initialized for Morrow development environment');

COMMENT ON SCHEMA public IS 'Morrow application database schema';
