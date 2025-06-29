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

-- Create a log table for tracking initialization
CREATE TABLE IF NOT EXISTS initialization_log (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log initialization
INSERT INTO initialization_log (message) VALUES ('Database initialized for Morrow development environment');

COMMENT ON SCHEMA public IS 'Morrow application database schema';
