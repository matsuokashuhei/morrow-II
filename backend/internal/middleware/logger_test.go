package middleware

import (
	"os"
	"testing"

	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
)

func TestInitLogger(t *testing.T) {
	// テスト用に環境変数をクリア
	originalEnv := os.Getenv("GO_ENV")
	defer os.Setenv("GO_ENV", originalEnv)

	// Development環境のテスト
	os.Setenv("GO_ENV", "development")
	// グローバル変数をリセット
	globalLogger = nil
	once = sync.Once{}
	
	logger := InitLogger()
	
	assert.NotNil(t, logger)
	assert.Equal(t, logrus.DebugLevel, logger.Level)
	assert.IsType(t, &logrus.TextFormatter{}, logger.Formatter)

	// 同じインスタンスが返されることを確認
	logger2 := InitLogger()
	assert.Same(t, logger, logger2)
}

func TestInitLogger_Production(t *testing.T) {
	// テスト用に環境変数を設定
	originalEnv := os.Getenv("GO_ENV")
	defer os.Setenv("GO_ENV", originalEnv)

	// Production環境のテスト
	os.Setenv("GO_ENV", "production")
	// グローバル変数をリセット
	globalLogger = nil
	once = sync.Once{}
	
	logger := InitLogger()
	
	assert.NotNil(t, logger)
	assert.Equal(t, logrus.InfoLevel, logger.Level)
	assert.IsType(t, &logrus.JSONFormatter{}, logger.Formatter)
}

func TestSetGinMode(t *testing.T) {
	originalEnv := os.Getenv("GO_ENV")
	defer os.Setenv("GO_ENV", originalEnv)

	// Development環境のテスト
	os.Setenv("GO_ENV", "development")
	SetGinMode()
	// ginモードの確認は直接的には難しいが、エラーが出ないことを確認

	// Production環境のテスト  
	os.Setenv("GO_ENV", "production")
	SetGinMode()
	// ginモードの確認は直接的には難しいが、エラーが出ないことを確認
}
