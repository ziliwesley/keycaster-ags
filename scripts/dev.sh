#!/bin/bash

# Configuration section
WATCH_DIR="."                                                     # Directory to monitor
TARGET_SCRIPT="./main.tsx"                                        # Script to run
IGNORE_PATTERNS="node_modules|.git"                               # Directories to ignore
DEBOUNCE_DELAY=1                                                  # Debounce delay (seconds)
INSTANCE_NAME=$(cat package.json | grep -oP '"name":\s*"\K[^"]+') # Extract instance name from package.json

# Check if inotifywait is installed
if ! command -v inotifywait &>/dev/null; then
  echo "Error: inotifywait is not installed. Please install inotify-tools first."
  exit 1
fi

# Start/restart the target script
function start_script() {
  # Kill the previous process

  # ags list return a list of running instances
  # Check if the ags instance is already running
  if ags list | grep -q "$INSTANCE_NAME"; then
    echo "The ags instance '$INSTANCE_NAME' is already running. Killing old instance..."
    ags quit -i $INSTANCE_NAME
  fi

  echo -e "\n[$(date +'%T')] Starting script: $TARGET_SCRIPT"
  ags run $TARGET_SCRIPT --gtk4 & # Run in the background
}

# Main monitoring function
function monitor() {
  echo "Starting to monitor directory: $WATCH_DIR"
  echo "Press Ctrl+C to stop monitoring"

  # Initial start
  start_script

  # Use inotifywait to monitor the directory
  inotifywait -m -r -e modify -e create -e delete -e move \
    --exclude "$IGNORE_PATTERNS" \
    "$WATCH_DIR" | while read -r directory event file; do
    # Debounce handling
    if [[ -z "$last_event" || $(($(date +%s) - last_event)) -ge $DEBOUNCE_DELAY ]]; then
      echo -e "\n[$(date +'%T')] Change detected: $directory$file ($event)"
      start_script
    fi
    last_event=$(date +%s)
  done
}

# Cleanup function
function cleanup() {
  echo -e "\nStopping monitoring..."
  if [ -f "$PID_FILE" ]; then
    kill -9 $(cat "$PID_FILE") 2>/dev/null
    rm -f "$PID_FILE"
  fi
  exit 0
}

# Set exit signal handling
trap cleanup SIGINT SIGTERM

# Start monitoring
monitor
