#!/usr/bin/env bash
# scripts/install-hooks.sh
# Installs git hooks to run automated checks before committing or pushing.

set -e

HOOK_DIR=".git/hooks"
PRE_PUSH_HOOK="$HOOK_DIR/pre-push"
PRE_COMMIT_HOOK="$HOOK_DIR/pre-commit"

echo "Installing Git Hooks..."

mkdir -p "$HOOK_DIR"

# 1. Pre-push hook: run lint, typecheck, and tests
echo "Creating $PRE_PUSH_HOOK..."
cat << 'EOF' > "$PRE_PUSH_HOOK"
#!/usr/bin/env bash
set -eo pipefail

echo "Running pre-push checks inside Docker container..."

echo "1/3 Checking environment synchronization..."
./scripts/check-env-sync.sh

echo "2/3 Running linter..."
if ! docker compose exec -T workspace npm run lint; then
    echo "ERROR: Linting failed! Aborting push."
    exit 1
fi

echo "3/3 Running unit tests..."
if ! docker compose exec -T workspace npm run test; then
    echo "ERROR: Tests failed! Aborting push."
    exit 1
fi

echo "Success: All pre-push checks passed successfully!"
EOF

# 2. Pre-commit hook: verify env sync
echo "Creating $PRE_COMMIT_HOOK..."
cat << 'EOF' > "$PRE_COMMIT_HOOK"
#!/usr/bin/env bash
set -eo pipefail

echo "Running pre-commit checks..."
if ! ./scripts/check-env-sync.sh; then
    echo "ERROR: Environment variable check failed! Aborting commit."
    exit 1
fi
EOF

chmod +x "$PRE_PUSH_HOOK"
chmod +x "$PRE_COMMIT_HOOK"

echo "Git hooks installed successfully!"
