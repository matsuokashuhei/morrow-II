package middleware

import (
	"io"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// InitLogger はLogrusの初期設定を行う
func InitLogger() *logrus.Logger {
	log := logrus.New()

	// 出力先設定
	log.SetOutput(os.Stdout)

	// 環境に応じた設定
	env := os.Getenv("GO_ENV")
	if env == "production" {
		log.SetLevel(logrus.InfoLevel)
		log.SetFormatter(&logrus.JSONFormatter{})
	} else {
		log.SetLevel(logrus.DebugLevel)
		log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02 15:04:05",
			ForceColors:     true,
		})
	}

	return log
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
	logger := InitLogger()
	return LoggerMiddleware(logger)
}

// RequestLogger creates a structured logger for the current request
func RequestLogger(c *gin.Context) *logrus.Entry {
	logger := InitLogger()

	return logger.WithFields(logrus.Fields{
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
