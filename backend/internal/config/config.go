package config

import (
	"fmt"
	"os"
	"strconv"
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

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}
