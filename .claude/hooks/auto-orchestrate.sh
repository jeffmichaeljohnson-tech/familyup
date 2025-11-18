#!/bin/bash

# Auto-Orchestrate Hook
# Automatically analyzes user prompts and invokes relevant skills
# This hook runs on every user interaction to enable autonomous skill orchestration

HOOK_TYPE="$1"
USER_PROMPT="$2"

# Only run on user-prompt-submit
if [ "$HOOK_TYPE" != "user-prompt-submit" ]; then
  exit 0
fi

# Skip if prompt is empty or very short
if [ -z "$USER_PROMPT" ] || [ ${#USER_PROMPT} -lt 5 ]; then
  exit 0
fi

# Skip for certain meta commands
case "$USER_PROMPT" in
  "/help"*|"/clear"*|"/exit"*|"/quit"*)
    exit 0
    ;;
esac

# Log to stderr (visible in Claude Code console)
echo "[Auto-Orchestrate] Analyzing context..." >&2

# Note: The actual MCP tool calls would be made by Claude Code
# This hook serves as a signal to invoke the orchestrator
# The actual implementation would use the MCP tool: mcp__skill-orchestrator__orchestrate_skills

# Create a marker file to signal orchestration is needed
MARKER_FILE="/tmp/claude-orchestrate-needed.txt"
echo "$USER_PROMPT" > "$MARKER_FILE"

echo "[Auto-Orchestrate] Context analysis complete" >&2

exit 0
