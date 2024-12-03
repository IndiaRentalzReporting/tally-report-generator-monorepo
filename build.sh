#!/bin/bash

# Define apps
APPS=(
  "@trg_app/auth-server"
  "@trg_app/dashboard-server"
  "@trg_app/auth-client"
  "@trg_app/dashboard-client"
)

build_app() {
  local app_name=$1
  local app_dir=$(echo "$app_name" | cut -d'/' -f2) # Extract the app directory from the app name
  
  echo "🚀 Building Docker image for $app_name..."
  
  docker build \
    --build-arg APP_NAME="$app_name" \
    -t "$app_dir:latest" \
    "./apps/$app_dir"
  
  if [ $? -eq 0 ]; then
    echo "✅ Successfully built image for $app_name"
  else
    echo "❌ Failed to build image for $app_name"
    exit 1
  fi
}

for app in "${APPS[@]}"; do
  build_app "$app"
done
