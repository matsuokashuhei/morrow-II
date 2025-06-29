package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port   string
	DBHost string
	DBPort string
	DBName string
	DBUser string
	DBPass string
	Env    string
}

func New() *Config {
	return &Config{
		Port:   getEnv("PORT", "8080"),
		DBHost: getEnv("DB_HOST", "localhost"),
		DBPort: getEnv("DB_PORT", "5432"),
		DBName: getEnv("DB_NAME", "morrow_dev"),
		DBUser: getEnv("DB_USER", "morrow_user"),
		DBPass: getEnv("DB_PASSWORD", "morrow_password"),
		Env:    getEnv("GO_ENV", "development"),
	}
}

func (c *Config) DatabaseURL() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		c.DBUser, c.DBPass, c.DBHost, c.DBPort, c.DBName)
}

func (c *Config) IsDevelopment() bool {
	return c.Env == "development"
}

// DatabaseHost returns the database host for safe logging
func (c *Config) DatabaseHost() string {
	return c.DBHost
}

// DatabasePort returns the database port for safe logging
func (c *Config) DatabasePort() string {
	return c.DBPort
}

// DatabaseName returns the database name for safe logging
func (c *Config) DatabaseName() string {
	return c.DBName
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.Port == "" {
		return fmt.Errorf("port is required")
	}
	if c.DBHost == "" {
		return fmt.Errorf("database host is required")
	}
	if c.DBPort == "" {
		return fmt.Errorf("database port is required")
	}
	if c.DBName == "" {
		return fmt.Errorf("database name is required")
	}
	if c.DBUser == "" {
		return fmt.Errorf("database user is required")
	}
	if c.DBPass == "" {
		return fmt.Errorf("database password is required")
	}
	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
