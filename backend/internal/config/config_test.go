package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	// Setup - Clear environment variables
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("DB_NAME")
	os.Unsetenv("DB_USER")
	os.Unsetenv("DB_PASSWORD")
	os.Unsetenv("GO_ENV")

	// Execute
	cfg := New()

	// Assert default values
	assert.Equal(t, "8080", cfg.Port)
	assert.Equal(t, "localhost", cfg.DBHost)
	assert.Equal(t, "5432", cfg.DBPort)
	assert.Equal(t, "morrow_dev", cfg.DBName)
	assert.Equal(t, "morrow_user", cfg.DBUser)
	assert.Equal(t, "morrow_password", cfg.DBPass)
	assert.Equal(t, "development", cfg.Env)
}

func TestNewWithEnvironmentVariables(t *testing.T) {
	// Setup
	os.Setenv("PORT", "9000")
	os.Setenv("DB_HOST", "test-host")
	os.Setenv("DB_PORT", "5433")
	os.Setenv("DB_NAME", "test_db")
	os.Setenv("DB_USER", "test_user")
	os.Setenv("DB_PASSWORD", "test_pass")
	os.Setenv("GO_ENV", "test")

	// Execute
	cfg := New()

	// Assert environment values
	assert.Equal(t, "9000", cfg.Port)
	assert.Equal(t, "test-host", cfg.DBHost)
	assert.Equal(t, "5433", cfg.DBPort)
	assert.Equal(t, "test_db", cfg.DBName)
	assert.Equal(t, "test_user", cfg.DBUser)
	assert.Equal(t, "test_pass", cfg.DBPass)
	assert.Equal(t, "test", cfg.Env)

	// Cleanup
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("DB_NAME")
	os.Unsetenv("DB_USER")
	os.Unsetenv("DB_PASSWORD")
	os.Unsetenv("GO_ENV")
}

func TestConfig_DatabaseURL(t *testing.T) {
	cfg := &Config{
		DBUser: "testuser",
		DBPass: "testpass",
		DBHost: "testhost",
		DBPort: "5432",
		DBName: "testdb",
	}

	expected := "postgres://testuser:testpass@testhost:5432/testdb?sslmode=disable"
	assert.Equal(t, expected, cfg.DatabaseURL())
}

func TestConfig_IsDevelopment(t *testing.T) {
	tests := []struct {
		env      string
		expected bool
	}{
		{"development", true},
		{"production", false},
		{"test", false},
		{"", false},
	}

	for _, tt := range tests {
		cfg := &Config{Env: tt.env}
		assert.Equal(t, tt.expected, cfg.IsDevelopment(), "Environment: %s", tt.env)
	}
}

func TestConfig_Validate(t *testing.T) {
	// Valid config
	validCfg := &Config{
		Port:   "8080",
		DBHost: "localhost",
		DBPort: "5432",
		DBName: "test",
		DBUser: "user",
		DBPass: "pass",
	}
	assert.NoError(t, validCfg.Validate())

	// Test missing values
	tests := []struct {
		name   string
		config *Config
	}{
		{"missing port", &Config{DBHost: "host", DBPort: "5432", DBName: "db", DBUser: "user", DBPass: "pass"}},
		{"missing db host", &Config{Port: "8080", DBPort: "5432", DBName: "db", DBUser: "user", DBPass: "pass"}},
		{"missing db port", &Config{Port: "8080", DBHost: "host", DBName: "db", DBUser: "user", DBPass: "pass"}},
		{"missing db name", &Config{Port: "8080", DBHost: "host", DBPort: "5432", DBUser: "user", DBPass: "pass"}},
		{"missing db user", &Config{Port: "8080", DBHost: "host", DBPort: "5432", DBName: "db", DBPass: "pass"}},
		{"missing db password", &Config{Port: "8080", DBHost: "host", DBPort: "5432", DBName: "db", DBUser: "user"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Error(t, tt.config.Validate())
		})
	}
}
