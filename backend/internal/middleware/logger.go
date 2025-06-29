package middleware

import (
	"io"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var (
	// globalLogger はアプリケーション全体で使用されるシングルトンのロガー
	globalLogger *logrus.Logger
	// once はロガーの初期化を一度だけ実行するために使用
	once sync.Once
)

// InitLogger はLogrusの初期設定を行う（シングルトンパターン）
func InitLogger() *logrus.Logger {
	once.Do(func() {
		globalLogger = logrus.New()

		// 出力先設定
		globalLogger.SetOutput(os.Stdout)

		// 環境に応じた設定
		env := os.Getenv("GO_ENV")
		if env == "production" {
			globalLogger.SetLevel(logrus.InfoLevel)
			globalLogger.SetFormatter(&logrus.JSONFormatter{})
		} else {
			globalLogger.SetLevel(logrus.DebugLevel)
			globalLogger.SetFormatter(&logrus.TextFormatter{
				FullTimestamp:   true,
				TimestampFormat: "2006-01-02 15:04:05",
				ForceColors:     true,
			})
		}
	})

	return globalLogger
}

// LoggerMiddleware はGinのリクエストログを構造化ログとして出力する
func LoggerMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()

		// リクエスト処理
		c.Next()

		// レスポンス後のログ出力
		endTime := time.Now()
		latency := endTime.Sub(startTime)

		fields := logrus.Fields{
			"status":      c.Writer.Status(),
			"method":      c.Request.Method,
			"path":        c.Request.URL.Path,
			"ip":          c.ClientIP(),
			"user_agent":  c.Request.UserAgent(),
			"latency":     latency,
			"time":        endTime.Format("2006-01-02 15:04:05"),
		}

		// クエリパラメータがある場合は追加
		if c.Request.URL.RawQuery != "" {
			fields["query"] = c.Request.URL.RawQuery
		}

		// ステータスコードに応じたログレベル
		status := c.Writer.Status()
		switch {
		case status >= 500:
			logger.WithFields(fields).Error("Server Error")
		case status >= 400:
			logger.WithFields(fields).Warn("Client Error")
		case status >= 300:
			logger.WithFields(fields).Info("Redirection")
		default:
			logger.WithFields(fields).Info("Success")
		}
	}
}

// Logger returns a gin.HandlerFunc that logs requests using logrus
// (後方互換性のために残す)
func Logger() gin.HandlerFunc {
	return LoggerMiddleware(InitLogger())
}

// RequestLogger creates a structured logger for the current request
func RequestLogger(c *gin.Context) *logrus.Entry {
	return InitLogger().WithFields(logrus.Fields{
		"request_id": c.GetHeader("X-Request-ID"),
		"path":       c.Request.URL.Path,
		"method":     c.Request.Method,
	})
}

// SetGinMode はGinのログ出力を環境に応じて設定する
func SetGinMode() {
	env := os.Getenv("GO_ENV")
	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
		gin.DefaultWriter = io.Discard
	} else {
		gin.SetMode(gin.DebugMode)
	}
}
