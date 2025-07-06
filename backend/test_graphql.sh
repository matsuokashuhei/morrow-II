#!/bin/bash

# GraphQL テスト実行スクリプト
# PostgreSQLを使用したGraphQLテストを実行します

set -e

echo "🧪 GraphQL テスト開始..."

# テスト用データベースの環境変数を設定
export TEST_DB_HOST=postgres
export TEST_DB_PORT=5432
export TEST_DB_NAME=morrow_test
export TEST_DB_USER=morrow_user
export TEST_DB_PASSWORD=morrow_password

# テスト用データベースが存在しない場合は作成
echo "📦 テスト用データベース準備..."
echo "⏳ PostgreSQLの準備を確認中..."
until docker-compose exec -T postgres pg_isready -U morrow_user -h ${TEST_DB_HOST} -p 5432; do
    echo "PostgreSQLが準備中です。1秒後に再試行します..."
    sleep 1
done
echo "✅ PostgreSQLが準備完了!"
docker-compose exec -T postgres psql -U morrow_user -d postgres -c "CREATE DATABASE morrow_test;" 2>/dev/null || echo "テストDB既存 or 作成済み"

# GraphQLテストを実行
echo "🚀 GraphQLテスト実行..."
docker-compose exec -T -e TEST_DB_HOST=postgres \
                     -e TEST_DB_PORT=5432 \
                     -e TEST_DB_NAME=morrow_test \
                     -e TEST_DB_USER=morrow_user \
                     -e TEST_DB_PASSWORD=morrow_password \
                     backend go test ./graph -v

echo "✅ GraphQLテスト完了!"
