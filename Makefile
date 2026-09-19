.PHONY: help install setup dev test clean

help:
	@echo "Facebook Ads → Privyr Integration"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make setup      - Initial setup (install deps, create .env)"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make test       - Run test suite"
	@echo "  make clean      - Remove node_modules and .env"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	npm install

setup:
	@echo "🚀 Setting up integration..."
	bash setup.sh

dev:
	@echo "🔧 Starting development server..."
	npm run dev

test:
	@echo "🧪 Running tests..."
	node test-integration.js

clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules package-lock.json
	@echo "✅ Cleaned. Run 'make install' to reinstall."

.DEFAULT_GOAL := help
